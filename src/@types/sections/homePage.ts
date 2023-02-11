import { IPost } from '../post';

export interface IHomePage {
  inViewPortVideos: IInViewPortVideo[];
  playingVieos: string[];
  posts: IPost[] | null;
  homePostCount: number | null;
  homeScroll: number;
  newPost: IAppliedPost | null;
  updatePost: IAppliedPost | null;
  deletePost: IAppliedPost | null;
}

export interface IInViewPortVideo {
  positionTop: number;
  link: string;
}

export interface IAppliedPost {
  id: string;
  type: 'campaign' | 'social' | 'share';
}
export interface IUpdateCommentCounter {
  id: string;
  type: 'positive' | 'negative';
}
