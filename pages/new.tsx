import { Clips } from '../components/Clips/Clips';
import Streams from '../components/Streams/Grid';
import Layout from '../layouts/Main';

const NewPage = () => (
  <Layout>
    <Streams />
    <Clips title="Новое" titleLink="/new" />
  </Layout>
);

export default NewPage;
