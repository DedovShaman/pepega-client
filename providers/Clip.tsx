import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';
import { getAccessToken } from '../lib/auth';

export const GET_CLIP = gql`
  query getClip($where: ClipWhereUniqueInput!) {
    clip(where: $where) {
      id
      title
      nfws
      spoiler
      clipId
      cover
      createdAt
      channel {
        id
        name
      }
      author {
        id
        name
      }
    }
  }
`;

const POST_REMOVED = gql`
  subscription postRemoved($id: ID!) {
    postRemoved(id: $id)
  }
`;

const POST_COMMENT_COUNT_CHANGED = gql`
  subscription postCommentCountChanged($id: ID!) {
    postCommentCountChanged(id: $id)
  }
`;

const POST_REACTION_CHANGED = gql`
  subscription postReactionChanged($id: ID!) {
    postReactionChanged(id: $id) {
      likes
      dislikes
      rating
      reaction
      userId
    }
  }
`;

interface IPropsInner {
  clip: any;
  // subscribePostRemoved: () => void;
  // subscribePostCommentCountChanged: () => void;
  // subscribePostReactionChanged: () => void;
  children: any;
}

class ClipProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    // this.props.subscribePostRemoved();
    // this.props.subscribePostCommentCountChanged();
    // this.props.subscribePostReactionChanged();
  }

  public render() {
    return this.props.children({
      clip: this.props.clip
    });
  }
}

interface IProps {
  where?: any;
  noRealtime?: boolean;
  children: any;
}

const ClipProvider: FC<IProps> = ({ children, where, noRealtime }) => {
  return (
    <Query query={GET_CLIP} variables={{ where }}>
      {({ subscribeToMore, loading, error, data }) => {
        if (loading) {
          return null;
        }

        if (error) {
          return null;
        }

        if (noRealtime) {
          return children({
            clip: data.clip
          });
        }

        return (
          <ClipProviderInner
            clip={data.clip}
            // subscribePostRemoved={() => {
            //   subscribeToMore({
            //     document: POST_REMOVED,
            //     variables: { id },
            //     updateQuery: (prev, { subscriptionData }) => {
            //       if (!subscriptionData.data) {
            //         return prev;
            //       }

            //       return {
            //         ...prev,
            //         post: null
            //       };
            //     }
            //   });
            // }}
            // subscribePostCommentCountChanged={() => {
            //   subscribeToMore({
            //     document: POST_COMMENT_COUNT_CHANGED,
            //     variables: { id },
            //     updateQuery: (prev, { subscriptionData }) => {
            //       if (!subscriptionData.data) {
            //         return prev;
            //       }

            //       const commentsCount =
            //         subscriptionData.data.postCommentCountChanged;

            //       return {
            //         ...prev,
            //         post: {
            //           ...prev.post,
            //           commentsCount
            //         }
            //       };
            //     }
            //   });
            // }}
            // subscribePostReactionChanged={() => {
            //   subscribeToMore({
            //     document: POST_REACTION_CHANGED,
            //     variables: { id },
            //     updateQuery: (prev, { subscriptionData }) => {
            //       if (!subscriptionData.data) {
            //         return prev;
            //       }

            //       // TODO: rethink
            //       const token = getAccessToken();
            //       let currentId = null;

            //       if (token) {
            //         currentId = JSON.parse(atob(token.split('.')[1])).userId;
            //       }

            //       const reactionData =
            //         subscriptionData.data.postReactionChanged;

            //       return {
            //         ...prev,
            //         post: {
            //           ...prev.post,
            //           reaction:
            //             reactionData.userId === currentId
            //               ? reactionData.reaction
            //               : prev.post.reaction,
            //           likes: reactionData.likes,
            //           dislikes: reactionData.dislikes,
            //           rating: reactionData.rating
            //         }
            //       };
            //     }
            //   });
            // }}
          >
            {children}
          </ClipProviderInner>
        );
      }}
    </Query>
  );
};
export default ClipProvider;
