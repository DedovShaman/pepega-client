import Link from 'next/link';
import { darken, lighten, rgba } from 'polished';
import { FC, ReactNode, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { YMInitializer } from 'react-yandex-metrika';
import styled from 'styled-components';
import { ClipView } from '../components/Clips/ClipView';
import TopNav from '../components/Nav/Top';
import Streams from '../components/Streams';
import { Permission } from '../helpers/Permission';
import useRouter from '../hooks/useRouter';
import CategoriesProvider from '../providers/Categories';
import ClipProvider from '../providers/Clip';
import FollowsProvider from '../providers/Follows';
import { Icon } from '../ui/Icon';
import * as LeftMenu from '../ui/LeftMenu';
import { Modal } from '../ui/Modal';

import Auth from '../components/Auth';
import { NewClip } from '../components/Clips/NewClip';
import Menu from '../components/Nav/Top/Menu';
import UserProvider from '../providers/User';
import { Avatar } from '../ui/Avatar';

const LEFT_MENU_WIDTH = 300;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.dark1Color};
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Left = styled.div<{ isOpen: boolean }>`
  /* background: ${({ theme }) => lighten(0.05, theme.dark1Color)}; */
  width: ${LEFT_MENU_WIDTH}px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 100;
  transition: 0.3s;
  display: flex;
  flex-direction: column;

  @media (max-width: 700px) {
    left: ${({ isOpen }) => (isOpen ? 0 : -LEFT_MENU_WIDTH)}px;
  }
`;

const LeftLogo = styled.div`
  margin-top: 20px;
  height: 50px;
  display: flex;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  cursor: pointer;
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
`;

const LogoImg = styled.img`
  height: 30px;
  margin: 0 10px;
  padding: 5px;
  cursor: pointer;
  background: ${({ theme }) => darken(0.05, theme.main1Color)};
  border-radius: 5px;
`;

const LogoTextBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  display: flex;
`;

const LogoTitle = styled.div`
  font-size: 17px;
  font-weight: 500;
`;

const LogoDescription = styled.div`
  margin-top: -2px;
  font-size: 11px;
  color: ${({ theme }) => darken(0.4, theme.text1Color)};
`;

const LeftMenuBox = styled.div`
  flex: 1;
`;

const LeftUserBox = styled.div`
  height: 50px;
  background: ${({ theme }) => lighten(0.06, theme.dark1Color)};
`;

const PostsBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 0;
  transition: 0.3s;

  @media (min-width: 700px) {
    padding-left: ${LEFT_MENU_WIDTH}px;
  }
`;

const ContentBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentInsideBox = styled.div`
  height: 100%;
  display: flex;
`;

const Overlay = styled.div<{ leftMenuIsOpen: boolean }>`
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => rgba(theme.dark1Color, 0.98)};
  z-index: 50;

  @media (max-width: 700px) {
    ${({ leftMenuIsOpen }) => leftMenuIsOpen && 'display: block;'}
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

const UserNameBox = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => lighten(0.4, theme.main1Color)};

  @media (max-width: 700px) {
    display: none;
  }
`;

const TopLink = styled.a`
  padding: 0 10px;
  justify-content: center;
  color: ${({ theme }) => lighten(0.5, theme.dark1Color)};
  font-size: 12px;
  display: flex;
  height: 50px;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;

  span {
    margin-left: 10px;
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

interface IProps {
  fixedTopContent?: ReactNode;
  streams?: boolean;
}

const MainLayout: FC<IProps> = ({ children, fixedTopContent, streams }) => {
  const router = useRouter();
  const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(false);

  let clipId = null;

  if (typeof router.query.clipId === 'string') {
    clipId = router.query.clipId;
  }

  let backPath = null;

  if (typeof router.query.backPath === 'string') {
    backPath = router.query.backPath;
  }

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
      <Modal
        visible={!!clipId}
        minimal
        onClose={() => router.replace(backPath)}
      >
        <div style={{ width: '1000px' }}>
          <ClipProvider where={{ id: clipId }} noRealtime>
            {({ clip }) => <ClipView {...clip} id={clipId} autoPlay />}
          </ClipProvider>
        </div>
      </Modal>

      <ContentBox>
        <TopNav leftMenuTrigger={() => setLeftMenuIsOpen(!leftMenuIsOpen)} />
        <Content>
          <ContentInsideBox>
            <Left isOpen={leftMenuIsOpen}>
              <LeftLogo>
                <Link href="/" passHref>
                  <LogoBox>
                    <LogoLink>
                      <LogoImg src="https://ravepro.ams3.digitaloceanspaces.com/logo40.svg" />
                    </LogoLink>
                    <LogoTextBox>
                      <LogoTitle>PepegaCom</LogoTitle>
                      <LogoDescription>Рай для клипов с твича</LogoDescription>
                    </LogoTextBox>
                  </LogoBox>
                </Link>
              </LeftLogo>
              <LeftMenuBox>
                <Scrollbars autoHide universal>
                  <LeftMenu.Box>
                    <LeftMenu.Item
                      route="/"
                      equal
                      icon="home"
                      title="Главная"
                    />
                    <LeftMenu.Item
                      equal
                      route="/new"
                      icon="flare"
                      title="Новое"
                    />
                    <LeftMenu.Item route="/top" icon="trending-up" title="Топ">
                      <LeftMenu.SubItem route="/top/day">День</LeftMenu.SubItem>
                      <LeftMenu.SubItem route="/top/week">
                        Неделя
                      </LeftMenu.SubItem>
                      <LeftMenu.SubItem route="/top/month">
                        Месяц
                      </LeftMenu.SubItem>
                      <LeftMenu.SubItem route="/top/all">
                        Все время
                      </LeftMenu.SubItem>
                    </LeftMenu.Item>
                    <LeftMenu.Item
                      route="/categories"
                      icon="apps"
                      title="Категории"
                    >
                      <CategoriesProvider>
                        {({ categories }) =>
                          categories.map(game => (
                            <LeftMenu.SubItem
                              route={`/categories?game=${game.name}`}
                              active={router.query.game === game.name}
                              key={game.id}
                            >
                              {game.name}
                            </LeftMenu.SubItem>
                          ))
                        }
                      </CategoriesProvider>
                    </LeftMenu.Item>
                    {/* <Permission name="GET_LIKES">
                    <LeftMenu.Item
                      route="/likes"
                      icon="thumb-up"
                      title="Понравившиеся"
                    />
                  </Permission> */}
                    <Permission name="GET_FOLLOWS">
                      <LeftMenu.Item
                        route="/follows"
                        icon="favorite"
                        title="Подписки"
                      >
                        <FollowsProvider>
                          {({ follows, moreFollows, hasMore }) => (
                            <>
                              {follows.map(channel => (
                                <LeftMenu.SubItem
                                  route={`/follows?channel=${channel.name}`}
                                  active={router.query.channel === channel.name}
                                  key={channel.name}
                                >
                                  {channel.title}
                                </LeftMenu.SubItem>
                              ))}
                              {hasMore && (
                                <LeftMenu.LoadMore
                                  onClick={() => moreFollows()}
                                >
                                  <Icon type="chevron-down" />
                                </LeftMenu.LoadMore>
                              )}
                            </>
                          )}
                        </FollowsProvider>
                      </LeftMenu.Item>
                      <LeftMenu.Item
                        route="/settings"
                        icon="settings"
                        title="Настройки"
                      >
                        <LeftMenu.SubItem route={`/settings/promoter`}>
                          Продвижение
                        </LeftMenu.SubItem>
                        <LeftMenu.SubItem route={`/settings/integrations`}>
                          Интеграции
                        </LeftMenu.SubItem>
                      </LeftMenu.Item>
                    </Permission>
                  </LeftMenu.Box>
                </Scrollbars>
              </LeftMenuBox>
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
                      <Icon type="plus-circle" />
                      <span>Предложить клип</span>
                    </TopLink>
                  </Link>
                )}
              </Permission>
              <LeftUserBox>
                <Permission>
                  <UserProvider>
                    {({ user }) => (
                      <Menu user={user}>
                        <UserDataBox>
                          <AvatarBox>
                            <Avatar avatar={user.avatar} />
                          </AvatarBox>
                          <UserNameBox>{user.name}</UserNameBox>
                        </UserDataBox>
                      </Menu>
                    )}
                  </UserProvider>
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
              </LeftUserBox>
            </Left>
            <PostsBox id="layoutContent">
              {fixedTopContent}
              <Scrollbars
                renderView={props => <div {...props} id="mainScroll" />}
                autoHide
                universal
              >
                {streams && <Streams />}
                {children}
              </Scrollbars>
            </PostsBox>
          </ContentInsideBox>
          <Overlay
            leftMenuIsOpen={leftMenuIsOpen}
            onClick={() => setLeftMenuIsOpen(false)}
          />
        </Content>
      </ContentBox>
      <YMInitializer accounts={[51879323]} version="2" />
    </Box>
  );
};

export default MainLayout;
