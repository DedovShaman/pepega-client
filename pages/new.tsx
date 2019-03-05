import { Clips } from '../components/Clips/Clips';
import Layout from '../layouts/Main';

const NewPage = () => (
  <Layout streams>
    <Clips title="Новое" titleLink="/new" />
  </Layout>
);

export default NewPage;
