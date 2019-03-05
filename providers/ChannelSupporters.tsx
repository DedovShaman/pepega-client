import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_CHANNEL_SUPPORTERS = gql`
  query channelSupporters(
    $where: ChannelSupporterWhereInput
    $orderBy: ChannelSupporterOrderByInput
  ) {
    channelSupporters(where: $where, orderBy: $orderBy) {
      id
      channel {
        id
        cost
        live
      }
    }
  }
`;

const CHANNEL_SUPPORTER_SUB = gql`
  subscription channelSupporter(
    $where: ChannelSupporterSubscriptionWhereInput
  ) {
    channelSupporter(where: $where) {
      mutation
      previousValues {
        id
      }
      node {
        id
        channel {
          id
          cost
          live
        }
      }
    }
  }
`;

interface IPropsInner {
  subscribeNew: () => void;
  channelSupporters: any;
  children: any;
}

class Inner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.subscribeNew();
  }

  public render() {
    return this.props.children({
      channelSupporters: this.props.channelSupporters
    });
  }
}

interface IProps {
  where: any;
  orderBy?: string;
  limit?: number;
  children: any;
}

const Provider: FC<IProps> = ({ where, orderBy, children, limit }) => (
  <Query query={GET_CHANNEL_SUPPORTERS} variables={{ where, orderBy }}>
    {({ subscribeToMore, loading, error, data }) => {
      if (loading || error || !data || !data.channelSupporters) {
        return null;
      }

      const subVariables: any = {
        where: { node: where }
      };

      return (
        <Inner
          channelSupporters={data.channelSupporters}
          subscribeNew={() => {
            subscribeToMore({
              document: CHANNEL_SUPPORTER_SUB,
              variables: subVariables,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const {
                  mutation,
                  node,
                  previousValues
                } = subscriptionData.data.channelSupporter;

                switch (mutation) {
                  case 'CREATED':
                    if (
                      prev.channelSupporters.findIndex(c => c.id === node.id) <
                      0
                    ) {
                      return {
                        ...prev,
                        channelSupporters: [
                          ...prev.channelSupporters.slice(-limit),
                          node
                        ]
                      };
                    }
                    break;
                  case 'DELETED':
                    return {
                      ...prev,
                      channelSupporters: [
                        ...prev.channelSupporters.filter(
                          c => c.id !== previousValues.id
                        )
                      ]
                    };
                  default:
                    return prev;
                }
              }
            });
          }}
        >
          {children}
        </Inner>
      );
    }}
  </Query>
);

Provider.defaultProps = {
  limit: 50
};

export default Provider;
