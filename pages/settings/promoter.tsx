import * as Settings from '../../components/Settings';
import { ChannelPromotersManage } from '../../components/Settings/ChannelPromoters';
import { Permission } from '../../helpers/Permission';
import Layout from '../../layouts/Main';

const SettingsAdStreamsPage = () => (
  <Layout>
    <Settings.Box>
      <Permission>
        <Settings.Title>Продвижение</Settings.Title>
        <Settings.Content>
          <ChannelPromotersManage />
        </Settings.Content>
      </Permission>
    </Settings.Box>
  </Layout>
);

export default SettingsAdStreamsPage;
