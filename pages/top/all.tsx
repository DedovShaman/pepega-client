import { Clips } from '../../components/Clips/Clips';
import Streams from '../../components/Streams';
import Layout from '../../layouts/Main';

const TopAllPage = () => (
  <Layout>
    <Streams />
    <Clips
      title="Топ за все время"
      titleLink="/top/all"
      where={{ score_gt: 0 }}
      orderBy="score_DESC"
    />
  </Layout>
);

export default TopAllPage;
