import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { connect, disconnect } from '../../../lib/auth';
import { Button } from '../../../ui/Button';
import { SWRow } from '../../../ui/SWRow';

const SET_PROFILE_VISIBLE = gql`
  mutation setUserProfileVisible($id: ID!, $visible: Boolean!) {
    setUserProfileVisible(id: $id, visible: $visible)
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
  noContent: boolean;
  bgColor: string;
}>`
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: ${({ noContent }) => (noContent ? '5px' : '5px 5px 0 0')};
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
  serviceName: string;
  bgColor: string;
  icon: string;
  profile: any;
  denyDisconnect?: boolean;
}

class Integration extends React.Component<IProps> {
  public render() {
    const { serviceName, bgColor, icon, profile, denyDisconnect } = this.props;
    const isConnect = !!profile;

    return (
      <IntegrationBox>
        <IntegrationHeader bgColor={bgColor} noContent={!isConnect}>
          <IntegrationLogo>
            <i className={`zmdi zmdi-${icon}`} />
          </IntegrationLogo>
          {isConnect && (
            <IntegrationUsername bgColor={bgColor}>
              {profile.name}
            </IntegrationUsername>
          )}
          <IntegrationHeaderActions>
            {isConnect && !denyDisconnect && (
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
            {!isConnect && (
              <Button mainColor={bgColor} onClick={() => connect(serviceName)}>
                Подключить
              </Button>
            )}
          </IntegrationHeaderActions>
        </IntegrationHeader>
        {isConnect && (
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
        )}
      </IntegrationBox>
    );
  }
}

export default Integration;
