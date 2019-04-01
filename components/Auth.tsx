import { darken, lighten, rgba } from 'polished';
import { FC } from 'react';
import styled from 'styled-components';
import config from '../config';
import { Icon } from '../ui/Icon';

const AuthBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

const SocialForm = styled.div`
  display: flex;
  min-width: 400px;
  width: 100%;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const LoginButton = styled('a')<{
  cColor: string;
}>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 44px;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  border: 2px solid;
  color: ${props => darken(0.1, props.theme.text1Color)};
  background: ${props => rgba(props.cColor, 0.1)};
  border-color: ${props => props.cColor};

  :hover {
    color: ${props => props.theme.text1Color};
    border-color: ${props => lighten(0.2, props.cColor)};
    background: ${props => rgba(props.cColor, 0.2)};
  }

  i {
    margin-bottom: 2px;
    font-size: 18px;
  }
`;

const Auth: FC = () => (
  <AuthBox>
    <SocialForm>
      <LoginButton cColor={'#507299'} href={`${config.apiUrl}auth/vkontakte`}>
        <Icon type="vk" />
      </LoginButton>
      <LoginButton cColor={'#DB4437'} href={`${config.apiUrl}auth/google`}>
        <Icon type="google" />
      </LoginButton>
      <LoginButton cColor={'#6542a6'} href={`${config.apiUrl}auth/twitch`}>
        <Icon type="twitch" />
      </LoginButton>
    </SocialForm>
  </AuthBox>
);

export default Auth;
