import { Clips } from '../components/Clips/Clips';
import Layout from '../layouts/Main';
import { now } from '../utils/now';

const dayAgo = now('-1d').toISOString();
const weekAgo = now('-14d').toISOString();
const monthAgo = now('-30d').toISOString();

const TopPage = () => (
  <Layout streams>
    <Clips
      title="Топ за день"
      titleLink="/top/day"
      where={{ createdAt_gt: dayAgo, score_gt: 0 }}
      orderBy="score_DESC"
      rows={1}
    />
    <Clips
      title="Топ за неделю"
      titleLink="/top/week"
      where={{ createdAt_gt: weekAgo, score_gt: 0 }}
      orderBy="score_DESC"
      rows={1}
    />
    <Clips
      title="Топ за месяц"
      titleLink="/top/month"
      where={{ createdAt_gt: monthAgo, score_gt: 0 }}
      orderBy="score_DESC"
      rows={1}
    />
    <Clips
      title="Топ за все время"
      titleLink="/top/all"
      where={{ score_gt: 0 }}
      orderBy="score_DESC"
      rows={1}
    />
  </Layout>
);

export default TopPage;
