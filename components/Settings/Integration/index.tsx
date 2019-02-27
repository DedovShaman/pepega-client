import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import config from '../../../config';
import ProfileProvider from '../../../providers/Profile';
import ProfilesProvider from '../../../providers/Profiles';
import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import Integration from './Integration';

const ConnectBox = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  border-radius: 5px;
  padding: 5px;
  margin: 10px 0;

  a div {
    width: 100px;
    height: 40px;
    margin: 5px;
  }
`;

const SectionTitle = styled.div`
  padding: 20px 0 0;
  color: ${({ theme }) => theme.accent2Color};
  font-size: 14px;
`;

const GET_USER = gql`
  query getUser {
    user(where: { id: "" }) {
      id
    }
  }
`;

export default class Integrations extends React.Component {
  public render() {
    return (
      <Query query={GET_USER}>
        {({ loading, error, data }) => {
          if (loading || error) {
            return null;
          }

          return (
            <ProfilesProvider where={{ user: { id: data.user.id } }}>
              {({ profiles }) => (
                <div>
                  <SectionTitle>Подключить новую учетную запись</SectionTitle>
                  <ConnectBox>
                    <a href={`${config.apiUrl}auth/connect/google`}>
                      <Button mainColor="#DB4437">
                        <Icon type="google" />
                      </Button>
                    </a>
                    <a href={`${config.apiUrl}auth/connect/vkontakte`}>
                      <Button mainColor="#507299">
                        <Icon type="vk" />
                      </Button>
                    </a>
                    <a href={`${config.apiUrl}auth/connect/twitch`}>
                      <Button mainColor="#6542a6">
                        <Icon type="twitch" />
                      </Button>
                    </a>
                  </ConnectBox>
                  {profiles.map(({ id }) => (
                    <ProfileProvider id={id} key={id}>
                      {({ profile }) => (
                        <Integration
                          denyDisconnect={profiles.length === 1}
                          profile={profile}
                        />
                      )}
                    </ProfileProvider>
                  ))}
                </div>
              )}
            </ProfilesProvider>
          );
        }}
      </Query>
    );
  }
}
