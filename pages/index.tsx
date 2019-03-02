import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams';
import Layout from '../layouts/Main';
import { now } from '../utils/now';

const dayAgo = now('-1d').toISOString();

const IndexPage = () => (
  <Layout>
    <Streams />
    <Clips
      title="Топ за день"
      titleLink="/top/day"
      where={{ createdAt_gt: dayAgo, score_gt: 0 }}
      orderBy="score_DESC"
      rows={2}
    />
    <Clips title="Новое" titleLink="/new" orderBy="createdAt_DESC" />
  </Layout>
);

export default IndexPage;
