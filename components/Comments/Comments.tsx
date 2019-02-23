import { FC } from 'react';
import styled from 'styled-components';
import CommentsProvider from '../../providers/Comments';
import Comment from './Comment';
import NewComment from './NewComment';

const compactMessages = messages => {
  const compactInterval = 90e3; // 1,5 min

  return messages.map((message, index, array) => {
    let compact = false;

    if (index > 0) {
      const diff =
        new Date(message.createdAt).getTime() -
        new Date(array[index - 1].createdAt).getTime();

      if (
        diff < compactInterval &&
        message.author.id === array[index - 1].author.id
      ) {
        compact = true;
      }
    }

    return {
      ...message,
      compact
    };
  });
};

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const CommentsBox = styled.div`
  display: flex;
  flex-direction: column;
`;

interface IProps {
  clipId: string;
}

const Comments: FC<IProps> = ({ clipId }) => (
  <Box>
    <CommentsBox>
      <CommentsProvider where={{ clip: { id: clipId } }}>
        {({ comments }) => (
          <>
            {compactMessages(comments).map(comment => (
              <Comment key={comment.id} {...comment} />
            ))}
          </>
        )}
      </CommentsProvider>
    </CommentsBox>
    <NewComment clipId={clipId} />
  </Box>
);

export default Comments;
