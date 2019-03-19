import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_USER = gql`
  query getUser($id: ID) {
    user(id: $id) {
      id
      name
      avatar
      banned
    }
  }
`;

const USER_UPDATED = gql`
  subscription userUpdated($where: UserSubscriptionWhereInput) {
    user(where: $where) {
      node {
        name
        avatar
        banned
      }
    }
  }
`;

interface IPropsInner {
  user: any;
  userUpdated: () => void;
  children: any;
}

class UserProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.userUpdated();
  }

  public render() {
    return this.props.children({
      user: this.props.user
    });
  }
}

interface IProps {
  id?: string;
}

const UserProvider: FC<IProps> = ({ children, id = '' }) => (
  <Query query={GET_USER} variables={{ id }}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading || error || !data.user) {
        return null;
      }

      const subWhere: any = { node: { id } };

      return (
        <UserProviderInner
          user={data.user}
          userUpdated={() => {
            subscribeToMore({
              document: USER_UPDATED,
              variables: { where: subWhere },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                return {
                  ...prev,
                  user: {
                    ...prev.user,
                    ...subscriptionData.data.user.node
                  }
                };
              }
            });
          }}
        >
          {children}
        </UserProviderInner>
      );
    }}
  </Query>
);

export default UserProvider;
