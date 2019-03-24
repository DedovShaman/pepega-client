import gql from 'graphql-tag';
import { orderBy } from 'lodash';
import { darken, lighten } from 'polished';
import { createRef, FC } from 'react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import ChannelSupporterProvider from '../../../providers/ChannelSupporter';
import ChannelSupportersProvider from '../../../providers/ChannelSupporters';
import { Input } from '../../../ui/Input';
import ChannelSupporter from './ChannelSupporter';

const GET_USER = gql`
  query getUser {
    user {
      id
    }
  }
`;

const CREATE_CHANNEL = gql`
  mutation createPromoter($channelName: String!) {
    createPromoter(channelName: $channelName)
  }
`;

const Box = styled.div`
  margin: 0 auto;
  width: 800px;
  margin-top: 10px;
`;

const BlockTitle = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  color: ${({ theme }) => lighten(0.5, theme.dark2Color)};
  padding: 0 20px;
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 13px;
  border-radius: 4px;
  overflow: hidden;
`;

const ChannelsBox = styled.div`
  /* border-radius: 5px 5px 0 0; */
  overflow: hidden;
`;

const ChannelBox = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  margin: 16px 0;
  border-radius: 4px;
  overflow: hidden;
`;

const AddStreamForm = styled.div`
  background: ${({ theme }) => theme.dark2Color};
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
`;

const ChannelSupportersManage: FC = () => {
  const textInput = createRef<HTMLInputElement>();

  return (
    <Query query={GET_USER}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null;
        }

        return (
          <Box>
            <ChannelSupportersProvider
              where={{ user: { id: data.user.id } }}
              orderBy="cost_DESC"
            >
              {({ channelSupporters }) => (
                <>
                  <BlockTitle>
                    Каналы {channelSupporters.length} из 6
                  </BlockTitle>
                  <ChannelsBox>
                    {orderBy(
                      channelSupporters,
                      [
                        e => e.channel.live && e.channel.cost > 0,
                        e => e.channel.cost
                      ],
                      ['desc', 'desc']
                    ).map(({ id }) => (
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
                      <Mutation mutation={CREATE_CHANNEL}>
                        {createPromoter => (
                          <Input
                            autoFocus
                            ref={textInput}
                            placeholder="Введите название Twitch канала и нажмите Enter"
                            onKeyPress={e => {
                              const channelName = textInput.current.value.trim();

                              if (e.key === 'Enter' && channelName.length > 0) {
                                createPromoter({
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

export default ChannelSupportersManage;
