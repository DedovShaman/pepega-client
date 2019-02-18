import gql from 'graphql-tag';
import Link from 'next/link';
import { Component } from 'react';
import styled from 'styled-components';
import ClipProvider from '../../providers/Clip';
import { Button } from '../../ui/Button';
import { Grid } from '../../ui/Grid';
import { ClipGridView } from './ClipGridView';

export const GET_POSTS = gql`
  query getPosts(
    $authorId: ID
    $likedUserId: ID
    $tagId: ID
    $sort: SortType
    $offset: Int
    $limit: Int
  ) {
    posts(
      authorId: $authorId
      likedUserId: $likedUserId
      tagId: $tagId
      sort: $sort
      offset: $offset
      limit: $limit
    ) {
      count
      posts {
        id
      }
    }
  }
`;

const SectionTitle = styled.div`
  display: flex;
  width: 100%;
  font-size: 18px;
  padding: 15px 0;

  a {
    cursor: pointer;
  }
`;

const PostContainer = styled.div`
  padding: 5px;
`;

const Loading = styled.div`
  padding: 10px;
  text-align: center;
`;

const LoadMore = styled.div`
  padding: 10px;
  text-align: center;
  cursor: pointer;
`;

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.dark2Color};
  margin: 10px;
`;

interface IProps {
  posts: any;
  loading: boolean;
  hasMore: boolean;
  title?: string;
  titleLink?: string;
  rows?: number;
  loadMore: () => Promise<any>;
  onPlay: (id: string) => void;
}

class PostsView extends Component<IProps> {
  public loadLock = false;

  constructor(props) {
    super(props);
  }

  public componentDidUpdate() {
    if (
      !this.loadLock &&
      // this.props.store.layoutInLoadArea &&
      !this.props.loading &&
      this.props.hasMore
    ) {
      this.loadLock = true;
      this.props.loadMore().then(() => {
        this.loadLock = false;
      });
    }
  }

  public render() {
    const {
      posts,
      loading,
      hasMore,
      loadMore,
      onPlay,
      title,
      rows,
      titleLink
    } = this.props;

    return (
      <Grid
        beforeRender={
          <>
            {title && !titleLink && <SectionTitle>{title}</SectionTitle>}
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
        items={posts}
        elementWidth={280}
        itemRender={({ id }) => (
          <PostContainer key={id}>
            <ClipProvider where={{ id }} noRealtime>
              {({ clip }) => (
                <ClipGridView clip={clip} onPlay={() => onPlay(clip.id)} />
              )}
            </ClipProvider>
          </PostContainer>
        )}
        afterRedner={
          <>
            {loading && <Loading />}
            {!loading && hasMore && (
              <LoadMore>
                <Button onClick={() => loadMore()}>Загрузить еще</Button>
              </LoadMore>
            )}
            <Divider />
          </>
        }
      />
    );
  }
}

export default PostsView;
