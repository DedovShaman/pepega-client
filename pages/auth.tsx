import { lighten } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import Auth from '../components/Auth';
import Layout from '../layouts/Main';

const Box = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 40px 0;
  margin: 5px;
`;

const Container = styled.div`
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 640px;
  background: ${({ theme }) =>
    theme.dark2Color && lighten(0.01, theme.dark2Color)};
`;

const Title = styled.div`
  padding: 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  height: 50px;
  background: ${({ theme }) => theme.main1Color};
`;

const AuthBox = styled.div``;

const AuthPage: FC = () => (
  <Layout>
    <Box>
      <Container>
        <Title>Авторизация</Title>
        <AuthBox>
          <Auth />
        </AuthBox>
      </Container>
    </Box>
  </Layout>
);

export default AuthPage;
