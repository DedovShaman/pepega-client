import gql from 'graphql-tag';
import { darken } from 'polished';
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
  margin: 6px;
  border-radius: 4px;
  overflow: hidden;
`;

const SectionBox = styled.div`
  padding: 10px 5px 10px;
`;

const SectionTitle = styled.div`
  display: flex;
  width: 100%;
  font-size: 16px;

  a {
    cursor: pointer;
  }
`;

const SectionDescription = styled.div`
  display: flex;
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
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
        {({ error, data }) => {
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
              beforeRender={
                <SectionBox>
                  <SectionTitle>
                    {(
                      router.query.channel ||
                      router.query.game ||
                      'Все категории'
                    ).toUpperCase()}
                  </SectionTitle>
                  <SectionDescription>Лучшие клипы за день</SectionDescription>
                </SectionBox>
              }
              itemRender={clip => (
                <ClipContainer key={clip.id}>
                  <ClipGridView
                    viewsCount={clip.viewsCount}
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
