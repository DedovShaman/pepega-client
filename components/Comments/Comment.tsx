import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import gql from 'graphql-tag';
import Link from 'next/link';
import { darken, lighten } from 'polished';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import { Permission } from '../../helpers/Permission';
import { Dropdown } from '../../ui/Dropdown';
import { Emoji } from '../../ui/Emoji';
import { splitTextToEmojiArray } from '../../utils/emoji';

const GET_USER = gql`
  query getUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      avatar
    }
  }
`;

const SET_USER_BAN = gql`
  mutation setUserBan($id: ID!) {
    setUserBan(id: $id)
  }
`;

const UNSET_USER_BAN = gql`
  mutation unsetUserBan($id: ID!) {
    unsetUserBan(id: $id)
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
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.userColor
      ? props.userColor
      : lighten('0.15', props.theme.accent2Color)};
`;

const Date = styled.div`
  color: ${props => darken(0.15, props.theme.accent2Color)};
  font-size: 11.5px;
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
  content: string;
  createdAt: string;
  compact: boolean;
  author: any;
}

export default class extends React.Component<IProps, {}> {
  public renderContent = () => {
    const { content } = this.props;
    return splitTextToEmojiArray(content).map((elm, index) => {
      if (elm.type === 'text') {
        return <React.Fragment key={index}>{elm.value}</React.Fragment>;
      }

      if (elm.type === 'emoji') {
        return <Emoji key={index} name={elm.name} />;
      }
    });
  };

  public renderUserMenu(user) {
    return (
      <UserMenu>
        <Link href={`user?id=${user.id}`}>
          <UserMenuItem>Профиль</UserMenuItem>
        </Link>

        {/* <Permission name="SET_USER_BAN" contextId={user.id}>
          <Mutation mutation={SET_USER_BAN}>
            {setUserBan => (
              <UserMenuItem
                onClick={() =>
                  setUserBan({
                    variables: {
                      id: user.id
                    }
                  })
                }
              >
                Забанить
              </UserMenuItem>
            )}
          </Mutation>
        </Permission>

        <Permission name="UNSET_USER_BAN" contextId={user.id}>
          <Mutation mutation={UNSET_USER_BAN}>
            {unsetUserBan => (
              <UserMenuItem
                onClick={() =>
                  unsetUserBan({
                    variables: {
                      id: user.id
                    }
                  })
                }
              >
                Разабанить
              </UserMenuItem>
            )}
          </Mutation>
        </Permission> */}
      </UserMenu>
    );
  }

  public renderMessage(user) {
    const { compact } = this.props;

    const usernameColors = {
      admin: 'rgb(194, 121, 121)',
      mod: 'rgb(124, 194, 121)'
    };

    const userColor = usernameColors[user.role]
      ? usernameColors[user.role]
      : undefined;

    console.log(compact);

    const date =
      this.props.createdAt &&
      distanceInWordsToNow(this.props.createdAt, {
        locale: ruLocale
      }) + ' назад';

    return (
      <Message>
        {!compact && (
          <Header>
            <Dropdown overlay={this.renderUserMenu(user)}>
              <Avatar>
                {user.avatar ? <AvatarImg src={user.avatar} /> : <AvatarNone />}
              </Avatar>
            </Dropdown>
            <Username userColor={userColor}>{user.name}</Username>
            <Date>{date}</Date>
          </Header>
        )}
        <Content>
          <Text>{this.renderContent()}</Text>
          <ManageMenu>
            <Permission name="DELETE_COMMENT" contextId={this.props.id}>
              <Mutation mutation={DELETE_MESSAGE}>
                {deleteComment => (
                  <ManageItem
                    onClick={() =>
                      deleteComment({
                        variables: {
                          where: { id: this.props.id }
                        }
                      })
                    }
                  >
                    <i className="zmdi zmdi-close" />
                  </ManageItem>
                )}
              </Mutation>
            </Permission>
          </ManageMenu>
        </Content>
      </Message>
    );
  }

  public render() {
    const { author } = this.props;

    return (
      <Query query={GET_USER} variables={{ where: { id: author.id } }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div />;
          }

          if (error || !data.user) {
            return null;
          }

          return this.renderMessage(data.user);
        }}
      </Query>
    );
  }
}
