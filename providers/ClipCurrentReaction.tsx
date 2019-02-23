import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_USER = gql`
  query getCurrentUser {
    user(where: { id: "" }) {
      id
    }
  }
`;

const GET_CLIP_REACTION = gql`
  query clipReaction($clipUserId: String!) {
    clipReaction(where: { clipUserId: $clipUserId }) {
      type
    }
  }
`;

const CLIP_REACTION_UPDATED = gql`
  subscription clipReactionUpdated($clipUserId: String!) {
    clipReaction(where: { node: { clipUserId: $clipUserId } }) {
      node {
        type
      }
    }
  }
`;

interface IPropsInner {
  clipReaction: any;
  clipReactionUpdated: () => void;
  children: any;
}

class ClipReactionProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.clipReactionUpdated();
  }

  public render() {
    return this.props.children({
      clipReaction: this.props.clipReaction
    });
  }
}

interface IPropsClipReactionProvider {
  clipUserId?: string;
  children: any;
}

const ClipReactionProvider: FC<IPropsClipReactionProvider> = ({
  children,
  clipUserId
}) => {
  return (
    <Query query={GET_CLIP_REACTION} variables={{ clipUserId }}>
      {({ subscribeToMore, loading, error, data }) => {
        if (loading || error) {
          return children({ clipReaction: null });
        }

        return (
          <ClipReactionProviderInner
            clipReaction={data.clipReaction}
            clipReactionUpdated={() => {
              subscribeToMore({
                document: CLIP_REACTION_UPDATED,
                variables: { clipUserId },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }

                  return {
                    ...prev,
                    clipReaction: {
                      ...(prev.clipReaction || {}),
                      ...subscriptionData.data.clipReaction.node
                    }
                  };
                }
              });
            }}
          >
            {children}
          </ClipReactionProviderInner>
        );
      }}
    </Query>
  );
};

interface IProps {
  clipId: string;
  children: any;
}

const ClipCurrentReaction: FC<IProps> = ({ clipId, children }) => (
  <Query query={GET_USER}>
    {({ loading, error, data }) => {
      if (loading || error || !data || !data.user) {
        return children({ clipReaction: null });
      }

      return (
        <ClipReactionProvider
          clipUserId={`${clipId}-${data.user.id}`}
          children={children}
        />
      );
    }}
  </Query>
);

export default ClipCurrentReaction;
