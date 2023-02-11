import { Transforms } from 'slate';
import { createParagraphNode, deserializeForPasted } from './advancedFunctions';

export const withHtml = (editor) => {
  const { insertData, isInline, isVoid, selection } = editor;

  editor.isInline = (element) => (element.type === 'link' ? true : isInline(element));

  editor.isVoid = (element) => (element.type === 'image' ? true : isVoid(element));

  const valuiOnlyText = (fragment: any[]) =>
    fragment.map((i) => {
      if (!i.type && i.text) {
        return createParagraphNode([{ text: i.text }]);
      } else {
        return i;
      }
    });

  editor.insertData = (data) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      let fragment = deserializeForPasted(parsed.body);
      fragment = valuiOnlyText(fragment);
      fragment = fragment.filter((i) => i.type);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

export const withHashTag = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => (element.type === 'tag' ? true : isInline(element));
  return editor;
};

export const withLinks = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => (element.type === 'link' ? true : isInline(element));

  return editor;
};
