import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams/Grid';
import Layout from '../layouts/Main';

const HotPage = () => (
  <Layout>
    <Streams />
    <Clips title="В тренде" />
  </Layout>
);

export default HotPage;
