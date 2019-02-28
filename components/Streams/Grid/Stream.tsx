import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import { Mutation, Query } from 'react-apollo';
import posed from 'react-pose';
import styled from 'styled-components';
import { Icon } from '../../../ui/Icon';
import { TwitchPlayer } from '../../../ui/TwitchPlayer';

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
        video_banner
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

const Box = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
  background: radial-gradient(
    ${({ theme }) => lighten(0.02, theme.dark2Color)},
    ${({ theme }) => darken(0.02, theme.dark2Color)}
  );
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

const StreamLink = styled.div`
  display: flex;
  justify-content: center;
  min-height: 40px;
  padding: 8px 0;
  width: 100%;
  position: relative;
  text-align: left;
`;

const Logo = styled.div`
  width: 30px;
  display: flex;
  position: relative;
  justify-content: center;
`;

const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 4px;
`;

const Online = styled.div`
  display: none;
  position: absolute;
  height: 8px;
  width: 8px;
  background: #ff2c2d;
  right: 0;
  bottom: 0;
  border-radius: 100%;
`;

const StreamData = styled.div`
  /* padding: 0 10px; */
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StreamName = styled.a`
  font-size: 13.5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StreamCategory = styled.a`
  font-size: 11.5px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
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

const StreamPreview = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

interface IPropsStreamInfo {
  stream;
  id;
  channel;
  title?: string;
  logo?: string;
  manage?: boolean;
}
interface IProps {
  id: string;
  channelId: string;
  name: string;
  logo: string;
  title: string;
  live: boolean;
  cost: number;
}

const Stream: FC<IProps> = ({ channelId, name, logo, title, cost }) => {
  return (
    <>
      <Box>
        <StreamBox>
          {process.browser && <TwitchPlayer muted autoplay channel={name} />}
        </StreamBox>
        <StreamOverLink href={`https://twitch.tv/${name}`} target="_blank" />
      </Box>
      <StreamLink>
        {logo && (
          <Logo>
            <a href={`https://twitch.tv/${name}`} target="_blank">
              <LogoImg src={logo} />
            </a>
            <Online />
          </Logo>
        )}
        <StreamData>
          <StreamName href={`https://twitch.tv/${name}`} target="_blank">
            {title || name}
          </StreamName>
          <StreamCategory href={`https://twitch.tv/${name}`} target="_blank">
            {name}
          </StreamCategory>
        </StreamData>
      </StreamLink>
    </>
  );
};

export default Stream;
