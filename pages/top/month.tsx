import { Clips } from '../../components/Clips/Clips';
import Layout from '../../layouts/Main';
import { now } from '../../utils/now';

const monthAgo = now('-30d').toISOString();

const TopMonthPage = () => (
  <Layout streams>
    <Clips
      title="Топ за месяц"
      titleLink="/top/month"
      where={{ createdAt_gt: monthAgo, score_gt: 0 }}
      orderBy="score_DESC"
    />
  </Layout>
);

export default TopMonthPage;
