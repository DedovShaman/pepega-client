import * as Settings from '../../components/Settings';
import Integration from '../../components/Settings/Integration';
import { Permission } from '../../helpers/Permission';
import Layout from '../../layouts/Main';

const SettingsIntegrationsPage = () => (
  <Layout>
    <Settings.Box>
      <Permission>
        <Settings.Title>Интеграции</Settings.Title>
        <Settings.Content>
          <Integration />
        </Settings.Content>
      </Permission>
    </Settings.Box>
  </Layout>
);

export default SettingsIntegrationsPage;
