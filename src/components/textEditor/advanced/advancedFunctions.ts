import { Descendant, Editor, Element as SlateElement, Path, Range, Transforms } from 'slate';
import { GeneralTransforms } from 'slate/dist/transforms/general';
import { NodeTransforms } from 'slate/dist/transforms/node';
import { SelectionTransforms } from 'slate/dist/transforms/selection';
import { TextTransforms } from 'slate/dist/transforms/text';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { IAddMediaPosition, IHighlitedTextPosition, tagElement } from './Advanced';
import { MutableRefObject } from 'react';

export const ELEMENT_TAGS = {
  A: (el) => ({ type: 'link', href: el.getAttribute('href'), id: uuidv4() }),
  BLOCKQUOTE: () => ({ type: 'block-quote' }),
  H1: () => ({ type: 'heading-one', id: uuidv4() }),
  H2: () => ({ type: 'heading-two', id: uuidv4() }),
  H3: () => ({ type: 'paragraph', id: uuidv4() }),
  H4: () => ({ type: 'paragraph', id: uuidv4() }),
  H5: () => ({ type: 'paragraph', id: uuidv4() }),
  H6: () => ({ type: 'paragraph', id: uuidv4() }),
  IMG: (el) => ({
    type: 'image',
    url: el.getAttribute('src'),
    children: [
      {
        text: '',
      },
    ],
    id: uuidv4(),
    width: 'w-100',
  }),
  LI: () => ({ type: 'list-item', id: uuidv4() }),
  OL: () => ({ type: 'numbered-list', id: uuidv4() }),
  P: () => ({ type: 'paragraph', id: uuidv4() }),
  PRE: () => ({ type: 'snippet', id: uuidv4() }),
  UL: () => ({ type: 'bulleted-list', id: uuidv4() }),
  // SPAN: () => ({ type: 'paragraph', id: uuidv4() }),
};

export const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const LIST_TYPES = ['numbered-list', 'bulleted-list'];
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const handleMarkClasses = (node: any) => {
  let nodeClass = '';
  if (node.bold) {
    nodeClass += ' editor-bold';
  }
  if (node.italic) {
    nodeClass += ' editor-italic';
  }
  if (node.underline) {
    nodeClass += ' editor-underline';
  }
  return nodeClass;
};

export const convertToHtml = (editorValue: Descendant[]) => {
  let html = '';
  editorValue.forEach((child: any) => {
    switch (child.type) {
      case 'image':
        let imageClass = 'editor-image';
        if (child.href) {
          html += `<a class="image-link" href=${child.href} target="_blank">`;
        }
        if (child.float) {
          imageClass += ` ${child.float}`;
        }
        if (child.width) {
          imageClass += ` ${child.width}`;
        }
        html += `<img src="${child.url}" id=${child.id} class="${imageClass}" alt="${child.alt || ''}" href="${
          child.href || ''
        }"/>`;
        html += '</a>';
        break;
      case 'paragraph':
        html += `<p id=${child.id}  class="editor-paragraph">`;
        child.children.forEach((node) => {
          if (!node.type) {
            const nodeClass = handleMarkClasses(node);
            html += `<span class='${nodeClass}'>${node.text}</span>`;
          } else {
            switch (node.type) {
              case 'link':
                html += `<a id=${node.id} href=${node.href} target="_blank"  class='editor-link'>`;
                node.children.forEach((linkNode) => {
                  const nodeClass = handleMarkClasses(linkNode);
                  html += `<span class='${nodeClass}'>${linkNode.text}</span>`;
                });
                html += '</a>';
                break;
              case 'tag':
                html += `<a class="editor-tag" id=${node.id} tagId="${node.tagId}" >#${node.title}</a>`;
                break;
            }
          }
        });
        html += '</p>';
        break;
      case 'heading-one':
        html += `<h1 id=${child.id}  class="editor-h1">`;
        child.children.forEach((node) => {
          if (!node.type) {
            const nodeClass = handleMarkClasses(node);
            html += `<span class='${nodeClass}'>${node.text}</span>`;
          } else {
            switch (node.type) {
              case 'link':
                html += `<a id=${node.id} href=${node.href} target="_blank"  class='editor-link'>`;
                node.children.forEach((linkNode) => {
                  const nodeClass = handleMarkClasses(linkNode);
                  html += `<span class='${nodeClass}'>${linkNode.text}</span>`;
                });
                html += '</a>';
                break;
              case 'tag':
                html += `<a class="editor-tag" id=${node.id} tagId="${node.tagId}" >#${node.title}</a>`;
                break;
            }
          }
        });
        html += '</h1>';
        break;

      case 'heading-two':
        html += `<h2 id=${child.id}  class="editor-h2">`;
        child.children.forEach((node) => {
          if (!node.type) {
            const nodeClass = handleMarkClasses(node);
            html += `<span class='${nodeClass}'>${node.text}</span>`;
          } else {
            switch (node.type) {
              case 'link':
                html += `<a id=${node.id} href=${node.href} target="_blank"  class='editor-link'>`;
                node.children.forEach((linkNode) => {
                  const nodeClass = handleMarkClasses(linkNode);
                  html += `<span class='${nodeClass}'>${linkNode.text}</span>`;
                });
                html += '</a>';
                break;
              case 'tag':
                html += `<a class="editor-tag" id=${node.id} tagId="${node.tagId}" >#${node.title}</a>`;
                break;
            }
          }
        });
        html += '</h2>';
        break;

      case 'numbered-list':
        html += `<ol id=${child.id}  class="editor-ol">`;
        child.children.forEach((node) => {
          html += `<li id=${child.id}  class='editor-list-item'>`;
          node.children.forEach((listNode) => {
            if (!listNode.type) {
              const nodeClass = handleMarkClasses(listNode);
              html += `<span class='${nodeClass}'>${listNode.text}</span>`;
            } else {
              switch (listNode.type) {
                case 'link':
                  html += `<a id=${listNode.id} href=${listNode.href} target="_blank"  class='editor-link'>`;
                  listNode.children.forEach((linkNode) => {
                    const nodeClass = handleMarkClasses(linkNode);
                    html += `<span class='${nodeClass}'>${linkNode.text}</span>`;
                  });
                  html += '</a>';
                  break;
              }
            }
          });
          html += `</li>`;
        });
        html += '</ol>';
        break;

      case 'bulleted-list':
        html += `<ul id=${child.id}  class="editor-ul">`;
        child.children.forEach((node) => {
          html += `<li id=${child.id}  class='editor-list-item'>`;
          node.children.forEach((listNode) => {
            if (!listNode.type) {
              const nodeClass = handleMarkClasses(listNode);
              html += `<span class='${nodeClass}'>${listNode.text}</span>`;
            } else {
              switch (listNode.type) {
                case 'link':
                  html += `<a id=${listNode.id} href=${listNode.href} target="_blank"  class='editor-link'>`;
                  listNode.children.forEach((linkNode) => {
                    const nodeClass = handleMarkClasses(linkNode);
                    html += `<span class='${nodeClass}'>${linkNode.text}</span>`;
                  });
                  html += '</a>';
                  break;
              }
            }
          });
          html += `</li>`;
        });
        html += '</ul>';
        break;

      case 'block-quote':
        html += `<blockquote id=${child.id}  class="editor-blockquote">`;
        child.children.forEach((node) => {
          const nodeClass = handleMarkClasses(node);
          html += `<span class='${nodeClass}'>${node.text}</span>`;
        });
        html += '</blockquote>';
        break;

      case 'snippet':
        html += `<pre id=${child.id}  class="editor-pre">`;
        child.children.forEach((node) => {
          const nodeClass = handleMarkClasses(node);
          html += node.text;
        });
        html += '</pre>';
        break;

      case 'youtube':
        html += `<iframe id=${child.id} class="editor-youtube" src="https://www.youtube.com/embed/${child.embedId}" embedId="${child.embedId}"></iframe>`;
        break;
    }
  });
  return html;
};

export const createLinkNode = (href, text: string, id: string): any => ({
  type: 'link',
  href,
  id,
  children: [{ text }],
});

export const editLink = (url: string, editor: any, id: string) => {
  editor.children.forEach((parent, index) => {
    const linkIndex = parent.children.findIndex((i) => i.id === id);
    if (linkIndex >= 0) {
      Transforms.removeNodes(editor, { at: [index] });
      const link = createLinkNode(url, '', id);
      link.children = parent.children[linkIndex].children;
      const parentCopy = { ...parent };
      const parentChildCopy = [...parentCopy.children];
      parentChildCopy[linkIndex] = link;
      const newParent = { ...parent, children: parentChildCopy };
      Transforms.insertNodes(editor, newParent, { at: [index] });
      return;
    }
  });
  editor.children.forEach((parent, index) => {
    if (parent.type === 'numbered-list' || parent.type === 'bulleted-list') {
      parent.children.forEach((i, iIndex) => {
        i.children.forEach((j, jIndex) => {
          if (j.id === id) {
            Transforms.removeNodes(editor, { at: [index] });
            const link = createLinkNode(url, '', id);
            link.children = parent.children[iIndex].children[jIndex].children;
            const parentCopy = cloneDeep(parent);
            parentCopy.children[iIndex].children[jIndex] = link;
            Transforms.insertNodes(editor, parentCopy, { at: [index] });
            return;
          }
        });
      });
    }
  });
};

export const removeLink = (editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === 'link',
  });
};

export const insertLink = (url, editor) => {
  if (!url) return;
  const id = uuidv4();

  const { selection } = editor;
  const link = createLinkNode(url, 'New Link', id);

  ReactEditor.focus(editor);

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(editor, selection.focus?.path);

    if ((parentNode as any).type === 'link') {
      removeLink(editor);
    }

    if ((parentNode.children as any).findIndex((i) => i.type === 'link')) {
      removeLink(editor);
    }

    if (editor.isVoid(parentNode)) {
      Transforms.insertNodes(editor, createParagraphNode([link]), {
        at: Path.next(parentPath),
        select: true,
      });
    } else if (Range.isCollapsed(selection)) {
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  } else {
    Transforms.insertNodes(editor, createParagraphNode([link]));
  }
};

export const createParagraphNode = (children = [{ text: '' }]) => ({
  type: 'paragraph',
  children,
  id: uuidv4(),
});

export const deserializeForPasted = (el: any) => {
  if (el.nodeType === 3 && el.textContent.trim()) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    const attrs = ELEMENT_TAGS['P' as any](el);
    return jsx('element', attrs, [{ text: '' }]);
  }

  const { nodeName } = el;
  let parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }
  let children = Array.from(parent.childNodes).map(deserializeForPasted).flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    if (nodeName === 'A') {
      const aChild = handleLinkChildren(children);
      return jsx('element', attrs, aChild);
    } else {
      return jsx('element', attrs, children);
    }
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

const handleLinkChildren = (children: any) => {
  let childText = '';
  children.map((child) => {
    if (child.type) {
      child.children.map((i) => {
        childText += `${i.text} `;
      });
    } else {
      if (child.text) {
        childText += `${child.text} `;
      } else if (typeof child === 'string') {
        childText += `${child} `;
      }
    }
  });
  return [{ text: childText }];
};

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  );

  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
  const isList = LIST_TYPES.includes(format);
  const id = uuidv4();
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<any>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
      id,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      id,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [], id };
    Transforms.wrapNodes(editor, block);
  }
};

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isBlockActive(editor, 'snippet', 'type')) {
    return;
  }

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const insertTag = (editor: any, title: string, tagId: string) => {
  const id = uuidv4();
  const tag: tagElement = {
    type: 'tag',
    title,
    tagId,
    id,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, tag);
  Transforms.move(editor);
};

export const deserialize = (el: any) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const parent = el;

  let children: any = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (el.className.includes('editor-image')) {
    const float = el.className.includes('left') ? 'left' : el.className.includes('right') ? 'right' : null;
    const width = el.className.includes('w-150')
      ? 'w-150'
      : el.className.includes('w-100')
      ? 'w-100'
      : el.className.includes('w-50')
      ? 'w-50'
      : null;
    const alt = el.getAttribute('alt');
    const url = el.getAttribute('src');
    const href = el.getAttribute('href');
    const id = el.id;
    return jsx('element', {
      type: 'image',
      url,
      children: [
        {
          text: '',
        },
      ],
      id,
      width,
      float,
      alt,
      href,
    });
  }

  if (el.className.includes('editor-tag')) {
    const id = el.id;
    const tagId = el.getAttribute('tagId');
    const title = el.innerText.slice(1);
    return jsx('element', {
      type: 'tag',
      id,
      tagId,
      title,
      children: [{ text: '' }],
    });
  }

  if (el.className.includes('editor-paragraph')) {
    const id = el.id;
    const type = 'paragraph';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-h1')) {
    const id = el.id;
    const type = 'heading-one';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-h2')) {
    const id = el.id;
    const type = 'heading-two';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-ol')) {
    const id = el.id;
    const type = 'numbered-list';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-ul')) {
    const id = el.id;
    const type = 'bulleted-list';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-blockquote')) {
    const id = el.id;
    const type = 'block-quote';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-list-item')) {
    const id = el.id;
    const type = 'list-item';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-pre')) {
    const id = el.id;
    const type = 'snippet';
    return jsx('element', { type, id }, children);
  }

  if (el.className.includes('editor-link')) {
    const href = el.getAttribute('href');
    const id = el.id;
    const type = 'link';
    return jsx('element', { type, id, href }, children);
  }

  if (el.className.includes('editor-youtube')) {
    const embedId = el.getAttribute('embedId');
    const id = el.id;
    const type = 'youtube';
    return jsx('element', { type, id, embedId }, children);
  }

  if (
    el.className.includes('editor-bold') ||
    el.className.includes('editor-italic') ||
    el.className.includes('editor-underline')
  ) {
    const bold = el.className.includes('editor-bold') ? true : false;
    const italic = el.className.includes('editor-italic') ? true : false;
    const underline = el.className.includes('editor-underline') ? true : false;
    return jsx('text', { bold, italic, underline }, el.innerHTML);
  }

  return children;
};

const getSelectionPosition = (editor: any, editorRef: MutableRefObject<HTMLDivElement | null>) => {
  const { selection } = editor;
  if (!selection) {
    return;
  }

  const domSelection = window.getSelection();
  const domRange = domSelection?.getRangeAt(0);
  const rect = domRange?.getBoundingClientRect();
  const nodeTop = rect!.top - editorRef?.current!.getBoundingClientRect().top;
  const nodeLeft = rect!.left - editorRef?.current!.getBoundingClientRect().left;
  const nodeRight = rect!.right - editorRef?.current!.getBoundingClientRect().right;
  return {
    top: nodeTop + 20,
    left: nodeLeft,
    right: nodeRight,
  };
};

export const handleInsertLink = (
  editor: any,
  editorRef: MutableRefObject<HTMLDivElement | null>,
  setHighlitedTextPosition: (value: IHighlitedTextPosition | null) => void
) => {
  if (isBlockActive(editor, 'snippet', 'type') || isBlockActive(editor, 'block-quote', 'type')) {
    return;
  }

  const selectionPosition = getSelectionPosition(editor, editorRef);
  if (!selectionPosition) {
    return;
  }

  if (selectionPosition && selectionPosition.top < 0) {
    return;
  }
  setHighlitedTextPosition({
    left: selectionPosition?.left || 0,
    right: selectionPosition?.right || 0,
    top: selectionPosition?.top || 0,
  });
};

export const validateYoutube = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return '';
  }
};

export const getCaretGlobalPosition = (
  editor: any,
  editorRef: MutableRefObject<HTMLDivElement | null>,
  setAddMediaPosition: (value: IAddMediaPosition) => void
) => {
  const { selection } = editor;
  if (!selection) {
    return;
  }

  const domSelection = window.getSelection();
  if (domSelection?.rangeCount === 0) return;
  const domRange = domSelection?.getRangeAt(0);
  const rect = domRange?.getBoundingClientRect();
  const node = document.getElementById((editor.children[selection.anchor.path[0]] as any).id);
  if (!node || !editorRef.current) {
    return;
  }
  const nodeTop = node.getBoundingClientRect().top - editorRef.current.getBoundingClientRect().top - 16;
  setAddMediaPosition({ left: rect!.left, top: nodeTop });
};

export const insertImage = (
  editor,
  url,
  id,
  editorValue: Descendant[],
  editorRef: MutableRefObject<HTMLDivElement | null>,
  setAddMediaPosition: (value: IAddMediaPosition) => void
) => {
  const { selection } = editor;
  const text = { text: '' };
  const image = { type: 'image', url, children: [text], id, width: 'w-100' };

  const node = editor.children[selection.anchor.path[0]];
  const insertedIndex = editorValue.findIndex((i: any) => i.id === node.id);
  Transforms.insertNodes(editor, image, { at: [insertedIndex] });
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
};
