import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import useRouter from '../hooks/useRouter';
import { Grid } from '../ui/Grid';
import { ClipGridView } from './Clips/ClipGridView';

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

const ClipContainer = styled.div`
  margin: 5px;
  border-radius: 4px;
  overflow: hidden;
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

          const openClip = (id: string) => {
            router.push(
              {
                pathname: router.route,
                query: {
                  clipId: id,
                  backPath: router.asPath,
                  ...router.query
                }
              },
              {
                pathname: '/clip',
                query: { id }
              },
              {
                shallow: true
              }
            );
          };

          return (
            <Grid
              items={data.twitchTopClips}
              elementWidth={300}
              itemRender={clip => (
                <ClipContainer key={clip.id}>
                  <ClipGridView
                    thumbnail={clip.thumbnails.small}
                    title={clip.title}
                    channelName={clip.channel}
                    createdAt={clip.createdAt}
                    onPlay={() => openClip(clip.id)}
                  />
                </ClipContainer>
              )}
              afterRedner={
                <>
                  {data.twitchTopClips.length === 0 && (
                    <div>Клипы не найдены</div>
                  )}
                  {/* {loading && <div>Загрузка...</div>} */}
                </>
              }
            />
          );
        }}
      </Query>
    </Box>
  );
};

export default TwitchFollows;
