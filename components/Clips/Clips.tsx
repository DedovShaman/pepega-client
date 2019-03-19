import gql from 'graphql-tag';
import Link from 'next/link';
import { FC } from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import useRouter from '../../hooks/useRouter';
import ClipProvider from '../../providers/Clip';
import { Grid } from '../../ui/Grid';
import { ClipGridView } from './ClipGridView';

export const GET_CLIPS = gql`
  query getClips(
    $where: ClipWhereInput
    $orderBy: [ClipOrderByInput]
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

const SectionTitle = styled.div`
  display: flex;
  width: 100%;
  font-size: 18px;
  padding: 25px 5px 10px;

  a {
    cursor: pointer;
  }
`;

const ClipContainer = styled.div`
  margin: 5px;
  border-radius: 4px;
  overflow: hidden;
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
    <Query
      query={GET_CLIPS}
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
          <Box style={{ padding: '0 10px' }}>
            <InfiniteScroll
              dataLength={clips.length}
              hasMore={!rows && !noMore && !loading}
              scrollableTarget="mainScroll"
              next={() => {
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
                });
              }}
            >
              <Grid
                beforeRender={
                  <>
                    {title && !titleLink && (
                      <SectionTitle>{title}</SectionTitle>
                    )}
                    {title && titleLink && (
                      <SectionTitle>
                        <Link href={titleLink} passHref>
                          <a>{title}</a>
                        </Link>
                      </SectionTitle>
                    )}
                  </>
                }
                maxRows={rows}
                items={clips}
                elementWidth={300}
                itemRender={({ id }) => (
                  <ClipContainer key={id}>
                    <ClipProvider id={id} noRealtime>
                      {({ clip }) => (
                        <ClipGridView
                          {...clip}
                          onPlay={() => {
                            router.push(
                              {
                                pathname: router.route,
                                query: {
                                  clipId: clip.id,
                                  backPath: router.asPath,
                                  ...router.query
                                }
                              },
                              {
                                pathname: '/clip',
                                query: { id: clip.id }
                              },
                              {
                                shallow: true
                              }
                            );
                          }}
                        />
                      )}
                    </ClipProvider>
                  </ClipContainer>
                )}
              />
            </InfiniteScroll>
          </Box>
        );
      }}
    </Query>
  );
};
