import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET = gql`
  query channelSupporter($where: ChannelSupporterWhereUniqueInput!) {
    channelSupporter(where: $where) {
      id
      active
      channel {
        id
      }
    }
  }
`;

const UPDATED = gql`
  subscription channelSupporter(
    $where: ChannelSupporterSubscriptionWhereInput
  ) {
    channelSupporter(where: $where) {
      node {
        id
        active
        channel {
          id
        }
      }
    }
  }
`;

interface IPropsInner {
  channelSupporter: any;
  updated: () => void;
  children: any;
}

class ProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.updated();
  }

  public render() {
    return this.props.children({
      channelSupporter: this.props.channelSupporter
    });
  }
}

interface IProps {
  id?: string;
}

const Provider: FC<IProps> = ({ children, id = '' }) => (
  <Query query={GET} variables={{ where: { id } }}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading || error) {
        return null;
      }

      const subWhere: any = { node: { id } };

      return (
        <ProviderInner
          channelSupporter={data.channelSupporter}
          updated={() => {
            subscribeToMore({
              document: UPDATED,
              variables: { where: subWhere },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                return {
                  ...prev,
                  channelSupporter: {
                    ...prev.channelSupporter,
                    ...subscriptionData.data.channelSupporter.node
                  }
                };
              }
            });
          }}
        >
          {children}
        </ProviderInner>
      );
    }}
  </Query>
);

export default Provider;
