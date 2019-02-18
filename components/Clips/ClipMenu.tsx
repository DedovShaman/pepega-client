import gql from 'graphql-tag';
import { darken } from 'polished';
import { FC } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { Permission } from '../../helpers/Permission';
import { ButtonFlat } from '../../ui/Button';
import { Dropdown } from '../../ui/Dropdown';
import { Icon } from '../../ui/Icon';

const REMOVE_CLIP = gql`
  mutation($id: ID!) {
    deleteClip(id: $id)
  }
`;

const Box = styled.div`
  height: 100%;
  align-items: center;
  display: flex;
  width: 40px;
  justify-content: center;
`;

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
  authorId: string;
}

export const ClipMenu: FC<IProps> = ({ id }) => (
  <Permission name="CLIP_MANAGE">
    <Box>
      <Dropdown
        overlay={
          <UserMenu>
            <Permission name="DELETE_POST" contextId={id}>
              <Mutation mutation={REMOVE_CLIP}>
                {deleteClip => (
                  <UserMenuItem
                    onClick={() => deleteClip({ variables: { id } })}
                  >
                    Удалить
                  </UserMenuItem>
                )}
              </Mutation>
            </Permission>
          </UserMenu>
        }
      >
        <ButtonFlat>
          <Icon type="more-vert" />
        </ButtonFlat>
      </Dropdown>
    </Box>
  </Permission>
);
