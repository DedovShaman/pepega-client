import Head from 'next/head';
import { darken } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import { ClipReactionType, IClip } from '../../interfaces/Clip';
import ClipReactionProvider from '../../providers/ClipCurrentReaction';
import { TwitchClipPlayer } from '../../ui/TwitchClipPlayer';
import Comments from '../Comments/Comments';
import { ClipAuthor } from './ClipAuthor';
import { ClipMenu } from './ClipMenu';
import { ClipReaction } from './ClipReaction';
import { ClipShare } from './ClipShare';

const Box = styled.div`
  flex-direction: column;
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.dark2Color};
  border-radius: 5px;
  overflow: hidden;
`;

const ContentBox = styled.div`
  background: ${({ theme }) => darken(0.1, theme.dark1Color)};
`;

const EmptyBottom = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
`;

const Bottom = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
`;

const CommentsBox = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  background: ${({ theme }) => theme.dark2Color};
  border-top: 1px solid #1e1d22;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
`;

interface IProps extends IClip {
  meta?: boolean;
  autoPlay?: boolean;
}

export const ClipView: FC<IProps> = ({
  id,
  title,
  cover,
  likes,
  dislikes,
  clipId,
  createdAt,
  author,
  meta,
  autoPlay
}) => {
  return (
    <Box>
      <Head>
        <title>{title && title}</title>
        {meta && id && (
          <>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={title} />
            <meta property="og:image" content={cover} />
            <meta
              property="og:url"
              content={`https://twitchru.com/clip?id=${id}`}
            />
          </>
        )}
      </Head>
      <ContentBox>
        <TwitchClipPlayer sourceId={clipId} autoPlay={autoPlay} />
      </ContentBox>
      <Bottom>
        <ClipReactionProvider clipId={id}>
          {({ clipReaction }) => (
            <>
              <ClipReaction
                id={id}
                type="LIKE"
                state={
                  clipReaction && clipReaction.type === ClipReactionType.LIKE
                }
                count={likes}
                icon="thumb-up"
              />
              <ClipReaction
                id={id}
                type="DISLIKE"
                state={
                  clipReaction && clipReaction.type === ClipReactionType.DISLIKE
                }
                count={dislikes}
                icon="thumb-down"
              />
            </>
          )}
        </ClipReactionProvider>

        <ClipShare id={id} />
        {author && <ClipMenu id={id} authorId={author.id} />}
        <EmptyBottom />
        {author && <ClipAuthor createdAt={createdAt} authorId={author.id} />}
      </Bottom>
      <CommentsBox>
        <Comments clipId={id} />
      </CommentsBox>
    </Box>
  );
};
