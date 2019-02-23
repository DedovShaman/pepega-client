import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';

const GET_PERMISSIONS = gql`
  query getPermissions {
    getPermissions
  }
`;

type PermissionType =
  | 'CREATE_COMMENT'
  | 'DELETE_COMMENT'
  | 'CREATE_CLIP'
  | 'DELETE_CLIP'
  | 'SET_CLIP_REACTION'
  | 'GET_LIKES'
  | 'GET_FOLLOWS'
  | 'GET_WALLETS';

interface IProps {
  children: any;
  name?: PermissionType;
  contextId?: string;
  invert?: boolean;
}

export const Permission: FC<IProps> = ({ name, invert, children }) => (
  <Query query={GET_PERMISSIONS} ssr={false}>
    {({ data }) => {
      const allows = data && data.getPermissions ? data.getPermissions : [];
      let allow = allows.findIndex(p => p === name) >= 0;

      if (!name && allows.length > 0) {
        allow = true;
      }

      if (invert) {
        allow = !allow;
      }

      if (typeof children !== 'function') {
        return allow ? children : null;
      }

      return children({ allow, deny: !allow });
    }}
  </Query>
);
