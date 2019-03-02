import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import { Grid } from '../../ui/Grid';
import Stream from './Stream';

const GET_CHANNELS_TOP = gql`
  query channelsTop {
    channels(where: { cost_gt: 0, live: true }, orderBy: cost_DESC, first: 6) {
      id
      channelId
      name
      logo
      title
      banner
      live
      cost
    }
  }
`;

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.dark2Color};
  margin: 10px;
`;

const Streams: FC = () => (
  <Query query={GET_CHANNELS_TOP} pollInterval={3e3}>
    {({ error, data }) => {
      if (error || !data.channels) {
        return null;
      }

      return (
        <div style={{ padding: '10px 20px' }}>
          <Grid
            elementWidth={280}
            maxRows={1}
            items={data.channels}
            itemRender={channel => (
              <div key={`${channel.id}-${channel.cost}`} style={{ padding: 5 }}>
                <Stream {...channel} />
              </div>
            )}
            afterRedner={<Divider />}
          />
        </div>
      );
    }}
  </Query>
);

export default Streams;
