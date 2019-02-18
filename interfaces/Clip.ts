export enum ClipReactionType {
  like = 'like',
  dislike = 'dislike',
  none = 'none'
}

export interface IClip {
  id?: string;
  title?: string;
  nfws?: boolean;
  spoiler?: boolean;
  clipId?: string;
  cover?: string;
  liked?: boolean;
  likes?: number;
  dislikes?: number;
  rating?: number;
  createdAt?: string;
  channel?: any;
  reaction?: ClipReactionType;
  author?: any;
}
