import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams/Grid';
import Layout from '../layouts/Main';

const IndexPage = () => (
  <Layout>
    {/* {/* <Streams /> */}
    <Clips
      title="Топ за день"
      titleLink="/top/day"
      orderBy="score_DESC"
      rows={2}
    />
    {/* <Clips
      title="В тренде"
      titleLink="/hot"
      orderBy="createdAt_DESC"
      rows={1}
    /> */}
    <Clips title="Новое" titleLink="/new" orderBy="createdAt_DESC" />
  </Layout>
);

export default IndexPage;
