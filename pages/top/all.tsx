import { Clips } from '../../components/Clips/Clips';
import Layout from '../../layouts/Main';

const TopAllPage = () => (
  <Layout streams>
    <Clips
      title="Топ за все время"
      titleLink="/top/all"
      where={{ score_gt: 0 }}
      orderBy="score_DESC"
    />
  </Layout>
);

export default TopAllPage;
