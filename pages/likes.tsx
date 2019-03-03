import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams';
import Layout from '../layouts/Main';

const GET_USER = gql`
  query getCurrentUser {
    user(where: { id: "" }) {
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

        return (
          <>
            <Streams />
            <Clips
              title="Понравившиеся"
              where={{
                reactions_some: { type: 'LIKE', user: { id: data.user.id } }
              }}
            />
          </>
        );
      }}
    </Query>
  </Layout>
);

export default LikesPage;
