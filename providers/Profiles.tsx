import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_PROFILES = gql`
  query getProfiles($where: ProfileWhereInput) {
    profiles(where: $where) {
      id
    }
  }
`;

const PROFILE_SUB = gql`
  subscription profile($where: ProfileSubscriptionWhereInput) {
    profile(where: $where) {
      mutation
      previousValues {
        id
      }
      node {
        id
      }
    }
  }
`;

interface IPropsInner {
  subscribeNewProfiles: () => void;
  profiles: any;
  children: any;
}

class Inner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.subscribeNewProfiles();
  }

  public render() {
    return this.props.children({
      profiles: this.props.profiles
    });
  }
}

interface IProps {
  where: any;
  limit?: number;
  children: any;
}

const Provider: FC<IProps> = ({ where, children, limit }) => (
  <Query
    query={GET_PROFILES}
    variables={{ where }}
    fetchPolicy="cache-and-network"
  >
    {({ subscribeToMore, loading, error, data }) => {
      if (loading || error) {
        return <div />;
      }

      return (
        <Inner
          profiles={data.profiles}
          subscribeNewProfiles={() => {
            subscribeToMore({
              document: PROFILE_SUB,
              variables: {
                where: { node: where }
              },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const {
                  mutation,
                  node,
                  previousValues
                } = subscriptionData.data.profile;

                switch (mutation) {
                  case 'CREATED':
                    if (prev.profiles.findIndex(c => c.id === node.id) < 0) {
                      return {
                        ...prev,
                        profiles: [...prev.profiles.slice(-limit), node]
                      };
                    }
                  case 'DELETED':
                    return {
                      ...prev,
                      profiles: [
                        ...prev.profiles.filter(c => c.id !== previousValues.id)
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
