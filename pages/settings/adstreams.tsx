import * as Settings from '../../components/Settings';
import Streams from '../../components/Settings/Streams';
import { Permission } from '../../helpers/Permission';
import Layout from '../../layouts/Main';

const SettingsAdStreamsPage = () => (
  <Layout>
    <Settings.Box>
      <Permission>
        <Settings.Title>Продвижение</Settings.Title>
        <Settings.Content>
          <Streams />
        </Settings.Content>
      </Permission>
    </Settings.Box>
  </Layout>
);

export default SettingsAdStreamsPage;
