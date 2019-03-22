import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

export const GET_CLIP = gql`
  query getClip($id: String!) {
    clip(id: $id) {
      id
      title
      nfws
      spoiler
      thumbnail
      likes
      dislikes
      score
      channelId
      channelName
      createdAt
    }
  }
`;

const CLIP_UPDATED = gql`
  subscription clipUpdated($where: ClipSubscriptionWhereInput!) {
    clip(where: $where) {
      node {
        title
        nfws
        spoiler
        thumbnail
        likes
        dislikes
        score
        channelId
        channelName
        createdAt
      }
    }
  }
`;

interface IPropsInner {
  clip: any;
  clipUpdated: () => void;
  children: any;
}

class ClipProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.clipUpdated();
  }

  public render() {
    return this.props.children({
      clip: this.props.clip
    });
  }
}

interface IProps {
  id?: string;
  noRealtime?: boolean;
  children: any;
}

export const ClipProvider: FC<IProps> = ({ children, id, noRealtime }) => (
  <Query query={GET_CLIP} variables={{ id }}>
    {({ subscribeToMore, loading, error, data }) => {
      if (loading || error || !data || !data.clip) {
        return children({ clip: { id } });
      }

      const clip = data.clip;

      // if (noRealtime) {
      return children({ clip });
      // }

      // return (
      //   <ClipProviderInner
      //     clip={clip}
      //     clipUpdated={() => {
      //       subscribeToMore({
      //         document: CLIP_UPDATED,
      //         variables: { where: { node: where } },
      //         updateQuery: (prev, { subscriptionData }) => {
      //           if (!subscriptionData.data) {
      //             return prev;
      //           }

      //           return {
      //             ...prev,
      //             clip: {
      //               ...prev.clip,
      //               ...subscriptionData.data.clip.node
      //             }
      //           };
      //         }
      //       });
      //     }}
      //   >
      //     {children}
      //   </ClipProviderInner>
      // );
    }}
  </Query>
);

export default ClipProvider;