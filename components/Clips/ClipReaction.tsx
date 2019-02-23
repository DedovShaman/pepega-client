import gql from 'graphql-tag';
import Router from 'next/router';
import { lighten } from 'polished';
import { FC } from 'react';
import { Mutation } from 'react-apollo';
import posed from 'react-pose';
import styled from 'styled-components';
import { Permission } from '../../helpers/Permission';
import { Icon } from '../../ui/Icon';

const SET_CLIP_REACTION = gql`
  mutation setClipReaction($clipId: ID!, $reactionType: ReactionType!) {
    setClipReaction(clipId: $clipId, reactionType: $reactionType) {
      id
    }
  }
`;

const Box = styled.div`
  height: 100%;
  padding: 0 16px;
  align-items: center;
  font-size: 14px;
  display: flex;
`;

interface ILikeButton {
  active: boolean;
}

const LikeButtonAnim = posed.div({
  pressable: true,
  init: { scale: 1 },
  press: { scale: 1.5 },
  pressEnd: { scale: 1 }
});

const LikeButton = styled(LikeButtonAnim)<ILikeButton>`
  display: flex;
  justify-content: center;
  padding: 5px;
  cursor: pointer;

  i {
    font-size: 21px;
    color: ${({ theme, active }) =>
      active ? lighten(0.15, theme.main1Color) : theme.accent2Color};
  }
`;

const LikesCount = styled('div')<ILikeButton>`
  color: ${({ theme, active }) =>
    active ? lighten(0.15, theme.main1Color) : theme.accent2Color};
  margin-left: 10px;
  font-weight: 500;
  user-select: none;
`;

interface IProps {
  id: string;
  icon: string;
  type: string;
  state: boolean;
  count: number;
}

export const ClipReaction: FC<IProps> = ({ id, type, icon, state, count }) => (
  <Permission name="SET_CLIP_REACTION">
    {({ deny }) => {
      if (deny) {
        return (
          <Box
            onClick={() =>
              Router.push(
                {
                  pathname: Router.route,
                  query: {
                    ...Router.query,
                    authModal: 1
                  }
                },
                `/auth?continue=${Router.asPath}`,
                { shallow: true }
              )
            }
          >
            <LikeButton active={state}>
              <Icon type={icon} />
            </LikeButton>
            {count > 0 && <LikesCount active={state}>{count}</LikesCount>}
          </Box>
        );
      }

      return (
        <Mutation mutation={SET_CLIP_REACTION}>
          {setPostReaction => (
            <Box>
              <LikeButton
                active={state}
                onClick={() =>
                  setPostReaction({
                    variables: {
                      clipId: id,
                      reactionType: state ? 'NONE' : type
                    }
                  })
                }
              >
                <Icon type={icon} />
              </LikeButton>
              {count > 0 && <LikesCount active={state}>{count}</LikesCount>}
            </Box>
          )}
        </Mutation>
      );
    }}
  </Permission>
);
