import { darken, lighten } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import { Icon } from '../../ui/Icon';
import { shortNumbers } from '../../utils/count';

const Box = styled.div`
  display: flex;
  background: ${({ theme }) => darken(0.01, theme.dark2Color)};
  height: 50px;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0 10px;
`;

const UserAvatarImg = styled.img`
  height: 34px;
  width: 34px;
  border-radius: 100%;
  overflow: hidden;
`;

const UserName = styled.div`
  display: flex;
  justify-content: center;
  font-size: 13px;
  padding: 0 10px;
`;

const UserData = styled.div`
  justify-content: center;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const SocialLinks = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SocialLink = styled.div`
  padding: 0 10px;
  font-size: 16px;
`;

const Menu = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  padding: 0 10px;
`;

const MenuItem = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px;
  font-size: 12px;
  color: ${({ theme }) => lighten(0.6, theme.dark2Color)};
`;

const MenuItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

const MenuItemCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  color: ${({ theme }) => lighten(0.45, theme.dark2Color)};
`;

const MenuLeft = styled.div`
  display: flex;
`;

const MenuRight = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const SocialLinkOne = ({ profile }) => {
  let iconType = '';
  let socialLink = '';

  switch (profile.type) {
    case 'TWITCH':
      iconType = 'twitch';
      socialLink = `https://twitch.tv/${profile.name.toLowerCase()}`;
      break;
    case 'VK':
      iconType = 'vk';
      socialLink = `https://vk.com/id${profile.serviceId}`;
      break;
    case 'GOOGLE':
      iconType = 'google';
      socialLink = `https://plus.google.com/${profile.serviceId}`;
      break;
  }

  return (
    <a href={socialLink} target="_blank">
      <SocialLink>
        <Icon type={iconType} />
      </SocialLink>
    </a>
  );
};

interface IProps {
  user: any;
  clipsCount: number;
}

export const PanelProfile: FC<IProps> = ({ user, clipsCount }) => (
  <Box>
    <Container>
      <UserData>
        <UserAvatar>
          <UserAvatarImg src={user.avatar} />
        </UserAvatar>
        <UserName>{user.name}</UserName>
      </UserData>
      <Menu>
        <MenuLeft>
          <MenuItem>
            <MenuItemTitle>Клипы</MenuItemTitle>
            <MenuItemCount>{shortNumbers(clipsCount)}</MenuItemCount>
          </MenuItem>
        </MenuLeft>
        <MenuRight>
          <SocialLinks>
            {user.profiles.map(profile => (
              <SocialLinkOne key={profile.id} profile={profile} />
            ))}
          </SocialLinks>
        </MenuRight>
      </Menu>
    </Container>
  </Box>
);

export default PanelProfile;
