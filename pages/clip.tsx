import * as React from 'react';
import { ClipView } from '../components/Clips/ClipView';
import RightPanel from '../components/Nav/Right';
import Streams from '../components/Streams/Column';
import useRouter from '../hooks/useRouter';
import Layout from '../layouts/Main';
import ClipProvider from '../providers/Clip';
import styled from '../theme';

const Box = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 20px 0;
`;

const PostBox = styled.div`
  margin: 0 20px;
  width: 800px;
  border-radius: 5px;
  overflow: hidden;
`;

const PostPage = () => {
  const router = useRouter();
  const clipId = router.query.id;

  if (typeof clipId !== 'string') {
    return null;
  }

  return (
    <Layout>
      <Box>
        <PostBox>
          <ClipProvider where={{ id: clipId }}>
            {({ clip }) => <ClipView {...clip} meta />}
          </ClipProvider>
        </PostBox>
        <RightPanel.Box>
          <RightPanel.Block>
            <Streams />
          </RightPanel.Block>
        </RightPanel.Box>
      </Box>
    </Layout>
  );
};

export default PostPage;
