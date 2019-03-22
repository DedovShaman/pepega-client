import gql from 'graphql-tag';
import Link from 'next/link';
import { darken } from 'polished';
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
    $orderBy: [OrderByInput!]
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

const SectionBox = styled.div`
  padding: 30px 5px 10px;
`;

const SectionTitle = styled.div`
  display: flex;
  width: 100%;
  font-size: 16px;

  a {
    cursor: pointer;
  }
`;

const SectionDescription = styled.div`
  display: flex;
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
`;

const ClipContainer = styled.div`
  margin: 6px;
  border-radius: 4px;
  overflow: hidden;
`;

interface IProps {
  where?: any;
  orderBy?: any;
  title?: string;
  titleLink?: string;
  description?: string;
  rows?: number;
  limit?: number;
  noMore?: boolean;
}

export const Clips: FC<IProps> = ({
  where,
  orderBy,
  title,
  description,
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
                      <SectionBox>
                        <SectionTitle>{title}</SectionTitle>
                        {description && (
                          <SectionDescription>{description}</SectionDescription>
                        )}
                      </SectionBox>
                    )}
                    {title && titleLink && (
                      <SectionBox>
                        <SectionTitle>
                          <Link href={titleLink} passHref>
                            <a>{title}</a>
                          </Link>
                        </SectionTitle>
                        {description && (
                          <SectionDescription>{description}</SectionDescription>
                        )}
                      </SectionBox>
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
