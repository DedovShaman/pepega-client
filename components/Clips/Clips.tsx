import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import useRouter from '../../hooks/useRouter';
import ClipsView from './ClipsView';

export const GET_CLIPS = gql`
  query getClips(
    $where: ClipWhereInput
    $orderBy: ClipOrderByInput
    $after: String
    $first: Int
  ) {
    clips(where: $where, orderBy: $orderBy, after: $after, first: $first) {
      id
    }
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface IProps {
  where?: any;
  orderBy?: any;
  title?: string;
  titleLink?: string;
  rows?: number;
  limit?: number;
  noMore?: boolean;
}

export const Clips: FC<IProps> = ({
  where,
  orderBy,
  title,
  noMore,
  rows,
  titleLink
}) => {
  const limit: number = 25;
  const router = useRouter();

  return (
    <Box style={{ padding: '0 20px' }}>
      <Query
        query={GET_CLIPS}
        fetchPolicy="cache-and-network"
        variables={{
          where,
          orderBy,
          first: rows ? rows * 6 : limit
        }}
      >
        {({ loading, error, data, fetchMore }) => {
          if (error || !data || !data.clips) {
            return null;
          }

          const clips = data.clips;

          return (
            <ClipsView
              title={title}
              titleLink={titleLink}
              posts={clips}
              loading={loading}
              rows={rows}
              hasMore={!rows && !noMore}
              onPlay={id => {
                router.push(
                  {
                    pathname: router.route,
                    query: {
                      clipId: id,
                      backPath: router.asPath,
                      ...router.query
                    }
                  },
                  {
                    pathname: '/clip',
                    query: { id }
                  },
                  {
                    shallow: true
                  }
                );
              }}
              loadMore={() =>
                fetchMore({
                  variables: {
                    where,
                    orderBy,
                    first: limit,
                    after: clips.length ? clips[clips.length - 1].id : undefined
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return prev;
                    }

                    return {
                      ...prev,
                      clips: [...prev.clips, ...fetchMoreResult.clips]
                    };
                  }
                })
              }
            />
          );
        }}
      </Query>
    </Box>
  );
};
