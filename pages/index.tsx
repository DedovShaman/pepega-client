import { Clips } from '../components/Clips/Clips';
import Layout from '../layouts/Main';

const IndexPage = () => (
  <Layout streams>
    <Clips
      title="Топ за день"
      titleLink="/top/day"
      where={{
        createdAt: {
          ago: '1d'
        },
        score: {
          greaterThenEqual: 0
        }
      }}
      orderBy={[{ field: 'score', type: 'DESC' }]}
      rows={2}
    />
    <Clips title="Новое" titleLink="/new" />
  </Layout>
);

export default IndexPage;
