import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import { IClip } from '../../interfaces/Clip';
import { Icon } from '../../ui/Icon';
import { VideoPreview } from '../../ui/VideoPreview';
import { shortNumbers } from '../../utils/count';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const Preview = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  width: 100%;
  background: ${({ theme }) => theme.dark2Color};
`;

const PreviewContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Bottom = styled.div`
  display: flex;
  font-size: 11.5px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
  width: 100%;
`;

const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 4px 8px 4px 0;
  line-height: 16px;
`;

const BottomRight = styled.div``;

const Title = styled.div`
  font-size: 13.5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.text1Color};
`;

const Rating = styled.div`
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-size: 12px;
  color: ${({ theme }) => lighten(0.5, theme.dark2Color)};
  background: ${({ theme }) => theme.dark2Color};
  font-weight: 500;
`;

const Author = styled.div``;

const IconBox = styled.div`
  margin-right: 8px;
`;

const Date = styled.div`
  display: flex;
`;

interface IProps {
  clip: IClip;
  onPlay: () => void;
}

export const ClipGridView: FC<IProps> = ({ clip, onPlay }) => {
  const date =
    clip &&
    clip.createdAt &&
    distanceInWordsToNow(clip.createdAt, {
      locale: ruLocale
    }) + ' назад';

  return (
    <Box>
      <Preview>
        <PreviewContent>
          {clip && (
            <VideoPreview
              onClick={() => onPlay()}
              nsfw={clip.nfws}
              spoiler={clip.spoiler}
              cover={clip.cover}
              date={date}
            />
          )}
        </PreviewContent>
      </Preview>
      <Bottom>
        <BottomLeft>
          <Title>{clip && clip.title}</Title>
          <Author>
            {clip && clip.channel && (
              <a
                href={`https://www.twitch.tv/${clip.channel.name}`}
                target="_blank"
              >
                {clip.channel.name}
              </a>
            )}
          </Author>
          <Date />
        </BottomLeft>
        <BottomRight>
          {/* <Rating>
            <IconBox>
              <Icon
                type={clip && clip.rating < 0 ? 'thumb-down' : 'thumb-up'}
              />
            </IconBox>
            {shortNumbers(clip ? clip.rating : 0)}
          </Rating> */}
        </BottomRight>
      </Bottom>
    </Box>
  );
};
