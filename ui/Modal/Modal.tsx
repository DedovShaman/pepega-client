import nanoid from 'nanoid';
import { lighten, rgba } from 'polished';
import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { Portal } from '../Portal';

const BG = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  overflow: auto;
  z-index: 1000;
`;

const BGOut = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.dark1Color};
  opacity: 0.7;
  z-index: 3000;
`;

const BoxW = styled.div`
  z-index: 3500;
  margin: auto;
  padding: 60px 0;
  display: flex;
`;

const BoxNav = styled.div`
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 60px;
  justify-content: center;
  color: ${({ theme }) => theme.accent2Color && rgba(theme.accent2Color, 0.5)};

  i {
    font-size: 40px;
  }

  :hover {
    color: ${({ theme }) => theme.accent2Color};
  }
`;

const Box = styled('div')<{
  minimal: boolean;
}>`
  min-width: 240px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: auto;
  padding: ${({ minimal }) => (minimal ? '0' : '20px')};
  z-index: 3500;
  display: flex;
  position: relative;
`;

const ModalB = styled.div`
  background: ${({ theme }) =>
    theme.dark2Color && lighten(0.01, theme.dark2Color)};
  border-radius: 4px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  background: ${({ theme }) => theme.main1Color};
  border-radius: 4px 4px 0 0;
`;

const Title = styled.div`
  padding: 0 20px;
  font-size: 15px;
  color: ${({ theme }) => theme.text1Color};
`;

const Close = styled.div`
  background: none;
  border: none;
  margin-left: auto;
  padding: 0 20px;
  font-size: 22px;
  color: ${({ theme }) => theme.text1Color};
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.text1Color};
  }
`;

const CloseOut = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  background: none;
  border: none;
  margin-left: auto;
  width: 60px;
  justify-content: center;
  font-size: 34px;
  color: ${({ theme }) => theme.accent2Color && rgba(theme.accent2Color, 0.9)};
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.accent2Color};
  }
`;

const Content = styled('div')<{
  minimal: boolean;
}>`
  padding: ${({ minimal }) => (minimal ? '0' : '15px')};
  display: flex;
`;

export interface IModalProps {
  onOpen?: (modalId: string) => void;
  onClose: (modalId: string) => void;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  title?: string;
  visible: boolean;
  minimal?: boolean;
}

export const Modal: FC<IModalProps> = ({
  visible,
  children,
  title,
  onLeftClick,
  onRightClick,
  minimal,
  onOpen,
  onClose
}) => {
  const modalId = nanoid(4);

  useEffect(() => {
    if (visible) {
      onOpen(modalId);
    }
  }, [visible]);

  const close = () => onClose(modalId);

  if (!visible) {
    return null;
  }

  return (
    <Portal selector="root-modal">
      <BG>
        <BGOut onClick={close} />
        <BoxW>
          <Box minimal={minimal}>
            {minimal && (
              <BoxNav onClick={() => (onLeftClick ? onLeftClick() : close())}>
                {onLeftClick && <Icon type="chevron-left" />}
              </BoxNav>
            )}
            <ModalB>
              {!minimal && (
                <Header>
                  <Title>{title}</Title>
                  <Close onClick={close}>
                    <Icon type="close" />
                  </Close>
                </Header>
              )}
              <Content minimal={minimal}>{children}</Content>
            </ModalB>
            {minimal && (
              <CloseOut onClick={close}>
                <Icon type="close" />
              </CloseOut>
            )}
            {minimal && (
              <BoxNav onClick={() => (onRightClick ? onRightClick() : close())}>
                {onRightClick && <Icon type="chevron-right" />}
              </BoxNav>
            )}
          </Box>
        </BoxW>
      </BG>
    </Portal>
  );
};

Modal.defaultProps = {
  minimal: false,
  visible: false,
  title: '',
  onOpen: () => undefined,
  onClose: () => undefined
};
