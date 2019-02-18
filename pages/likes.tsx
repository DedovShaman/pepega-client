import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams/Grid';
import Layout from '../layouts/Main';

const GET_USER = gql`
  query getUser {
    user {
      id
    }
  }
`;

const LikesPage = () => (
  <Layout>
    <Query query={GET_USER}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null;
        }

        if (!data || !data.user) {
          return 'User not found';
        }

        const user = data.user;

        return (
          <>
            <Streams />
            {/* <Posts title="Понравившиеся" likedUserId={user.id} /> */}
          </>
        );
      }}
    </Query>
  </Layout>
);

export default LikesPage;
