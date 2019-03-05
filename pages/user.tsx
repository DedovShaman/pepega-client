import gql from 'graphql-tag';
import Head from 'next/head';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Clips } from '../components/Clips/Clips';
import UserPanelProfile from '../components/User/UserPanelProfile';
import useRouter from '../hooks/useRouter';
import Layout from '../layouts/Main';
import styled from '../theme';

const GET_USER = gql`
  query getUserData($id: ID!) {
    clipsCount(where: { author: { id: $id }, deletedAt: null })
    user(where: { id: $id }) {
      id
      name
      avatar
      profiles(where: { visible: true }) {
        id
        name
        avatar
        type
        serviceId
        visible
      }
    }
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
`;

const PostsBox = styled.div`
  margin: 0 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
`;

const UserPage = () => {
  const router = useRouter();

  let userId;

  if (typeof router.query.id === 'string') {
    userId = router.query.id;
  }

  return (
    <Query query={GET_USER} variables={{ id: userId }}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null;
        }

        if (!data || !data.user) {
          return 'User not found';
        }

        const user = data.user;

        return (
          <Layout
            streams
            fixedTopContent={
              <UserPanelProfile user={user} clipsCount={data.clipsCount} />
            }
          >
            <Box>
              <Head>
                <title>{user.name}</title>
              </Head>
              <PostsBox>
                <Clips
                  title="Клипы"
                  where={{ deletedAt: null, author: { id: user.id } }}
                />
              </PostsBox>
            </Box>
          </Layout>
        );
      }}
    </Query>
  );
};

export default UserPage;
