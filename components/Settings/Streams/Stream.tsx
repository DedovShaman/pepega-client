import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';
import { Input } from '../../../ui/Input';
import { SWRow } from '../../../ui/SWRow';

const SET_CHANNEL_SUPPORTER_ACTIVE = gql`
  mutation setChannelSupporterActive($id: ID!, $active: Boolean!) {
    setChannelSupporterActive(id: $id, active: $active)
  }
`;

const DELETE_CHANNEL_SUPPORTER = gql`
  mutation deleteChannelSupporter($id: ID!) {
    deleteChannelSupporter(where: { id: $id }) {
      id
    }
  }
`;

const PointsIcon = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: transparent;
  border: 2px solid;
  margin: 0 10px 0 0;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
`;

const PointsIconReal = styled(PointsIcon)`
  border-color: #3fa447;
`;

const CostBox = styled.div`
  display: flex;
  align-items: center;
`;

const CostInputBox = styled.div`
  width: 50px;

  input {
    text-align: center;
  }
`;

const IntegrationBox = styled.div`
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  /* border-radius: 5px; */
`;

const IntegrationHeader = styled('div')`
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 50px;
  background: ${({ theme }) => lighten(0.1, theme.dark2Color)};
`;

const IntegrationLogo = styled.div`
  font-size: 18px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntegrationUsername = styled('div')`
  font-size: 13px;
  padding: 0 8px;
  /* color: ${({ bgColor }) => lighten(0.4, bgColor)}; */
`;

const IntegrationHeaderActions = styled.div`
  margin-left: auto;
`;

const IntegrationContent = styled('div')`
  padding: 0 20px;
  border-radius: 0 0 5px 5px;
`;

interface IProps {
  channelSupporter: any;
}

export const Integration: FC<IProps> = ({ channelSupporter }) => {
  return (
    <IntegrationBox>
      <IntegrationHeader>
        <IntegrationLogo>
          <Icon type="twitch" />
        </IntegrationLogo>
        <IntegrationUsername>
          {/* <a href={socialLink} target="_blank"> */}
          {channelSupporter.channel.name}
          {/* </a> */}
        </IntegrationUsername>
        <IntegrationHeaderActions>
          <Mutation mutation={DELETE_CHANNEL_SUPPORTER}>
            {deleteChannelSupporter => (
              <Button
                mainColor="#4d517f"
                onClick={() =>
                  deleteChannelSupporter({
                    variables: { id: channelSupporter.id }
                  })
                }
              >
                Удалить
              </Button>
            )}
          </Mutation>
        </IntegrationHeaderActions>
      </IntegrationHeader>
      <IntegrationContent>
        <Mutation mutation={SET_CHANNEL_SUPPORTER_ACTIVE}>
          {setChannelSupporterActive => (
            <SWRow
              activeColor={lighten(0.05, '#4d517f')}
              active={channelSupporter.active}
              title={
                <CostBox>
                  <CostInputBox>
                    <Input defaultValue="1" maxLength={100} disabled />
                  </CostInputBox>
                  <PointsIconReal />в минуту
                </CostBox>
              }
              onChange={() =>
                setChannelSupporterActive({
                  variables: {
                    id: channelSupporter.id,
                    active: !channelSupporter.active
                  }
                })
              }
            />
          )}
        </Mutation>
      </IntegrationContent>
    </IntegrationBox>
  );
};

export default Integration;
