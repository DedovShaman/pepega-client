import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import { SWRow } from '../../../ui/SWRow';

const SET_PROFILE_VISIBLE = gql`
  mutation setProfileVisible($id: ID!, $visible: Boolean!) {
    setProfileVisible(id: $id, visible: $visible)
  }
`;

const DISCONNECT_PROFILE = gql`
  mutation disconnectProfile($profileId: ID!) {
    disconnectProfile(profileId: $profileId)
  }
`;

const IntegrationBox = styled.div`
  margin: 20px 0;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  border-radius: 5px;
`;

const IntegrationHeader = styled('div')<{
  bgColor: string;
}>`
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 5px 5px 0 0;
  background: ${({ bgColor }) => darken(0.1, bgColor)};
`;

const IntegrationLogo = styled.div`
  font-size: 18px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntegrationUsername = styled('div')<{
  bgColor: string;
}>`
  font-size: 13px;
  padding: 0 8px;
  color: ${({ bgColor }) => lighten(0.4, bgColor)};
`;

const IntegrationHeaderActions = styled.div`
  margin-left: auto;
`;

const IntegrationContent = styled('div')<{
  bgColor: string;
}>`
  background: ${({ bgColor }) => bgColor};
  padding: 0 20px;
  border-radius: 0 0 5px 5px;
`;

interface IProps {
  profile: any;
  denyDisconnect?: boolean;
}

export const Integration: FC<IProps> = ({ profile, denyDisconnect }) => {
  let bgColor = null;
  let icon = null;
  let socialLink = '';

  switch (profile.service) {
    case 'google': {
      bgColor = '#DB4437';
      icon = 'google';
      socialLink = `https://plus.google.com/${profile.serviceId}`;
      break;
    }
    case 'vkontakte': {
      bgColor = '#507299';
      icon = 'vkontakte';
      socialLink = `https://vk.com/id${profile.serviceId}`;
      break;
    }
    case 'twitch': {
      bgColor = '#6542a6';
      icon = 'twitch';
      socialLink = `https://twitch.tv/${profile.name.toLowerCase()}`;
      break;
    }
    default: {
      return null;
    }
  }

  return (
    <IntegrationBox>
      <IntegrationHeader bgColor={bgColor}>
        <IntegrationLogo>
          <Icon type={icon} />
        </IntegrationLogo>
        <IntegrationUsername bgColor={bgColor}>
          <a href={socialLink} target="_blank">
            {profile.name}
          </a>
        </IntegrationUsername>
        <IntegrationHeaderActions>
          {!denyDisconnect && (
            <Mutation mutation={DISCONNECT_PROFILE}>
              {disconnectProfile => (
                <Button
                  mainColor={bgColor}
                  onClick={() =>
                    disconnectProfile({
                      variables: { profileId: profile.id }
                    })
                  }
                >
                  Отключить
                </Button>
              )}
            </Mutation>
          )}
        </IntegrationHeaderActions>
      </IntegrationHeader>
      <IntegrationContent bgColor={bgColor}>
        <Mutation mutation={SET_PROFILE_VISIBLE}>
          {setUserProfileVisible => (
            <SWRow
              active={profile.visible}
              title="Показывать в профиле"
              onChange={() =>
                setUserProfileVisible({
                  variables: { id: profile.id, visible: !profile.visible }
                })
              }
              activeColor={lighten(0.1, bgColor)}
            />
          )}
        </Mutation>
      </IntegrationContent>
    </IntegrationBox>
  );
};

export default Integration;
