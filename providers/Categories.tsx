import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';

const GET_TWITCH_TOP_GAMES = gql`
  query twitchTopGames {
    twitchTopGames {
      id
      name
    }
  }
`;

interface IProps {
  children: any;
}

const CategoriesProvider: FC<IProps> = ({ children }) => (
  <Query query={GET_TWITCH_TOP_GAMES}>
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error || !data || !data.twitchTopGames) {
        return null;
      }

      return children({
        categories: data.twitchTopGames
      });
    }}
  </Query>
);

export default CategoriesProvider;
