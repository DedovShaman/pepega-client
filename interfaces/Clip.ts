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
  thumbnail?: string;
  liked?: boolean;
  likes?: number;
  dislikes?: number;
  score?: number;
  createdAt?: string;
  channelId?: string;
  channelName?: string;
  reaction?: ClipReactionType;
  authorId?: string;
}
