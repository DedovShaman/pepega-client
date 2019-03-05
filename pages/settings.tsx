import * as Settings from '../components/Settings';
import { Permission } from '../helpers/Permission';
import Layout from '../layouts/Main';

const SettingsPage = () => (
  <Layout>
    <Settings.Box>
      <Permission>
        <Settings.Title>Настройки</Settings.Title>
        <Settings.Content />
      </Permission>
    </Settings.Box>
  </Layout>
);

export default SettingsPage;
