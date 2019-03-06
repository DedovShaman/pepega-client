import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import gql from 'graphql-tag';
import { darken } from 'polished';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import useRouter from '../hooks/useRouter';
import { Grid } from '../ui/Grid';
import { VideoPreview } from '../ui/VideoPreview';
import { humanNumbers } from '../utils/count';

const GET_TWITCH_CHANNEL_TOP_CLIPS = gql`
  query twitchTopClips($channel: String, $game: String, $limit: Int) {
    twitchTopClips(channel: $channel, game: $game, limit: $limit) {
      id
      channel
      title
      createdAt
      thumbnails {
        small
        tiny
      }
      viewsCount
    }
  }
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  padding: 10px 20px;
`;

const Clip = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  align-items: center;
`;

const ClipPreview = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  width: 100%;
  background: ${({ theme }) => theme.dark2Color};
`;

const ClipPreviewContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const ClipBottom = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 11.5px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
  width: 100%;
  line-height: 16px;
  padding: 4px 8px 4px 0;
`;

const ClipTitle = styled.div`
  font-size: 13.5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.text1Color};
`;

const ClipAuthor = styled.a`
  display: flex;
`;

interface IProps {
  limit?: number;
}

const TwitchFollows: FC<IProps> = ({ limit }) => {
  const router = useRouter();

  return (
    <Box>
      <Query
        query={GET_TWITCH_CHANNEL_TOP_CLIPS}
        variables={{
          channel: router.query.channel,
          game: router.query.game,
          limit
        }}
      >
        {({ loading, error, data }) => {
          if (error || !data || !data.twitchTopClips) {
            return null;
          }

          const openClip = (clipId: string) => {
            router.push(
              {
                pathname: router.route,
                query: {
                  clipId,
                  backPath: router.asPath,
                  ...router.query
                }
              },
              {
                pathname: '/clip',
                query: { id: clipId }
              },
              {
                shallow: true
              }
            );
          };

          return (
            <>
              <Grid
                items={data.twitchTopClips}
                itemRender={clip => (
                  <Clip key={clip.id}>
                    <ClipPreview>
                      <ClipPreviewContent>
                        <VideoPreview
                          key={clip.id}
                          onClick={() => openClip(clip.id)}
                          cover={clip.thumbnails.small}
                          date={
                            distanceInWordsToNow(+new Date(clip.createdAt), {
                              locale: ruLocale
                            }) + ' назад'
                          }
                          views={humanNumbers(clip.viewsCount)}
                        />
                      </ClipPreviewContent>
                    </ClipPreview>
                    <ClipBottom>
                      <ClipTitle
                        onClick={() => openClip(clip.id)}
                        title={clip.title}
                      >
                        {clip.title}
                      </ClipTitle>
                      <ClipAuthor
                        target="_blank"
                        href={`https://www.twitch.tv/${clip.channel}`}
                      >
                        {clip.channel}
                      </ClipAuthor>
                    </ClipBottom>
                  </Clip>
                )}
                elementWidth={280}
                afterRedner={
                  <>
                    {data.twitchTopClips.length === 0 && (
                      <div>Клипы не найдены</div>
                    )}
                    {loading && <div>Загрузка...</div>}
                  </>
                }
              />
            </>
          );
        }}
      </Query>
    </Box>
  );
};

export default TwitchFollows;
