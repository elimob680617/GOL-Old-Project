import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { Editor, Transforms, Range, createEditor, Descendant, BaseEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import { Slate, Editable, ReactEditor, withReact } from 'slate-react';
import ReactDOM from 'react-dom';
import { Avatar, Box, CircularProgress, Grid, Stack, styled, Typography, ClickAwayListener } from '@mui/material';
import { useLazyGetUserQuery } from 'src/_requests/graphql/post/create-post/queries/getUserQuery.generated';
import { useLazySearchTagQuery } from 'src/_requests/graphql/post/create-post/queries/searchTag.generated';
import { useDispatch, useSelector } from 'react-redux';
import { jsx } from 'slate-hyperscript';
import { basicCreateSocialPostSelector, setText } from 'src/redux/slices/post/createSocialPost';
import { useCreateTagMutation } from 'src/_requests/graphql/post/create-post/mutations/createTag.generated';

import { basicSharePostSelector, setSharedPostText } from 'src/redux/slices/post/sharePost';
import { basicSendPostSelector, setSendPostText } from 'src/redux/slices/post/sendPost';

export const Portal = ({ children }: any) =>
  typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;

const textValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  } as Descendant,
];
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type MentionElement = {
  type: 'mention';
  username: string;
  children: any[];
  id: string;
  fullname: string;
};
export type tagElement = {
  type: 'tag';
  title: string;
  id: string;
  children: any[];
};

const ClickableBoxStyle = styled(Box)(({ theme }) => ({}));

const MentionExample = (props: any) => {
  const { setListOfRichs, media, setTextLimitation, placeholder, eventType, value, onChange } = props;
  // const dispatch = useDispatch();
  // const post = useSelector(basicCreateSocialPostSelector);

  // const postShared = useSelector(basicSharePostSelector);
  // const postSent = useSelector(basicSendPostSelector);

  const [mentionTarget, setMentionTarget] = useState<Range | undefined | null>();
  const [hashtagTarget, setHashtagTarget] = useState<Range | undefined | null>();
  const deserlizeValue = useRef<any>([]);
  const slateInitialValue: Descendant[] =
    eventType === 'createPost' ? value : eventType === 'sharePost' ? value : value;
  console.log('postShared.text', value);
  console.log('eventType', eventType);

  const [slateValue, setSlateValue] = useState<Descendant[]>(slateInitialValue);
  const mentionRef = useRef<HTMLDivElement | null>();
  const hashtagRef = useRef<HTMLDivElement | null>();
  const [index, setIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(() => withEditor(withReact(withHistory<CustomEditor>(createEditor() as CustomEditor))), []);
  const [getUser, { isFetching: fetchingUser, data: users }] = useLazyGetUserQuery();
  const [getTag, { isFetching: fetchingTag, data: tags }] = useLazySearchTagQuery();
  const [newTag, setNewTag] = useState('');
  const [createTagMutation] = useCreateTagMutation();
  const [textLength, setTextLength] = useState<number>(0);

  const mentionHeight = 42;
  const hashtagHeight = 50;

  useEffect(() => {
    if (!mentionSearch) {
      setMentionTarget(null);
    }
    getUser({ filter: { dto: { searchText: mentionSearch } } });
  }, [mentionSearch]);

  useEffect(() => {
    if (!tagSearch) {
      setHashtagTarget(null);
    }
    getTag({ filter: { dto: { title: tagSearch } } });
  }, [tagSearch]);

  useEffect(() => {
    if (mentionTarget) {
      const el = mentionRef.current;
      const domRange = ReactEditor.toDOMRange(editor, mentionTarget);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      }
    }
    if (hashtagTarget) {
      const el = hashtagRef.current;
      const domRange = ReactEditor.toDOMRange(editor, hashtagTarget);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      }
    }
  }, [editor, index, mentionTarget, hashtagTarget, mentionSearch]);

  const createHashtag = () => {
    const newTagState = newTag;
    setNewTag('');
    createTagMutation({
      tag: {
        dto: {
          title: newTagState,
        },
      },
    })
      .unwrap()
      .then((res) => {
        Transforms.select(editor, hashtagTarget!);
        insertTag(
          editor,
          res?.createTag?.listDto?.items?.[0]?.title || '',
          res?.createTag?.listDto?.items?.[0]?.id || ''
        );
        setHashtagTarget(null);
      })
      .catch((err) => {});
  };
  const convertToHtml = (value: any[]) => {
    let html = '';
    value.map((children) => {
      html += '<p>';
      if (children.children)
        children.children.map((node: any) => {
          if (!node.type) {
            html += node.text;
          } else {
            switch (node.type) {
              case 'mention':
                html += `
              <span
              data-cy="mention-${node.username}"
              {user?.headLine?.substring(0,30) || ''}{user?.headLine ? " ...": "" }
              username="${node.username}"
              class="inserted-mention"
              fullname=${node.fullname}
              id="${node.id}"
            >
                ${node.fullname}
            </span>`;
                break;
              case 'tag':
                html += `<span
                data-cy="tag-${node.title}"
                class="inserted-tag"
                id="${node.id}"
                title=${node.title}
              >
                  #${node.title}
              </span>`;
                break;
              // case 'br':
              //   html += '<br/>';
              //   break;
              default:
                break;
            }
          }
        });
      html += '</p>';
    });
    return html;
  };

  useEffect(() => {
    if (props.getValue !== null) {
      const htmlValue = convertToHtml(slateValue);
      const jsonValue = deserialize(new DOMParser().parseFromString(htmlValue, 'text/html').body);
    }
  }, [props.getValue]);

  const ELEMENT_TAGS: any = {
    A: (el: any) => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: 'quote' }),
    H1: () => ({ type: 'heading-one' }),
    H2: () => ({ type: 'heading-two' }),
    H3: () => ({ type: 'heading-three' }),
    H4: () => ({ type: 'heading-four' }),
    H5: () => ({ type: 'heading-five' }),
    H6: () => ({ type: 'heading-six' }),
    IMG: (el: any) => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'paragraph' }),
    PRE: () => ({ type: 'code' }),
    UL: () => ({ type: 'bulleted-list' }),
  };

  // COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
  const TEXT_TAGS: any = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true }),
  };

  const deserialize = (el: any) => {
    if (el.nodeType === 3) {
      return el.textContent.trim();
    } else if (el.nodeType !== 1) {
      return null;
    } else if (el.nodeName === 'BR') {
      return '\n';
    }

    const { nodeName } = el;
    let parent = el;

    if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
      parent = el.childNodes[0];
    }
    let children: any = Array.from(parent.childNodes).map(deserialize).flat();

    if (children.length === 0) {
      children = [{ text: '' }];
    }

    if (el.nodeName === 'BODY') {
      return jsx('fragment', {}, children);
    }

    if (el.className === 'inserted-mention') {
      return jsx(
        'element',
        {
          type: 'mention',
          fullname: children[0].trim(),
          username: el.getAttribute('username'),
          id: el.id,
          class: 'inserted-mention',
        },
        children[0].trim()
      );
    }

    if (el.className === 'inserted-tag') {
      return jsx(
        'element',
        { type: 'tag', title: el.getAttribute('title'), id: el.id, class: 'inserted-tag' },
        children[0].trim()
      );
    }

    if (ELEMENT_TAGS[nodeName]) {
      const attrs = ELEMENT_TAGS[nodeName](el);
      return jsx('element', attrs, children);
    }

    if (TEXT_TAGS[nodeName]) {
      const attrs = TEXT_TAGS[nodeName](el);
      return children.map((child: any) => jsx('text', attrs, child));
    }

    return children;
  };

  const onKeyDown = useCallback(
    (event) => {
      if (mentionTarget) {
        const mentions =
          (users &&
            users.getUserQuery &&
            users.getUserQuery.listDto &&
            users.getUserQuery.listDto.items &&
            users.getUserQuery.listDto.items) ||
          [];
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= mentions.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            mentionRef.current!.scrollTo({ top: prevIndex > 0 ? mentionRef.current!.scrollTop + mentionHeight : 0 });
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? mentions.length - 1 : index - 1;
            setIndex(nextIndex);
            mentionRef.current!.scrollTo({
              top:
                nextIndex !== mentions.length - 1
                  ? mentionRef.current!.scrollTop - mentionHeight
                  : (mentions.length - 1) * mentionHeight,
            });
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, mentionTarget);
            insertMention(editor, mentions[index]!.userName!, mentions[index]!.id!, mentions[index]!.fullName!);
            setMentionTarget(null);
            setIndex(0);
            break;
          case 'Escape':
            event.preventDefault();
            setMentionTarget(null);
            setIndex(0);
            break;
        }
      }

      if (hashtagTarget) {
        const searchedTags =
          (tags && tags.recommendedTags && tags.recommendedTags.listDto && tags.recommendedTags.listDto.items) || [];
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= searchedTags.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            hashtagRef.current!.scrollTo({ top: prevIndex > 0 ? hashtagRef.current!.scrollTop + hashtagHeight : 0 });
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? searchedTags.length - 1 : index - 1;
            setIndex(nextIndex);
            hashtagRef.current!.scrollTo({
              top:
                nextIndex !== searchedTags.length - 1
                  ? hashtagRef.current!.scrollTop - hashtagHeight
                  : (searchedTags.length - 1) * hashtagHeight,
            });
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, hashtagTarget);
            if (searchedTags.length > 0) {
              insertTag(editor, searchedTags[index]!.title!, searchedTags[index]!.id!);
            } else {
              createHashtag();
            }
            setHashtagTarget(null);
            setIndex(0);
            break;
          case 'Escape':
            event.preventDefault();
            setHashtagTarget(null);
            setIndex(0);
            break;
          case ' ':
            event.preventDefault();
            if (newTag) {
              createHashtag();
            }
            break;
        }
      }
    },
    [index, hashtagTarget, mentionTarget, users, tags]
  );
  const handleTextLimit = (value: any) => {
    let postText = '';
    value.map((item) => {
      item.children &&
        item?.children.map &&
        item.children.map((obj: any) => {
          obj.text
            ? (postText += obj.text)
            : obj.type === 'tag'
            ? (postText += `#${obj.title}`)
            : obj.type === 'mention'
            ? (postText += `@${obj.fullname}`)
            : (postText += '');
        });
      postText += ' ';
    });
    setTextLength(postText.length - 1);
    setTextLimitation(postText.length - 1);
  };
  return (
    <Slate
      editor={editor}
      value={slateValue}
      onChange={(value) => {
        // const html = convertToHtml(value);

        // const deserializeToHtml = convertToHtmlForUpdate(value);
        // const document = new DOMParser().parseFromString(deserializeToHtml, 'text/html');
        // let deserilize = deserialize(document.body);
        // deserilize = removeIncorrectNodes(deserilize);
        setSlateValue(value);
        eventType === 'createPost' && textLength > 3000 ? onChange(textValue) : onChange(value);
        eventType === 'sharePost' && textLength > 3000 ? onChange(textValue) : onChange(value);
        eventType === 'sendPost' && textLength > 1000 ? onChange(textValue) : onChange(value);
        setListOfRichs(value);
        handleTextLimit(value);
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: 'word' });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeHashtagMatch = beforeText && beforeText.match(/^#(\w+)$/);
          const beforeMentionMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeHashtagMatch && afterMatch) {
            setNewTag(beforeHashtagMatch[1]);
            setHashtagTarget(beforeRange);
            setTagSearch(beforeHashtagMatch[1]);
            return;
          } else if (beforeMentionMatch && afterMatch) {
            setMentionTarget(beforeRange);
            setMentionSearch(beforeMentionMatch[1]);
            return;
          } else {
            setMentionTarget(null);
            setHashtagTarget(null);
          }
        }
      }}
    >
      <Typography variant="subtitle1">
        <Typography variant="body1" color={textLength >= 3001 ? 'red' : 'text/disabled'}>
          <Editable
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            placeholder={placeholder ? placeholder : 'What do you want to talk about?'}
            aria-disabled={true}
            disabled={true}
            style={media?.length === 0 ? { width: '100%', height: '19rem', zIndex: 1 } : { width: '100%', zIndex: 1 }}
          />
        </Typography>
        {mentionTarget && users?.getUserQuery?.listDto?.items?.length !== 0 && (
          <Portal>
            <ClickAwayListener
              onClickAway={() => {
                setIndex(0);
                setMentionTarget(null);
              }}
            >
              <Box
                ref={mentionRef}
                sx={{
                  top: '-9999px',
                  left: '35%',
                  right: '35%',
                  position: 'absolute',
                  zIndex: 9999,
                  padding: 2,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                  maxHeight: 296,
                  overflow: 'auto',
                  width: '500px',
                }}
                data-cy="mentions-portal"
              >
                {!fetchingUser &&
                  users &&
                  users.getUserQuery &&
                  users.getUserQuery.listDto &&
                  users.getUserQuery.listDto.items &&
                  users.getUserQuery.listDto.items.map((user, i) => (
                    <Box
                      onClick={() => {
                        Transforms.select(editor, mentionTarget);
                        insertMention(editor, user!.userName!, user!.id!, user!.fullName!);
                        setMentionTarget(null);
                      }}
                      key={i}
                      sx={{
                        padding: '1px 3px',
                        borderRadius: '3px',
                        backgroundColor: i === index ? 'primary.light' : 'transparent',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar src={user?.avatarUrl || ''} sx={{ marginRight: 1 }} />
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="caption">{user?.fullName || ''}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            {user?.headLine?.substring(0, 25) || ''}
                            {user?.headLine ? ' ...' : ''}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}

                {fetchingUser && (
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                )}
              </Box>
            </ClickAwayListener>
          </Portal>
        )}

        {hashtagTarget && tags?.recommendedTags?.listDto?.items?.length !== 0 && (
          <Portal>
            <ClickAwayListener
              onClickAway={() => {
                setIndex(0);
                setHashtagTarget(null);
                createHashtag();
              }}
            >
              <Box
                ref={hashtagRef}
                sx={{
                  top: '-9999px',
                  left: '35%',
                  right: '35%',
                  position: 'absolute',
                  zIndex: 9999,
                  padding: 2,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                  maxHeight: 296,
                  overflow: 'auto',
                  width: '500px',
                }}
                data-cy="mentions-portal"
              >
                {!fetchingTag &&
                  tags &&
                  tags.recommendedTags &&
                  tags.recommendedTags.listDto &&
                  tags.recommendedTags.listDto.items && (
                    <Stack spacing={2}>
                      {tags.recommendedTags.listDto.items.map((tag, i) => (
                        <ClickableBoxStyle
                          onClick={() => {
                            Transforms.select(editor, hashtagTarget);
                            insertTag(editor, tag!.title!, tag!.id!);
                            setHashtagTarget(null);
                          }}
                          sx={{ cursor: 'pointer', backgroundColor: i === index ? 'primary.light' : 'transparent' }}
                          key={i}
                        >
                          <Stack spacing={0.5}>
                            <Typography
                              variant="overline"
                              sx={{
                                fontWeight: 500,
                                fontSize: 12,
                                lineHeight: '15px',
                                color: 'text.primary',
                                textTransform: 'lowercase',
                              }}
                            >
                              #{tag!.title}
                            </Typography>
                            <Typography
                              variant="overline"
                              sx={{ fontWeight: 500, fontSize: 12, lineHeight: '15px', color: 'text.secondary' }}
                            >
                              {tag!.count} posts
                            </Typography>
                          </Stack>
                        </ClickableBoxStyle>
                      ))}
                    </Stack>
                  )}

                {fetchingTag && (
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                )}
              </Box>
            </ClickAwayListener>
          </Portal>
        )}
      </Typography>
    </Slate>
  );
};

const withEditor = (editor: any) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => (element.type === 'mention' || element.type === 'tag' ? true : isInline(element));

  editor.isVoid = (element: any) => (element.type === 'mention' || element.type === 'tag' ? true : isVoid(element));

  return editor;
};

const insertMention = (editor: any, username: string, id: string, fullname: string) => {
  const mention: MentionElement = {
    type: 'mention',
    username,
    children: [{ text: '' }],
    id,
    fullname,
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
const insertTag = (editor: any, title: string, id: string) => {
  const tag: tagElement = {
    type: 'tag',
    title,
    id,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, tag);
  Transforms.move(editor);
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />;
    case 'tag':
      return <Tags {...props} />;
    case 'br':
      return <Br {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
const Tags = ({ attributes, children, element }: any) => (
  <Typography
    variant="subtitle1"
    color="primary.main"
    contentEditable={false}
    className="inserted-tag"
    sx={{
      // padding: '3px 3px 2px',
      // margin: '0 1px',
      verticalAlign: 'baseline',
      display: 'inline-block',
    }}
  >
    #{element.title}
    {children}
  </Typography>
);
const Br = ({ attributes, children, element }: any) => (
  <span {...attributes}>
    <br />
  </span>
);
const Mention = ({ attributes, children, element }: any) => (
  <Typography
    variant="subtitle1"
    color="primary.main"
    contentEditable={false}
    className="inserted-mention"
    sx={{
      // padding: '3px 3px 2px',
      // margin: '0 1px',
      verticalAlign: 'baseline',
      display: 'inline-block',
    }}
  >
    {element.fullname}
    {children}
  </Typography>
);

export default MentionExample;
