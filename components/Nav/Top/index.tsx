import gql from 'graphql-tag';
import Link from 'next/link';
import { darken, lighten, rgba } from 'polished';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { Permission } from '../../../helpers/Permission';
import useRouter from '../../../hooks/useRouter';
import UserProvider from '../../../providers/User';
import WalletProvider from '../../../providers/Wallet';
import { Avatar } from '../../../ui/Avatar';
import { Icon } from '../../../ui/Icon';
import { Modal } from '../../../ui/Modal';
import { humanNumbers } from '../../../utils/count';
import Auth from '../../Auth';
import { NewClip } from '../../Clips/NewClip';
import Menu from './Menu';

const GET_WALLETS = gql`
  query getWallets {
    coinWallets: wallets(
      where: { currency: COIN, user: { id: "" } }
      first: 1
    ) {
      id
    }
    realWallets: wallets(
      where: { currency: REAL, user: { id: "" } }
      first: 1
    ) {
      id
    }
  }
`;

const Box = styled.div`
  height: 50px;
  display: flex;
  z-index: 100;
  padding: 0 10px;
  background: ${({ theme }) => darken(0.1, theme.main1Color)};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const LeftMenu = styled.div`
  height: 100%;

  @media (max-width: 700px) {
    display: none;
  }
`;

const Links = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  font-size: 13px;
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

const MenuButton = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 20px;
  color: ${({ theme }) => lighten(0.3, theme.main1Color)};
  cursor: pointer;

  @media (min-width: 700px) {
    display: none;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
`;

const LogoImg = styled.img`
  height: 28px;
  margin: 0 10px;
  padding: 5px;
  cursor: pointer;
  background: ${({ theme }) => lighten(0.05, theme.main1Color)};
  border-radius: 5px;

  @media (max-width: 700px) {
    display: none;
  }
`;

const UserBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const TopLink = styled.a`
  padding: 0 10px;
  color: ${({ theme }) => lighten(0.3, theme.main1Color)};
  font-size: 12px;
  display: flex;
  height: 100%;
  align-items: center;
  cursor: pointer;
  height: 100%;
  text-transform: uppercase;

  span {
    margin-left: 10px;
  }

  @media (max-width: 700px) {
    span {
      display: none;
    }
  }

  i {
    display: flex;
    align-items: center;
    font-size: 15px;
  }

  :hover {
    color: ${({ theme }) => lighten(0.6, theme.main1Color)};
  }
`;

const UserDataBox = styled.div`
  padding: 0 5px;
  display: flex;
  cursor: pointer;
  align-items: center;
  height: 100%;
`;

const AvatarBox = styled.div`
  padding-left: 14px;
`;

const PointsBox = styled.div`
  display: flex;
  margin: 0 10px;

  @media (max-width: 700px) {
    display: none;
  }
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  font-size: 13px;
  background: ${({ theme }) => rgba(theme.dark2Color, 0.5)};
  padding: 0 10px;
  border-radius: 5px;
  height: 32px;
`;

const PointsIcon = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: transparent;
  border: 2px solid;
  margin: 0 10px 0 0;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointsIconCoin = styled(PointsIcon)`
  border-color: #a48b3f;
`;

const PointsIconReal = styled(PointsIcon)`
  border-color: #3fa447;
`;

const PointsCount = styled.div`
  color: ${({ theme }) => lighten(0.4, theme.main1Color)};
  font-size: 12px;
  font-weight: 500;
`;

const UserNameBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: ${({ theme }) => lighten(0.4, theme.main1Color)};

  @media (max-width: 700px) {
    display: none;
  }
`;

const UserCaratBox = styled.div`
  height: 100%;
  padding: 0 6px;
  display: flex;
  align-items: center;
  font-size: 17px;
`;

interface IProps {
  leftMenuTrigger: () => void;
}

const TopNav: FC<IProps> = ({ leftMenuTrigger }) => {
  const router = useRouter();

  return (
    <Box>
      <Modal
        minimal
        visible={router.query.authModal === '1'}
        onClose={() => router.back()}
      >
        <Auth />
      </Modal>
      <Modal
        title="Новый клип"
        visible={router.query.newClipModal === '1'}
        onClose={() => router.back()}
      >
        <NewClip />
      </Modal>
      <Left>
        <MenuButton onClick={() => leftMenuTrigger()}>
          <Icon type="menu" />
        </MenuButton>
        <Link href="/" passHref>
          <LogoLink>
            <LogoImg src="https://ravepro.ams3.digitaloceanspaces.com/logo40.svg" />
          </LogoLink>
        </Link>
        <LeftMenu>
          <Links>
            <Link href="/" passHref>
              <TopLink>Клипы</TopLink>
            </Link>
            <TopLink href="https://discord.gg/xVprhFC" target="_blank">
              Discord
            </TopLink>
          </Links>
        </LeftMenu>
      </Left>
      <Right>
        <UserBox>
          <Links>
            <Permission name="CREATE_CLIP">
              {({ deny }) => (
                <Link
                  as={`${deny ? 'auth?continue=' : ''}/newClip`}
                  href={{
                    pathname: router.route,
                    query: {
                      ...router.query,
                      authModal: deny ? 1 : 0,
                      newClipModal: deny ? 0 : 1
                    }
                  }}
                  passHref
                >
                  <TopLink>
                    <Icon type="collection-plus" />
                    <span>Закинуть клип</span>
                  </TopLink>
                </Link>
              )}
            </Permission>

            <Permission invert>
              <Link
                as={`/auth?continue=${router.asPath}`}
                href={{
                  pathname: router.route,
                  query: {
                    ...router.query,
                    authModal: 1
                  }
                }}
                passHref
              >
                <TopLink>Войти</TopLink>
              </Link>
            </Permission>
          </Links>

          <Permission name="GET_WALLETS">
            <PointsBox>
              <Query query={GET_WALLETS} ssr={false}>
                {({ loading, error, data }) => {
                  if (loading || error) {
                    return null;
                  }

                  return (
                    <>
                      {data.coinWallets.map(w => (
                        <WalletProvider key={w.id} where={{ id: w.id }}>
                          {({ wallet }) => (
                            <Points>
                              <PointsIconCoin />
                              <PointsCount>
                                {humanNumbers(wallet.balance)}
                              </PointsCount>
                            </Points>
                          )}
                        </WalletProvider>
                      ))}
                      {data.realWallets.map(w => (
                        <WalletProvider key={w.id} where={{ id: w.id }}>
                          {({ wallet }) => (
                            <Points>
                              <PointsIconReal />
                              <PointsCount>
                                {humanNumbers(wallet.balance)}
                              </PointsCount>
                            </Points>
                          )}
                        </WalletProvider>
                      ))}
                    </>
                  );
                }}
              </Query>
            </PointsBox>
          </Permission>

          <Permission>
            <UserProvider>
              {({ user }) => (
                <Menu user={user}>
                  <UserDataBox>
                    <UserNameBox>{user.name}</UserNameBox>
                    <AvatarBox>
                      <Avatar avatar={user.avatar} />
                    </AvatarBox>
                    <UserCaratBox>
                      <Icon type="caret-down" />
                    </UserCaratBox>
                  </UserDataBox>
                </Menu>
              )}
            </UserProvider>
          </Permission>
        </UserBox>
      </Right>
    </Box>
  );
};

export default TopNav;
