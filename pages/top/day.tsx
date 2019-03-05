import { Clips } from '../../components/Clips/Clips';
import Layout from '../../layouts/Main';
import { now } from '../../utils/now';

const dayAgo = now('-1d').toISOString();

const TopDayPage = () => (
  <Layout streams>
    <Clips
      title="Топ за день"
      titleLink="/top/day"
      where={{ createdAt_gt: dayAgo, score_gt: 0 }}
      orderBy="score_DESC"
    />
  </Layout>
);

export default TopDayPage;
