export enum ClipReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  NONE = 'NONE'
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
  score?: number;
  createdAt?: string;
  channel?: any;
  reaction?: ClipReactionType;
  author?: any;
}
