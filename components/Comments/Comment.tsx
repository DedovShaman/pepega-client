import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import gql from 'graphql-tag';
import { darken, lighten } from 'polished';
import { FC } from 'react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import { Permission } from '../../helpers/Permission';
import { WithEmoji } from '../../helpers/WithEmoji';
import { Dropdown } from '../../ui/Dropdown';
import { Icon } from '../../ui/Icon';
import { CommentUserMenu } from './CommentUserMenu';

const GET_USER = gql`
  query getUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      avatar
    }
  }
`;

const DELETE_MESSAGE = gql`
  mutation deleteComment($where: CommentWhereUniqueInput!) {
    deleteComment(where: $where) {
      id
    }
  }
`;

const Message = styled.div`
  font-size: 13px;
  position: relative;
  overflow: hidden;

  :first-child {
    padding-top: 8px;
  }

  :last-child {
    padding-bottom: 8px;
  }
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 34px;
  border-radius: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 20;
  padding-top: 16px;
`;

const AvatarImg = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: ${props => props.theme.dark2Color};
`;

const AvatarNone = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: ${props => props.theme.accent2Color};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  padding-top: 10px;
`;

const Username = styled('div')<{ userColor?: string }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props =>
    props.userColor
      ? props.userColor
      : lighten('0.15', props.theme.accent2Color)};
`;

const Date = styled.div`
  color: ${props => darken(0.15, props.theme.accent2Color)};
  font-size: 11px;
  padding: 0 8px;
`;

const Content = styled.div`
  position: relative;
`;

const Text = styled.div`
  color: ${props => props.theme.accent2Color};
  padding: 4px 10px 4px 60px;
  overflow: hidden;
  overflow-wrap: break-word;
`;

const ManageMenu = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  height: 22px;
  padding: 0 10px;
  margin-right: 4px;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  ${Content}:hover & {
    display: flex;
  }
`;

const ManageItem = styled.div`
  padding: 0 3px;
  color: ${props => props.theme.accent2Color};

  i {
    font-size: 17px;
    color: ${props => props.theme.accent2Color};
  }

  :hover {
    color: #fff;

    i {
      color: #fff;
    }
  }
`;

interface IProps {
  id: string;
  content: string;
  createdAt: string;
  compact: boolean;
  author: any;
}

export const Comment: FC<IProps> = ({
  id,
  compact,
  content,
  createdAt,
  author
}) => (
  <Query query={GET_USER} variables={{ where: { id: author.id } }}>
    {({ loading, error, data }) => {
      if (loading) {
        return null;
      }

      if (error || !data.user) {
        return null;
      }

      const user = data.user;

      const usernameColors = {
        admin: 'rgb(194, 121, 121)',
        mod: 'rgb(124, 194, 121)'
      };

      const userColor = usernameColors[user.role]
        ? usernameColors[user.role]
        : undefined;

      const date =
        createdAt &&
        distanceInWordsToNow(createdAt, {
          locale: ruLocale
        }) + ' назад';

      return (
        <Message>
          {!compact && (
            <Header>
              <Dropdown overlay={<CommentUserMenu id={user.id} />}>
                <Avatar>
                  {user.avatar ? (
                    <AvatarImg src={user.avatar} />
                  ) : (
                    <AvatarNone />
                  )}
                </Avatar>
              </Dropdown>
              <Username userColor={userColor}>{user.name}</Username>
              <Date>{date}</Date>
            </Header>
          )}
          <Content>
            <Text>
              <WithEmoji>{content}</WithEmoji>
            </Text>
            <ManageMenu>
              <Permission name="DELETE_COMMENT" contextId={id}>
                <Mutation mutation={DELETE_MESSAGE}>
                  {deleteComment => (
                    <ManageItem
                      onClick={() =>
                        deleteComment({
                          variables: {
                            where: { id }
                          }
                        })
                      }
                    >
                      <Icon type="close" />
                    </ManageItem>
                  )}
                </Mutation>
              </Permission>
            </ManageMenu>
          </Content>
        </Message>
      );
    }}
  </Query>
);
