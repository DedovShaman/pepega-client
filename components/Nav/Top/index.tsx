import { darken, lighten } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import { Icon } from '../../../ui/Icon';

const Box = styled.div`
  height: 50px;
  display: none;
  z-index: 100;
  padding: 0 10px;
  background: ${({ theme }) => darken(0.1, theme.main1Color)};

  @media (max-width: 700px) {
    display: flex;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
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

interface IProps {
  leftMenuTrigger: () => void;
}

const TopNav: FC<IProps> = ({ leftMenuTrigger }) => (
  <Box>
    <Left>
      <MenuButton onClick={() => leftMenuTrigger()}>
        <Icon type="menu" />
      </MenuButton>
    </Left>
  </Box>
);

export default TopNav;
