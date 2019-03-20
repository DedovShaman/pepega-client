import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { CardMedia } from '../../ui/CardMedia';
import { TwitchPlayer } from '../../ui/TwitchPlayer';
import { VideoPreview } from '../../ui/VideoPreview';

interface IProcess {
  browser: boolean;
}

declare var process: IProcess;

const PreviewContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const GET_STREAM = gql`
  query twitchStream($userId: String) {
    twitchUser(userId: $userId) {
      id
      login
      display_name
      profile_image_url
    }
    twitchStream(userId: $userId) {
      title
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
  livePreview: boolean;
}

const Stream: FC<IProps> = ({ id, cost, livePreview }) => {
  return (
    <Query query={GET_STREAM} variables={{ userId: id }}>
      {({ data }) => {
        let avatar = null;
        let title = '';
        let login;
        let description = '';
        let descriptionLink;
        let Media = null;

        if (data && data.twitchUser) {
          login = data.twitchUser.login;

          if (data.twitchUser.profile_image_url) {
            avatar = data.twitchUser.profile_image_url;
          }

          description = data.twitchUser.display_name;
          descriptionLink = `https://www.twitch.tv/${login}`;
        }

        if (data && data.twitchStream) {
          title = data.twitchStream.title;

          if (livePreview) {
            Media = (
              <>
                <StreamBox>
                  {process.browser && <TwitchPlayer muted channel={login} />}
                </StreamBox>
                <StreamOverLink href={descriptionLink} target="_blank" />
              </>
            );
          } else {
            let previewImg = data.twitchStream.thumbnail_url;
            previewImg = previewImg.replace('{width}', 290);
            previewImg = previewImg.replace('{height}', 163);

            Media = (
              <PreviewContent>
                <VideoPreview cover={previewImg} />
              </PreviewContent>
            );
          }
        }

        return (
          <CardMedia
            media={Media}
            avatar={avatar}
            title={title}
            description={description}
            descriptionLink={descriptionLink}
            count={cost}
            countIcon="circle-o"
          />
        );
      }}
    </Query>
  );
};

export default Stream;
