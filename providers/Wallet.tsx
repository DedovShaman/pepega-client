import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';

const GET_WALLET = gql`
  query getWallet($where: WalletWhereUniqueInput!) {
    wallet(where: $where) {
      id
      currency
      balance
    }
  }
`;

const WALLET_UPDATED = gql`
  subscription walletUpdated($where: WalletSubscriptionWhereInput) {
    wallet(where: $where) {
      node {
        currency
        balance
      }
    }
  }
`;

interface IPropsInner {
  wallet: any;
  walletUpdated: () => void;
  children: any;
}

class WalletProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.walletUpdated();
  }

  public render() {
    return this.props.children({
      wallet: this.props.wallet
    });
  }
}

interface IProps {
  id?: string;
  where?: any;
}

const WalletProvider: FC<IProps> = ({ children, where }) => (
  <Query query={GET_WALLET} variables={{ where }}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading || error) {
        return null;
      }

      return (
        <WalletProviderInner
          wallet={data.wallet}
          walletUpdated={() => {
            subscribeToMore({
              document: WALLET_UPDATED,
              variables: { where: { node: where } },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                return {
                  ...prev,
                  wallet: {
                    ...prev.wallet,
                    ...subscriptionData.data.wallet.node
                  }
                };
              }
            });
          }}
        >
          {children}
        </WalletProviderInner>
      );
    }}
  </Query>
);

export default WalletProvider;
