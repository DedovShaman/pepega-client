import { Clips } from '../../components/Clips/Clips';
import Layout from '../../layouts/Main';
import { now } from '../../utils/now';

const weekAgo = now('-14d').toISOString();

const TopWeekPage = () => (
  <Layout streams>
    <Clips
      title="Топ за неделю"
      titleLink="/top/week"
      where={{ createdAt_gt: weekAgo, score_gt: 0 }}
      orderBy="score_DESC"
    />
  </Layout>
);

export default TopWeekPage;
