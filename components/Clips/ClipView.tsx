import Head from 'next/head';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import { ClipReactionType, IClip } from '../../interfaces/Clip';
import { Icon } from '../../ui/Icon';
import { TwitchClipPlayer } from '../../ui/TwitchClipPlayer';
import Comments from '../Comments';
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

const Top = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
`;

const Title = styled.div`
  height: 100%;
  padding: 0 20px;
  font-size: 15px;
  display: flex;
  width: 100%;
  align-items: center;
  flex: 1;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 10px;
    display: inline;
  }
`;

const ContentBox = styled.div``;

const EmptyBottom = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
`;

const ChannelLink = styled.a`
  display: flex;
  height: 100%;
  align-items: center;
  font-size: 13px;
  background: ${({ theme }) => darken(0.1, theme.main1Color)};
  color: ${({ theme }) => lighten(0.3, theme.main1Color)};
  padding: 0 18px;

  i {
    font-size: 17px;
    margin-right: 12px;
  }
`;

const ChannelName = styled.div`
  color: ${({ theme }) => lighten(0.45, theme.main1Color)};
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
  channel,
  reaction,
  createdAt,
  author,
  meta,
  autoPlay
}) => {
  return (
    <Box>
      <Head>
        <title>{title && title}</title>
        {meta && (
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
      <Top>
        <Title>
          <span>{title}</span>
        </Title>
        {channel.name && (
          <ChannelLink
            href={`https://twitch.tv/${channel.name}`}
            target="_blank"
          >
            <Icon type="twitch" />
            <ChannelName>{channel.name}</ChannelName>
          </ChannelLink>
        )}
      </Top>
      <ContentBox>
        <TwitchClipPlayer sourceId={clipId} autoPlay={autoPlay} />
      </ContentBox>
      <Bottom>
        <ClipReaction
          id={id}
          type="like"
          state={reaction === ClipReactionType.like}
          count={likes}
          icon="thumb-up"
        />
        <ClipReaction
          id={id}
          type="dislike"
          state={reaction === ClipReactionType.dislike}
          count={dislikes}
          icon="thumb-down"
        />
        <ClipShare id={id} />
        {author && <ClipMenu id={id} authorId={author.id} />}
        <EmptyBottom />
        {author && <ClipAuthor createdAt={createdAt} authorId={author.id} />}
      </Bottom>
      <CommentsBox>
        <Comments postId={id} />
      </CommentsBox>
    </Box>
  );
};
