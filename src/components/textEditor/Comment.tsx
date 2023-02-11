import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Descendant, Transforms, Range, BaseEditor, Editor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { basicCreateSocialPostSelector, setInPutId, setText } from 'src/redux/slices/post/createSocialPost';
import { styled } from '@mui/material/styles';
import { Avatar, Box, CircularProgress, ClickAwayListener, Grid, Stack, Typography } from '@mui/material';
import { useLazyGetUserQuery } from 'src/_requests/graphql/post/create-post/queries/getUserQuery.generated';
import { useLazySearchTagQuery } from 'src/_requests/graphql/post/create-post/queries/searchTag.generated';
import { useCreateTagMutation } from 'src/_requests/graphql/post/create-post/mutations/createTag.generated';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export const Portal = ({ children }: any) =>
  typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;
const ClickableBoxStyle = styled(Box)(({ theme }) => ({}));

const CEBox = styled(Box)(({ theme }) => ({
  body: {
    '&::-webkit-scrollbar': {
      width: 12,
    },

    '&::-webkit-scrollbar-track': {
      background: theme.palette.grey[0],
      borderRadius: 8,
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.grey[300],
      borderRadius: 10,
      border: `4px solid ${theme.palette.grey[0]}`,
    },
  },
}));
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
export interface IReturnEditorObj {
  body: Descendant[];
}
interface ICommentTextEditor {
  setListOfRichs?: (listOfRichs: any[]) => void;
  placeholder?: string;
  getValueFlag?: number;
  returnEditorObject?: (editorValue: IReturnEditorObj) => void;
  reply?: boolean;
  isComment?: boolean;
  isSearch?: boolean;
  inputId?: any;
}

const CommentTextEditor = (props: ICommentTextEditor) => {
  const { getValueFlag, reply, isComment, inputId } = props;
  const dispatch = useDispatch();
  const post = useSelector(basicCreateSocialPostSelector);
  const [mentionTarget, setMentionTarget] = useState<Range | undefined | null>();
  const [hashtagTarget, setHashtagTarget] = useState<Range | undefined | null>();
  const slateInitialValue: Descendant[] = post.text;
  const [slateValue, setSlateValue] = useState<Descendant[]>(slateInitialValue);
  const mentionRef = useRef<HTMLDivElement | null>();
  const hashtagRef = useRef<HTMLDivElement | null>();
  const [index, setIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(() => withEditor(withReact(withHistory<CustomEditor>(createEditor() as CustomEditor))), []);
  const [getUser, { isFetching: fetchingUser, data: users }] = useLazyGetUserQuery();
  const [getTag, { isFetching: fetchingTag, data: tags }] = useLazySearchTagQuery();
  const [newTag, setNewTag] = useState('');
  const [createTagMutation] = useCreateTagMutation();

  const mentionHeight = 42;
  const hashtagHeight = 50;

  useEffect(() => {
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValueFlag]);

  useEffect(() => {
    if (!mentionSearch) {
      setMentionTarget(null);
    } else {
      getUser({ filter: { dto: { searchText: mentionSearch } } });
    }
  }, [getUser, mentionSearch]);

  useEffect(() => {
    if (!tagSearch) {
      setHashtagTarget(null);
    } else {
      getTag({ filter: { dto: { title: tagSearch } } });
    }
  }, [getTag, tagSearch]);

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

  const createHashtag = useCallback(() => {
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
  }, [createTagMutation, editor, hashtagTarget, newTag]);
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
  // const convertToHtml = (value: any[]) => {
  //   let html = '';
  //   value.map((children) => {
  //     html += '<p>';
  //     if (children.children)
  //       children.children.map((node: any) => {
  //         if (!node.type) {
  //           html += node.text;
  //         } else {
  //           switch (node.type) {
  //             case 'mention':
  //               html += `
  //             <span
  //             data-cy="mention-${node.username}"
  //             {user?.headLine?.substring(0,30) || ''}{user?.headLine ? " ...": "" }
  //             username="${node.username}"
  //             class="inserted-mention"
  //             fullname=${node.fullname}
  //             id="${node.id}"
  //           >
  //               ${node.fullname}
  //           </span>`;
  //               break;
  //             case 'tag':
  //               html += `<span
  //               data-cy="tag-${node.title}"
  //               class="inserted-tag"
  //               id="${node.id}"
  //               title=${node.title}
  //             >
  //                 #${node.title}
  //             </span>`;
  //               break;
  //             // case 'br':
  //             //   html += '<br/>';
  //             //   break;
  //             default:
  //               break;
  //           }
  //         }
  //       });
  //     html += '</p>';
  //   });
  //   return html;
  // };

  // useEffect(() => {
  //   returnEditorObject({ body: slateValue });
  // }, [returnEditorObject, slateValue]);

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
    [mentionTarget, hashtagTarget, users, index, editor, tags, newTag, createHashtag]
  );

  return (
    <CEBox>
      <Slate
        editor={editor}
        value={slateValue}
        onChange={(value) => {
          setSlateValue(value);
          dispatch(setText(value));
          dispatch(setInPutId(inputId));
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
        <Editable
          placeholder={reply ? 'Enter some plain...' : 'Enter some plain text...'}
          style={{
            width: reply ? 150 : isComment ? 200 : 260,
            maxHeight: 124,
            overflowX: 'auto',
          }}
          onKeyDown={onKeyDown}
          renderElement={renderElement}
          disabled={true}
        />
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
                  left: 530,
                  right: 530,
                  position: 'absolute',
                  zIndex: 9999,
                  padding: 2,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                  maxHeight: 296,
                  width: 350,
                  overflow: 'auto',
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
                  left: 530,
                  right: 530,
                  position: 'absolute',
                  zIndex: 9999,
                  padding: 2,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                  maxHeight: 296,
                  width: 350,
                  overflow: 'auto',
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
      </Slate>
    </CEBox>
  );
};
const withEditor = (editor: any) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => (element.type === 'mention' || element.type === 'tag' ? true : isInline(element));

  editor.isVoid = (element: any) => (element.type === 'mention' || element.type === 'tag' ? true : isVoid(element));

  return editor;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as Descendant,
];

export default CommentTextEditor;
