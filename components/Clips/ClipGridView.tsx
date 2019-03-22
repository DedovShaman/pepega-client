import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import locale from 'date-fns/locale/ru';
import { FC } from 'react';
import styled from 'styled-components';
import { CardMedia } from '../../ui/CardMedia';
import { VideoPreview } from '../../ui/VideoPreview';

const PreviewContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

interface IProps {
  nfws?: boolean;
  spoiler?: boolean;
  thumbnail?: string;
  createdAt?: string;
  title?: string;
  channelName?: string;
  score?: number;
  viewsCount?: number;
  onPlay: () => void;
}

export const ClipGridView: FC<IProps> = ({
  nfws,
  spoiler,
  thumbnail,
  createdAt,
  title,
  channelName,
  score,
  viewsCount,
  onPlay
}) => {
  let date;

  if (typeof createdAt === 'string') {
    date = distanceInWordsToNow(createdAt, { locale }) + ' назад';
  }

  return (
    <CardMedia
      media={
        <PreviewContent>
          <VideoPreview
            onClick={() => onPlay()}
            nsfw={nfws}
            spoiler={spoiler}
            cover={thumbnail}
            date={date}
            views={viewsCount}
          />
        </PreviewContent>
      }
      title={title}
      description={channelName}
      descriptionLink={`https://www.twitch.tv/${channelName}`}
      count={score}
      countIcon={score < 0 ? 'thumb-down' : 'thumb-up'}
    />
  );
};
