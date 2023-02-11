import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Resumable from 'resumablejs';
import { createEditor, Descendant, Editor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import useDebounce from 'src/utils/useDebounce';
import { useCreateTagMutation } from 'src/_requests/graphql/post/create-post/mutations/createTag.generated';
import { useLazySearchTagQuery } from 'src/_requests/graphql/post/create-post/queries/searchTag.generated';
import { v4 as uuidv4 } from 'uuid';
import {
  convertToHtml,
  createParagraphNode,
  deserialize,
  deserializeForPasted,
  editLink,
  getCaretGlobalPosition,
  handleInsertLink,
  insertImage,
  insertLink,
  insertTag,
  isBlockActive,
  TEXT_ALIGN_TYPES,
  validateYoutube,
} from './advancedFunctions';
import { withHashTag, withHtml, withLinks } from './advancedHooks';
import Tags from './AdvancedTag';
import BlockButton from './BlockButton';
import Heading from './Heading';
import HoveringToolbar from './HoveringToolbar';
import ImageElement from './ImageElement';
import InsertLink from './InsertLinkElement';
import Link from './LinkElement';
import MarkButton from './MarkButton';
import SnippetElement from './Snippet';
import YoutubeElement from './YoutubeElement';

export interface IAddMediaPosition {
  top: number;
  left: number;
}

interface IUploadingFileInterface {
  id: string;
  file: File;
}

const ClickableBoxStyle = styled(Box)(({ theme }) => ({}));

const config: Resumable.ConfigurationHash = {
  generateUniqueIdentifier() {
    return uuidv4();
  },
  testChunks: false,
  chunkSize: 1 * 1024 * 1024,
  simultaneousUploads: 1,
  fileParameterName: 'file',
  forceChunkSize: true,
  uploadMethod: 'PUT',
  chunkNumberParameterName: 'chunkNumber',
  chunkSizeParameterName: 'chunkSize',
  currentChunkSizeParameterName: 'chunkSize',
  fileNameParameterName: 'fileName',
  totalSizeParameterName: 'totalSize',
};

const BlockQuoteStyle = styled('blockquote')(({ theme }) => ({
  borderLeft: `6px solid ${theme.palette.grey[300]}`,
  fontWeight: '700',
  fontSize: '20px',
  lineHeight: '25px',
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

export interface IHighlitedTextPosition {
  top: number;
  left: number;
  right: number;
}
export interface IEditorObject {
  body: string;
  tagIds?: string[];
  summary?: string;
}

export type tagElement = {
  type: 'tag';
  title: string;
  id: string;
  children: any[];
  tagId: string;
};

const Portal = ({ children }: any) =>
  typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;

interface IAdvancedEditorProps {
  getValueFlag: number;
  returnEditorObjects: (editorObject: IEditorObject) => void;
  bodyChanged: (body: string) => void;
  disableRealTimeChanging: boolean;
  disableDrafting: (status: boolean) => void;
  initializeValue: IEditorObject | null;
  isLoading: boolean;
  fileUploading: (isUploading: boolean) => void;
}

const AdvancedEditor: FC<IAdvancedEditorProps> = (props) => {
  const {
    getValueFlag,
    returnEditorObjects,
    bodyChanged,
    disableRealTimeChanging,
    disableDrafting,
    initializeValue,
    isLoading,
    fileUploading,
  } = props;
  const theme = useTheme();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHashTag(withLinks(withHtml(withHistory(withReact(createEditor() as any))))), []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);
  const editorValueDebouncedValue = useDebounce<Descendant[]>(editorValue, 500);
  const uploadingFilesref = useRef<IUploadingFileInterface[]>([]);
  const [addMediaPosition, setAddMediaPosition] = useState<IAddMediaPosition | null>(null);
  const [resumable, setResumable] = useState<Resumable>(new Resumable(config));
  const editorRef = useRef<HTMLDivElement | null>(null);
  const uploadServiceUrl = process.env.NEXT_UPLOAD_URL;
  const coverImageId = 'cover-image';
  const [highlitedTextPosition, setHighlitedTextPosition] = useState<IHighlitedTextPosition | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const shouldSendHtml = useRef<boolean>(false);
  const [hashtagTarget, setHashtagTarget] = useState<Range | undefined | null>();
  const [getTag, { isFetching: fetchingTag, data: tags }] = useLazySearchTagQuery();
  const [index, setIndex] = useState(0);
  const hashtagRef = useRef<HTMLDivElement | null>();
  const hashtagHeight = 50;
  const [newTag, setNewTag] = useState('');
  const [createTagMutation] = useCreateTagMutation();
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    if (getValueFlag) {
      const editorValueObject: IEditorObject = {
        body: convertToHtml(editorValue),
        tagIds: getTagIds(),
        summary: getSummary(),
      };
      returnEditorObjects(editorValueObject);
    }
  }, [getValueFlag]);

  useEffect(() => {
    if (shouldSendHtml.current && !disableRealTimeChanging && !imageUploading) {
      bodyChanged(convertToHtml(editorValue));
    }
  }, [editorValueDebouncedValue]);

  useEffect(() => {
    if (initializeValue) {
      if (!initializeValue.body) {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        return;
      }

      Transforms.delete(editor, {
        at: { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) },
      });
      const document = new DOMParser().parseFromString(initializeValue.body, 'text/html');
      const slateValue = deserialize(document.body);
      if (slateValue.length === 1 && slateValue[0].text === '') {
        initialValue.forEach((value) => {
          Transforms.insertNodes(editor, value, {
            at: [editor.children.length],
          });
        });
        Transforms.removeNodes(editor, {
          at: [0],
        });
        return;
      }
      slateValue.forEach((value, index) => {
        Transforms.insertNodes(editor, value, { at: [editor.children.length] });
      });
      Transforms.removeNodes(editor, {
        at: [0],
      });
    }
  }, [initializeValue]);

  const getTagIds = () => {
    const tagIds: string[] = [];
    editorValue.forEach((node: any) => {
      node.children.forEach((child) => {
        if (child.type === 'tag') {
          tagIds.push(child.tagId);
        }
      });
    });
    return tagIds;
  };

  const getSummary = () => {
    const summaryArray: string[] = [];
    editorValue.forEach((child: any) => {
      switch (child.type) {
        case 'paragraph':
          child.children.forEach((node) => {
            if (!node.type) {
              // const nodeClass = handleMarkClasses(node);
              summaryArray.push(node.text);
            } else {
              switch (node.type) {
                case 'link':
                  node.children.forEach((linkNode) => {
                    // const nodeClass = handleMarkClasses(linkNode);
                    summaryArray.push(linkNode.text);
                  });
                  break;
                case 'tag':
                  summaryArray.push(`#${node.title}`);
                  break;
              }
            }
          });
          break;
        case 'heading-one':
          child.children.forEach((node) => {
            if (!node.type) {
              summaryArray.push(node.text);
            } else {
              switch (node.type) {
                case 'link':
                  node.children.forEach((linkNode) => {
                    summaryArray.push(linkNode.text);
                  });
                  break;
                case 'tag':
                  summaryArray.push(`#${node.title}`);
                  break;
              }
            }
          });
          break;

        case 'heading-two':
          child.children.forEach((node) => {
            if (!node.type) {
              summaryArray.push(node.text);
            } else {
              switch (node.type) {
                case 'link':
                  node.children.forEach((linkNode) => {
                    summaryArray.push(linkNode.text);
                  });
                  break;
                case 'tag':
                  summaryArray.push(`#${node.title}`);
                  break;
              }
            }
          });
          break;

        case 'numbered-list':
          child.children.forEach((node) => {
            node.children.forEach((listNode) => {
              if (!listNode.type) {
                summaryArray.push(listNode.text);
              } else {
                switch (listNode.type) {
                  case 'link':
                    listNode.children.forEach((linkNode) => {
                      summaryArray.push(linkNode.text);
                    });
                    break;
                }
              }
            });
          });
          break;

        case 'bulleted-list':
          child.children.forEach((node) => {
            node.children.forEach((listNode) => {
              if (!listNode.type) {
                summaryArray.push(listNode.text);
              } else {
                switch (listNode.type) {
                  case 'link':
                    listNode.children.forEach((linkNode) => {
                      summaryArray.push(linkNode.text);
                    });
                    break;
                }
              }
            });
          });
          break;

        case 'block-quote':
          child.children.forEach((node) => {
            summaryArray.push(node.text);
          });
          break;

        case 'snippet':
          child.children.forEach((node) => {
            summaryArray.push(node.text);
          });
          break;
      }
    });
    let summary = '';
    summaryArray.forEach((value) => {
      if (summary.length + value.length <= 200) {
        summary += ` ${value}`;
      } else {
        return;
      }
    });
    return summary;
  };

  const upload = (file: File) => {
    resumable.addFile(file);
    const creationSessionId = Number.parseInt(`${Math.random() * 1000}`);
    fetch(`${uploadServiceUrl}api/fileupload/create/${creationSessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chunkSize: resumable!.opts.chunkSize,
        totalSize: file.size,
        fileName: file.name,
      }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        resumable.opts.target = `${uploadServiceUrl}api/fileupload/upload/user/${creationSessionId}/session/${data.sessionId}`;
        resumable.upload();
      });
  };

  const getNextFile = () => {
    const uploadingFiles = uploadingFilesref.current;
    if (uploadingFiles[0]) {
      upload(uploadingFiles[0].file);
      fileUploading(true);
    } else {
      disableDrafting(false);
      setImageUploading(false);
      fileUploading(false);
    }
  };

  const changeImageUrl = (id: string, link: string) => {
    const findedImageNodeIndex = editor.children.findIndex((i) => i.id === id);
    if (findedImageNodeIndex >= 0) {
      Transforms.setNodes(
        editor,
        {
          type: 'image',
          url: link,
          children: [
            {
              text: '',
            },
          ],
          id,
          width: 'w-100',
        },
        { at: [findedImageNodeIndex] }
      );
    }
  };

  const removeImage = (id: string) => {
    const findedImageNodeIndex = editor.children.findIndex((i) => i.id === id);
    if (findedImageNodeIndex >= 0) {
      Transforms.removeNodes(editor, { at: [findedImageNodeIndex] });
    }
  };

  useEffect(() => {
    if (resumable) {
      resumable.on('fileSuccess', (file: Resumable.ResumableFile, message: string) => {
        const uploadingFile = uploadingFilesref.current[0];

        changeImageUrl(uploadingFile.id, message.replace(/["']/g, ''));

        uploadingFilesref.current.splice(0, 1);

        getNextFile();
      });

      resumable.on('fileError', (file, message) => {
        const uploadingFile = uploadingFilesref.current[0];
        removeImage(uploadingFile.id);
        const newUploadingFiles = uploadingFilesref.current.splice(0, 0);
        uploadingFilesref.current = [...newUploadingFiles];
        getNextFile();
      });
    }
  }, [resumable]);

  const snippetSelected = () => {
    const { selection } = editor;
    const id = uuidv4();
    const text = { text: '', pre: true };
    const sneppet = { type: 'snippet', id, children: [text] };
    const node = editor.children[selection.anchor.path[0]];
    const insertedIndex = editorValue.findIndex((i: any) => i.id === node.id);
    Transforms.insertNodes(editor, sneppet, { at: [insertedIndex] });
    if (!editor.children[insertedIndex + 1]) {
      Transforms.insertNodes(
        editor,
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
          ],
        } as any,
        { at: [insertedIndex + 1] }
      );
    }
  };

  const imageChoosed = (file: File, forCover?: boolean) => {
    if (!forCover) {
      setImageUploading(true);
      const id = uuidv4();
      insertImage(editor, '/images/uploading.jpg', id, editorValue, editorRef, setAddMediaPosition);
      uploadingFilesref.current = [...uploadingFilesref.current, { file, id }];
      if (uploadingFilesref.current.length === 1) {
        fileUploading(true);
        upload(uploadingFilesref.current[0].file);
      }
    } else {
      const id = coverImageId;
      uploadingFilesref.current = [...uploadingFilesref.current, { file, id }];
      if (uploadingFilesref.current.length === 1) {
        upload(uploadingFilesref.current[0].file);
      }
    }
  };

  const videoUrlAdded = (url: string) => {
    const youtubeEmbedId = validateYoutube(url);
    const id = uuidv4();
    if (youtubeEmbedId) {
      const { selection } = editor;
      const text = { text: '' };
      const youtube = {
        type: 'youtube',
        children: [text],
        id,
        embedId: youtubeEmbedId,
      };

      const node = editor.children[selection.anchor.path[0]];
      const insertedIndex = editorValue.findIndex((i: any) => i.id === node.id);
      Transforms.insertNodes(editor, youtube, { at: [insertedIndex] });
      if (!editor.children[insertedIndex + 1]) {
        Transforms.insertNodes(
          editor,
          {
            type: 'paragraph',
            children: [
              {
                text: '',
              },
            ],
          } as any,
          { at: [insertedIndex + 1] }
        );
      }
      Transforms.select(editor, {
        anchor: { path: [insertedIndex + 1, 0], offset: 0 },
        focus: { path: [insertedIndex + 1, 0], offset: 0 },
      });
      getCaretGlobalPosition(editor, editorRef, setAddMediaPosition);
    }
  };

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
        console.log(res);
        Transforms.select(editor, hashtagTarget!);
        insertTag(
          editor,
          res?.createTag?.listDto?.items?.[0]?.title || '',
          res?.createTag?.listDto?.items?.[0]?.id || ''
        );
        setHashtagTarget(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!tagSearch) {
      setHashtagTarget(null);
    }
    getTag({ filter: { dto: { title: tagSearch } } });
  }, [tagSearch]);

  useEffect(() => {
    if (hashtagTarget) {
      const el = hashtagRef.current;
      const domRange = ReactEditor.toDOMRange(editor, hashtagTarget);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      }
    }
  }, [editor, index, hashtagTarget]);

  return (
    <Box ref={editorRef} sx={{ position: 'relative' }}>
      <Slate
        editor={editor}
        value={editorValue}
        onChange={(e) => {
          shouldSendHtml.current = true;
          setTimeout(() => {
            getCaretGlobalPosition(editor, editorRef, setAddMediaPosition);
          }, 100);
          setEditorValue(e);

          const { selection } = editor;
          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText = beforeRange && Editor.string(editor, beforeRange);
            const beforeHashtagMatch = beforeText && beforeText.match(/^#(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            const isActiveNumberedList = isBlockActive(editor, 'numbered-list', 'type');
            const isActiveBulletList = isBlockActive(editor, 'bulleted-list', 'type');
            const isActiveBlockQuote = isBlockActive(editor, 'block-quote', 'type');
            const isActiveSnippet = isBlockActive(editor, 'snippet', 'type');
            const isActiveLink = isBlockActive(editor, 'link', 'type');
            if (
              beforeHashtagMatch &&
              afterMatch &&
              !isActiveBlockQuote &&
              !isActiveBulletList &&
              !isActiveNumberedList &&
              !isActiveSnippet &&
              !isActiveLink
            ) {
              setNewTag(beforeHashtagMatch[1]);
              setHashtagTarget(beforeRange);
              setTagSearch(beforeHashtagMatch[1]);
              return;
            } else {
              setHashtagTarget(null);
            }
          }
        }}
      >
        <Stack spacing={5} sx={{ mt: 0 }}>
          {isLoading ? (
            <Stack direction="row" spacing={3}>
              <Skeleton variant="rectangular" width={410} height={40} />
              <Skeleton variant="rectangular" width={410} height={40} />
              <Skeleton variant="rectangular" width={410} height={40} />
              <Skeleton variant="rectangular" width={410} height={40} />
            </Stack>
          ) : (
            <Stack
              sx={{
                position: 'sticky',
                top: 64,
                zIndex: 999,
                bgcolor: 'common.white',
                padding: 0,
              }}
              spacing={3}
              direction="row"
            >
              <Heading />
              <ButtonGroup variant="text" sx={{ backgroundColor: 'grey.100' }} aria-label="text button group">
                <MarkButton
                  format="bold"
                  icon={<Image width={24} height={24} src="/icons/bold/24/Outline.svg" alt="bold" />}
                />
                <MarkButton
                  format="italic"
                  icon={<Image width={24} height={24} src="/icons/italic/24/Outline.svg" alt="italic" />}
                />
                <MarkButton
                  format="underline"
                  icon={<Image width={24} height={24} src="/icons/underline/24/Outline.png" alt="underline" />}
                />
              </ButtonGroup>

              <ButtonGroup variant="text" sx={{ backgroundColor: 'grey.100' }} aria-label="text button group">
                <BlockButton
                  format="numbered-list"
                  icon={
                    <Image
                      width={24}
                      height={24}
                      src="/icons/Number list format/24/Outline.svg"
                      alt="Number list format"
                    />
                  }
                />
                <BlockButton
                  format="bulleted-list"
                  icon={<Image width={24} height={24} src="/icons/list format/24/Outline.svg" alt="list format" />}
                />
              </ButtonGroup>

              <ButtonGroup variant="text" sx={{ backgroundColor: 'grey.100' }} aria-label="text button group">
                <Button
                  sx={{
                    borderColor: '#ffffff!important',
                    ...(isBlockActive(editor, 'link', TEXT_ALIGN_TYPES.includes('link') ? 'align' : 'type') && {
                      backgroundColor: 'secondary.light',
                    }),
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    handleInsertLink(editor, editorRef, setHighlitedTextPosition);
                  }}
                >
                  <Image width={24} height={24} src="/icons/Attach/24/Outline.svg" alt="Attach File" />
                </Button>
                <BlockButton
                  format="block-quote"
                  icon={
                    isBlockActive(
                      editor,
                      'block-quote',
                      TEXT_ALIGN_TYPES.includes('block-quote') ? 'align' : 'type'
                    ) ? (
                      <Image width={24} height={24} src="/icons/Quote/24/Outline.svg" alt="Quote" />
                    ) : (
                      <Image width={24} height={24} src="/icons/Quote/24/Outline.svg" alt="Quote" />
                    )
                  }
                />
              </ButtonGroup>
            </Stack>
          )}

          {isLoading ? (
            <Skeleton variant="rectangular" width={522} height={25} />
          ) : (
            <Editable
              id="campagin-editor"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Write here. Add images or a video for visual impact."
              spellCheck
              autoFocus
              onKeyDown={(event) => {
                disableDrafting(false);
                const isActiveSnippet = isBlockActive(editor, 'snippet', 'type');

                if (hashtagTarget) {
                  const searchedTags =
                    (tags &&
                      tags.recommendedTags &&
                      tags.recommendedTags.listDto &&
                      tags.recommendedTags.listDto.items) ||
                    [];
                  switch (event.key) {
                    case 'ArrowDown':
                      event.preventDefault();
                      const prevIndex = index >= searchedTags.length - 1 ? 0 : index + 1;
                      setIndex(prevIndex);
                      hashtagRef?.current!.scrollTo({
                        top: prevIndex > 0 ? hashtagRef.current!.scrollTop + hashtagHeight : 0,
                      });
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
                      return;
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

                if (event.key === 'Enter' && isActiveSnippet) {
                  event.preventDefault();

                  const { selection } = editor;

                  const node = editor.children[selection.anchor.path[0]];
                  const insertedIndex = editorValue.findIndex((i: any) => i.id === node.id);
                  let newText = node.children[0].text as string;
                  if (newText[newText.length - 1] === '\n' && newText[newText.length - 2] === '\n') {
                    const lastIndex = newText.length - 1;
                    newText = newText.substring(0, lastIndex - 1) + '' + newText.substring(lastIndex);
                    newText = newText.substring(0, lastIndex - 1) + '' + newText.substring(lastIndex);
                    const children = [{ text: newText, pre: true }];
                    const snippet = { type: 'snippet', id: node.id, children };

                    Transforms.removeNodes(editor, { at: [insertedIndex] });
                    Transforms.insertNodes(editor, snippet, {
                      at: [insertedIndex],
                    });

                    Transforms.insertNodes(editor, createParagraphNode(), {
                      at: [insertedIndex + 1],
                    });
                    Transforms.setSelection(editor, {
                      anchor: { offset: 0, path: [insertedIndex + 1, 0] },
                      focus: { offset: 0, path: [insertedIndex + 1, 0] },
                    });
                    return;
                  }
                  newText =
                    newText.substring(0, selection.anchor.offset) +
                    '\n' +
                    newText.substring(selection.anchor.offset, newText.length);

                  const children = [{ text: newText, pre: true }];
                  const snippet = { type: 'snippet', id: node.id, children };

                  Transforms.removeNodes(editor, { at: [insertedIndex] });
                  Transforms.insertNodes(editor, snippet, {
                    at: [insertedIndex],
                  });
                  Transforms.select(editor, {
                    anchor: {
                      path: [insertedIndex, 0],
                      offset: selection.anchor.offset + 1,
                    },
                    focus: {
                      path: [insertedIndex, 0],
                      offset: selection.anchor.offset + 1,
                    },
                  });
                  return;
                }

                if (isActiveSnippet) {
                  const { selection } = editor;
                  const node = editor.children[selection.anchor.path[0]];
                  if (node.children.length > 1) {
                    event.preventDefault();
                    const insertedIndex = editorValue.findIndex((i: any) => i.id === node.id);
                    let newText = node.children[0].text as string;
                    for (let index = 1; index < node.children.length; index++) {
                      const text = node.children[index].text;
                      newText += `\n${text}`;
                    }
                    newText =
                      newText.substring(0, selection.anchor.offset) +
                      event.key +
                      newText.substring(selection.anchor.offset, newText.length);
                    const children = [{ text: newText, pre: true }];
                    const snippet = { type: 'snippet', id: node.id, children };
                    Transforms.removeNodes(editor, { at: [insertedIndex] });
                    Transforms.insertNodes(editor, snippet, {
                      at: [insertedIndex],
                    });
                    Transforms.select(editor, {
                      anchor: {
                        path: [insertedIndex, 0],
                        offset: selection.anchor.offset + 1,
                      },
                      focus: {
                        path: [insertedIndex, 0],
                        offset: selection.anchor.offset + 1,
                      },
                    });
                  }
                }
                const isActiveNumberedList = isBlockActive(editor, 'numbered-list', 'type');
                const isActiveBulletList = isBlockActive(editor, 'bulleted-list', 'type');
                const isActiveBlockQuote = isBlockActive(editor, 'block-quote', 'type');
                if (event.key === 'Enter' && !isActiveNumberedList && !isActiveBulletList && !isActiveBlockQuote) {
                  const selection = editor.selection;
                  const changedIndex = selection.anchor.path[0] + 1;
                  event.preventDefault();
                  Transforms.insertNodes(editor, {
                    type: 'paragraph',
                    children: [
                      {
                        text: '',
                      },
                    ],
                    id: uuidv4(),
                  } as any);

                  const changedNode = { ...editor.children[changedIndex] };
                  if (changedNode.type) {
                    changedNode.id = uuidv4();
                    Transforms.setNodes(editor, changedNode, {
                      at: [changedIndex],
                    });
                  }

                  const sameChild = { ...editor.children[changedIndex + 1] };
                  if (sameChild.type) {
                    Transforms.removeNodes(editor, { at: [changedIndex + 1] });
                    Transforms.insertNodes(editor, { ...sameChild, id: uuidv4() }, { at: [changedIndex + 1] });
                  }
                }

                if (event.key === ' ' && isBlockActive(editor, 'link', 'type')) {
                  const { selection } = editor;

                  if (
                    editor.children[selection.anchor.path[0]].type === 'numbered-list' ||
                    editor.children[selection.anchor.path[0]].type === 'bulleted-list'
                  ) {
                    const mainListIndex = selection.anchor.path[0];
                    const listItemIndex = selection.anchor.path[1];
                    const linkIndex = selection.anchor.path[2];
                    const linkTextIndex = selection.anchor.path[3];

                    const lineTextLength =
                      editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[linkTextIndex]
                        .text.length;
                    if (selection.anchor.offset === lineTextLength) {
                      event.preventDefault();

                      if (
                        editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[
                          linkTextIndex + 1
                        ]
                      ) {
                        const lastText =
                          editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[
                            linkTextIndex + 1
                          ].text;
                        Transforms.insertText(editor, ` ${lastText}`, {
                          at: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                          },
                        });
                      } else {
                        Transforms.insertText(editor, ' ', {
                          at: {
                            anchor: {
                              offset: 1,
                              path: [mainListIndex, listItemIndex, linkIndex + 1],
                            },
                            focus: {
                              offset: 1,
                              path: [mainListIndex, listItemIndex, linkIndex + 1],
                            },
                            offset: 1,
                          },
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex + 1],
                          },
                        });
                      }
                    }
                  } else {
                    const lineTextLength =
                      editor.children[selection.anchor.path[0]].children[selection.anchor.path[1]].children[0].text
                        .length;
                    if (selection.anchor.offset === lineTextLength) {
                      event.preventDefault();

                      if (editor.children[selection.anchor.path[0]].children[selection.anchor.path[1] + 1]) {
                        const lastText =
                          editor.children[selection.anchor.path[0]].children[selection.anchor.path[1] + 1].text;
                        Transforms.insertText(editor, ` ${lastText}`, {
                          at: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                          },
                        });
                      } else {
                        Transforms.insertText(editor, ' ', {
                          at: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [selection.anchor.path[0], selection.anchor.path[1] + 1],
                          },
                        });
                      }
                    }
                  }
                }

                if (event.key === 'Enter' && (isActiveNumberedList || isActiveBulletList)) {
                  const { selection } = editor;

                  if (isBlockActive(editor, 'link', 'type')) {
                    const mainListIndex = selection.anchor.path[0];
                    const listItemIndex = selection.anchor.path[1];
                    const linkIndex = selection.anchor.path[2];
                    const linkTextIndex = selection.anchor.path[3];

                    const lineTextLength =
                      editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[linkTextIndex]
                        .text.length;
                    if (selection.anchor.offset === lineTextLength) {
                      if (
                        editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[
                          linkTextIndex + 1
                        ]
                      ) {
                        const lastText =
                          editor.children[mainListIndex].children[listItemIndex].children[linkIndex].children[
                            linkTextIndex + 1
                          ].text;
                        Transforms.insertText(editor, ` ${lastText}`, {
                          at: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex, linkTextIndex + 1],
                          },
                        });
                      } else {
                        Transforms.insertText(editor, ' ', {
                          at: {
                            anchor: {
                              offset: 1,
                              path: [mainListIndex, listItemIndex, linkIndex + 1],
                            },
                            focus: {
                              offset: 1,
                              path: [mainListIndex, listItemIndex, linkIndex + 1],
                            },
                            offset: 1,
                          },
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex + 1],
                          },
                          focus: {
                            offset: 1,
                            path: [mainListIndex, listItemIndex, linkIndex + 1],
                          },
                        });
                      }
                    }
                  }

                  const node = editor.children[selection.anchor.path[0]];
                  node.children.forEach((child, index) => {
                    if (child.children.length === 1 && child.children[0].text.trim() === '') {
                      if (index === selection.anchor.path[1]) {
                        event.preventDefault();
                        Transforms.removeNodes(editor, {
                          at: [selection.anchor.path[0], index],
                        });
                        Transforms.insertNodes(editor, createParagraphNode(), {
                          at: [selection.anchor.path[0] + 1],
                        });
                        Transforms.setSelection(editor, {
                          anchor: {
                            offset: 0,
                            path: [selection.anchor.path[0] + 1, 0],
                          },
                          focus: {
                            offset: 0,
                            path: [selection.anchor.path[0] + 1, 0],
                          },
                        });
                      }
                    }
                  });
                }
              }}
              style={{ padding: '0 60px', marginTop: 60 }}
            />
          )}
        </Stack>

        {addMediaPosition && (
          <Box sx={{ minHeight: '188px' }}>
            <HoveringToolbar
              mediaPosition={addMediaPosition}
              snippetSelected={snippetSelected}
              fileSelected={imageChoosed}
              videoUrlSelected={videoUrlAdded}
            />
          </Box>
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
                  left: '1rem',
                  right: '1rem',
                  position: 'absolute',
                  zIndex: 9999,
                  padding: 2,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                  maxHeight: 296,
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
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: i === index ? 'primary.light' : 'transparent',
                          }}
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
                              sx={{
                                fontWeight: 500,
                                fontSize: 12,
                                lineHeight: '15px',
                                color: 'text.secondary',
                              }}
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

      {highlitedTextPosition && (
        <ClickAwayListener onClickAway={() => setHighlitedTextPosition(null)}>
          <Box
            sx={{
              position: 'absolute',
              left: highlitedTextPosition.left,
              top: highlitedTextPosition.top,
              right: 'unset',
            }}
          >
            <InsertLink
              insertLink={(link) => {
                insertLink(link, editor);
                setHighlitedTextPosition(null);
              }}
            />
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  );
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <BlockQuoteStyle id={element.id} {...attributes}>
          {children}
        </BlockQuoteStyle>
      );
    case 'bulleted-list':
      return (
        <ul id={element.id} style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 id={element.id} style={{ lineHeight: '35px' }} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 id={element.id} style={{ lineHeight: '35px' }} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li id={element.id} style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol id={element.id} style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'youtube':
      return <YoutubeElement embedId={element.embedId} children={children} />;
    case 'image':
      return <ImageElement attributes={attributes} children={children} element={element} />;
    case 'link':
      return <Link attributes={attributes} element={element} children={children} edit={editLink} />;
    case 'snippet':
      return <SnippetElement attributes={attributes} id={element.id} children={children} />;
    case 'tag':
      return <Tags attributes={attributes} children={children} element={element} />;

    default:
      if (element.id) {
        return (
          <p id={element.id} style={style} {...attributes}>
            {children}
          </p>
        );
      } else {
        return (
          <p id={uuidv4()} style={style} {...attributes}>
            {children}
          </p>
        );
      }
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.pre) {
    children = <pre>{children}</pre>;
  }

  return <span {...attributes}>{children}</span>;
};

const initialValue: any[] = [
  {
    type: 'paragraph',
    id: uuidv4(),
    children: [
      {
        text: '',
      },
    ],
  },
];

export default AdvancedEditor;
