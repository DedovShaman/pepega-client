import gql from 'graphql-tag';
import { darken, lighten, rgba } from 'polished';
import { FC } from 'react';
import { Mutation, Query } from 'react-apollo';
import posed from 'react-pose';
import styled from 'styled-components';
import { Icon } from '../../../ui/Icon';

interface IProcess {
  browser: boolean;
}

declare var process: IProcess;

const GET_STREAM = gql`
  query stream($id: String!) {
    stream(id: $id) {
      game
      viewers
      channel {
        status
        display_name
        game
        logo
      }
    }
  }
`;

const REMOVE_STREAM = gql`
  mutation removeStream($id: ID!) {
    removeStream(id: $id)
  }
`;

const StreamLink = styled.div`
  display: flex;
  justify-content: center;
  min-height: 60px;
  width: 100%;
  position: relative;
  background: ${({ theme }) => lighten(0.05, theme.main1Color)};
  text-align: left;
`;

const Logo = styled.div`
  width: 60px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.main1Color};
`;

const LogoImg = styled.img`
  width: 34px;
  height: 34px;
`;

const Online = styled.div`
  position: absolute;
  height: 12px;
  width: 12px;
  background: #ff2c2d;
  right: 7px;
  border: 3px solid ${({ theme }) => theme.main1Color};
  bottom: 7px;
  border-radius: 100%;
`;

const StreamData = styled.div`
  padding: 0 10px;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StreamName = styled.a`
  text-transform: uppercase;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StreamCategory = styled.a`
  text-transform: uppercase;
  font-size: 11px;
  color: ${({ theme }) => rgba(theme.text1Color, 0.5)};
`;

const StreamManage = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveStream = styled.div`
  padding: 0 20px;
  cursor: pointer;
  color: ${({ theme }) => lighten(0.3, theme.main1Color)};

  i {
    font-size: 17px;
  }

  :hover {
    color: ${({ theme }) => lighten(0.5, theme.main1Color)};
  }
`;

interface IPropsStreamInfo {
  stream;
  id;
  channel;
  title?: string;
  logo?: string;
}

const StreamInfo: FC<IPropsStreamInfo> = ({
  stream,
  id,
  channel,
  title,
  logo
}) => (
  <StreamLink>
    {logo && (
      <Logo>
        <a href={`https://twitch.tv/${channel}`} target="_blank">
          <LogoImg src={logo} />
        </a>
        {stream.online && <Online />}
      </Logo>
    )}
    <StreamData>
      <StreamName href={`https://twitch.tv/${channel}`} target="_blank">
        {title || channel}
      </StreamName>
      <StreamCategory href={`https://twitch.tv/${channel}`} target="_blank">
        {channel}
      </StreamCategory>
    </StreamData>
    <StreamManage>
      <Mutation mutation={REMOVE_STREAM}>
        {removeStream => (
          <RemoveStream onClick={() => removeStream({ variables: { id } })}>
            <Icon type="close" />
          </RemoveStream>
        )}
      </Mutation>
    </StreamManage>
  </StreamLink>
);

interface IProps {
  stream: any;
}

const Stream: FC<IProps> = ({ stream }) => {
  const channelId = stream.channelId;
  const channel = stream.channel;

  if (!channelId) {
    return null;
  }

  return (
    <Query query={GET_STREAM} variables={{ id: channelId }}>
      {({ loading, error, data }) => {
        if (loading) {
          return null;
        }

        if (error || !data.stream) {
          return (
            <StreamInfo id={stream.id} stream={stream} channel={channel} />
          );
        }

        return (
          <StreamInfo
            channel={channel}
            title={data.stream.channel.status}
            logo={data.stream.channel.logo}
            id={stream.id}
            stream={stream}
          />
        );
      }}
    </Query>
  );
};

export default Stream;
