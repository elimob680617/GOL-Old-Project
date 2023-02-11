import { Descendant } from 'slate';
export interface ICreateComment {
  body: Descendant[];
  mediaUrls: string | null;
  fileWithError: string;
  editMode: boolean;
  id?: string;
  postId: string;
  parentId?: string | null;
  commentTagIds: string[];
  mentionedUsers: object[];
}
