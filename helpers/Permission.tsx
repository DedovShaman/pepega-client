import gql from 'graphql-tag';
import { FC } from 'react';
import { Query } from 'react-apollo';

const CHECK_PERMISSION = gql`
  query checkPermission($name: String!, $contextId: ID) {
    checkPermission(name: $name, contextId: $contextId)
  }
`;

interface IProps {
  name: string;
  contextId?: string;
  children: any;
}

export const Permission: FC<IProps> = ({ name, contextId, children }) => (
  <Query query={CHECK_PERMISSION} variables={{ name, contextId }}>
    {({ data }) => {
      const allow = data && data.checkPermission;

      console.log(name, contextId, allow);

      if (typeof children !== 'function') {
        return allow ? children : null;
      }

      return children({ allow, deny: !allow });
    }}
  </Query>
);
