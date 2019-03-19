import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { CardMedia } from '../../ui/CardMedia';
import { TwitchPlayer } from '../../ui/TwitchPlayer';

interface IProcess {
  browser: boolean;
}

declare var process: IProcess;

const GET_STREAM = gql`
  query twitchStream($userId: String) {
    twitchUser(userId: $userId) {
      id
      login
      profile_image_url
    }
    twitchStream(userId: $userId) {
      id
      user_id
      user_name
      game_id
      community_ids
      type
      title
      viewer_count
      started_at
      language
      thumbnail_url
    }
  }
`;

const StreamOverLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StreamBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

interface IProps {
  id: string;
  cost: number;
}

const Stream: FC<IProps> = ({ id, cost }) => {
  return (
    <Query query={GET_STREAM} variables={{ userId: id }}>
      {({ loading, data }) => {
        if (
          loading ||
          !data ||
          !data.twitchStream ||
          !data.twitchStream.id ||
          !data.twitchUser ||
          !data.twitchUser.id
        ) {
          return null;
        }

        const { user_name, title } = data.twitchStream;
        const { login, profile_image_url } = data.twitchUser;
        const url = `https://www.twitch.tv/${login}`;

        return (
          <CardMedia
            media={
              <>
                <StreamBox>
                  {process.browser && <TwitchPlayer muted channel={login} />}
                </StreamBox>
                <StreamOverLink href={url} target="_blank" />
              </>
            }
            avatar={profile_image_url || null}
            title={title}
            description={user_name}
            descriptionLink={url}
            count={cost}
            countIcon="circle-o"
          />
        );
      }}
    </Query>
  );
};

export default Stream;
