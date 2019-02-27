import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_PROFILE = gql`
  query getProfile($where: ProfileWhereUniqueInput!) {
    profile(where: $where) {
      id
      name
      avatar
      type
      serviceId
      visible
    }
  }
`;

const PROFILE_UPDATED = gql`
  subscription profileUpdated($where: ProfileSubscriptionWhereInput) {
    profile(where: $where) {
      node {
        name
        avatar
        type
        serviceId
        visible
      }
    }
  }
`;

interface IPropsInner {
  profile: any;
  profileUpdated: () => void;
  children: any;
}

class ProfileProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.profileUpdated();
  }

  public render() {
    return this.props.children({
      profile: this.props.profile
    });
  }
}

interface IProps {
  id?: string;
}

const ProfileProvider: FC<IProps> = ({ children, id = '' }) => (
  <Query query={GET_PROFILE} variables={{ where: { id } }}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading || error) {
        return null;
      }

      const subWhere: any = { node: { id } };

      return (
        <ProfileProviderInner
          profile={data.profile}
          profileUpdated={() => {
            subscribeToMore({
              document: PROFILE_UPDATED,
              variables: { where: subWhere },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                return {
                  ...prev,
                  profile: {
                    ...prev.profile,
                    ...subscriptionData.data.profile.node
                  }
                };
              }
            });
          }}
        >
          {children}
        </ProfileProviderInner>
      );
    }}
  </Query>
);

export default ProfileProvider;
