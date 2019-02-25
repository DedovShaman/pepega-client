import Link from 'next/link';
import { darken } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';

const UserMenu = styled.div`
  background: ${({ theme }) => theme.dark1Color};
  border-radius: 3px;
  overflow: hidden;
  margin: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const UserMenuItem = styled.div`
  font-size: 13px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  :hover {
    background: ${({ theme }) => darken(0.05, theme.dark1Color)};
  }
`;

interface IProps {
  id: string;
}

export const CommentUserMenu: FC<IProps> = ({ id }) => (
  <UserMenu>
    <Link href={`user?id=${id}`}>
      <UserMenuItem>Профиль</UserMenuItem>
    </Link>
  </UserMenu>
);
