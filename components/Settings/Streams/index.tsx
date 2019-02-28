import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import { createRef, FC } from 'react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import ChannelSupporterProvider from '../../../providers/ChannelSupporter';
import ChannelSupportersProvider from '../../../providers/ChannelSupporters';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import ChannelSupporter from './Stream';

const GET_USER = gql`
  query getUser {
    user(where: { id: "" }) {
      id
    }
  }
`;

const NEW_SUPPORT_CHANNEL = gql`
  mutation newSupportChannel($channelName: String!) {
    newSupportChannel(channelName: $channelName)
  }
`;

const Box = styled.div`
  margin: 0 auto;
  width: 800px;
  margin-top: 20px;
  border-radius: 5px;
  overflow: hidden;
`;

const BlockTitle = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  color: ${({ theme }) => lighten(0.5, theme.dark2Color)};
  padding: 0 20px;
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 13px;
`;

const ChannelsBox = styled.div`
  /* border-radius: 5px 5px 0 0; */
  overflow: hidden;
`;

const ChannelBox = styled.div`
  background: ${({ theme }) => theme.dark2Color};
`;

const AddStreamForm = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  /* margin-top: 1px; */
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const StreamsManage: FC = () => {
  const textInput = createRef<HTMLInputElement>();

  return (
    <Query query={GET_USER}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null;
        }

        return (
          <Box>
            <ChannelSupportersProvider where={{ user: { id: data.user.id } }}>
              {({ channelSupporters }) => (
                <>
                  <BlockTitle>
                    Каналы {channelSupporters.length} из 6
                  </BlockTitle>
                  <ChannelsBox>
                    {channelSupporters.map(({ id }) => (
                      <ChannelBox key={id}>
                        <ChannelSupporterProvider id={id}>
                          {({ channelSupporter }) => (
                            <ChannelSupporter
                              channelSupporter={channelSupporter}
                            />
                          )}
                        </ChannelSupporterProvider>
                      </ChannelBox>
                    ))}
                  </ChannelsBox>
                  {channelSupporters.length < 6 && (
                    <AddStreamForm>
                      <Mutation mutation={NEW_SUPPORT_CHANNEL}>
                        {newSupportChannel => (
                          <Input
                            autoFocus
                            ref={textInput}
                            placeholder="Введите название Twitch канала и нажмите Enter"
                            onKeyPress={e => {
                              const channelName = textInput.current.value.trim();

                              if (e.key === 'Enter' && channelName.length > 0) {
                                newSupportChannel({
                                  variables: { channelName }
                                });
                                textInput.current.value = '';
                              }
                            }}
                          />
                        )}
                      </Mutation>
                    </AddStreamForm>
                  )}
                </>
              )}
            </ChannelSupportersProvider>
          </Box>
        );
      }}
    </Query>
  );
};

export default StreamsManage;
