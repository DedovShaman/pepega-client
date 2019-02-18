import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ruLocale from 'date-fns/locale/ru';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { Avatar } from '../../ui/Avatar';

const GET_USER = gql`
  query getUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      avatar
      banned
      wallets(orderBy: currency_ASC) {
        id
      }
    }
  }
`;

const AuthorBox = styled.div`
  display: flex;
  margin-left: auto;
  padding: 0 20px;
  height: 100%;
`;

const AuthorData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 550px) {
    display: none;
  }
`;

const AuthorName = styled.div`
  display: flex;
  font-size: 12px;
  justify-content: flex-end;
  cursor: pointer;
`;

const DateBox = styled.div`
  display: flex;
  font-size: 11px;
  color: ${({ theme }) => theme.accent2Color};
  justify-content: flex-end;
`;

const AuthorAvatarBox = styled.div`
  margin-left: 10px;
  justify-content: center;
  display: flex;
  align-items: center;
`;

interface IProps {
  createdAt: string;
  authorId: string;
  metaDescription?: boolean;
}

export const ClipAuthor: FC<IProps> = ({
  createdAt,
  authorId,
  metaDescription
}) => (
  <Query query={GET_USER} variables={{ where: { id: authorId } }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div />;
      }

      if (error || !data.user) {
        return null;
      }

      return (
        <AuthorBox>
          {metaDescription && (
            <Head>
              <meta property="og:description" content={data.user.name} />
            </Head>
          )}
          <AuthorData>
            <Link href={`user?id=${authorId}`}>
              <AuthorName>{data.user.name}</AuthorName>
            </Link>
            <DateBox>
              {distanceInWordsToNow(createdAt, {
                locale: ruLocale
              })}
              {' назад'}
            </DateBox>
          </AuthorData>
          <AuthorAvatarBox>
            <Link href={`user?id=${authorId}`}>
              <Avatar avatar={data.user.avatar} />
            </Link>
          </AuthorAvatarBox>
        </AuthorBox>
      );
    }}
  </Query>
);
