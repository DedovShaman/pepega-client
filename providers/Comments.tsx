import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_COMMENTS = gql`
  query getComments($where: CommentWhereInput) {
    comments(where: $where) {
      id
      content
      createdAt
      author {
        id
      }
    }
  }
`;

const COMMENT_SUB = gql`
  subscription comment($where: CommentSubscriptionWhereInput) {
    comment(where: $where) {
      mutation
      previousValues {
        id
      }
      node {
        id
        content
        createdAt
        author {
          id
        }
      }
    }
  }
`;

interface IPropsInner {
  subscribeNewComments: () => void;
  comments: any;
  children: any;
}

class Inner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.subscribeNewComments();
  }

  public render() {
    return this.props.children({
      comments: this.props.comments
    });
  }
}

interface IProps {
  where: any;
  limit?: number;
  children: any;
}

const Provider: FC<IProps> = ({ where, children, limit }) => (
  <Query query={GET_COMMENTS} variables={{ where }}>
    {({ subscribeToMore, loading, error, data }) => {
      if (loading || error) {
        return <div />;
      }

      return (
        <Inner
          comments={data.comments}
          subscribeNewComments={() => {
            subscribeToMore({
              document: COMMENT_SUB,
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
                } = subscriptionData.data.comment;

                switch (mutation) {
                  case 'CREATED':
                    if (prev.comments.findIndex(c => c.id === node.id) < 0) {
                      return {
                        ...prev,
                        comments: [...prev.comments.slice(-limit), node]
                      };
                    }
                  case 'DELETED':
                    return {
                      ...prev,
                      comments: [
                        ...prev.comments.filter(c => c.id !== previousValues.id)
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
