import * as Settings from '../../components/Settings';
import { Permission } from '../../helpers/Permission';
import Layout from '../../layouts/Main';
import { SWRow } from '../../ui/SWRow';

const SettingsAppearancePage = () => (
  <Layout>
    <Settings.Box>
      <Permission name="USER_SETTINGS_APPEARANCE">
        <Settings.Title>Внешний вид</Settings.Title>
        <Settings.Content>
          <SWRow
            title="Размытый фон"
            description="Размывать фон у модальных окон"
            onChange={() => console.log('')}
            active
          />
        </Settings.Content>
      </Permission>
    </Settings.Box>
  </Layout>
);

export default SettingsAppearancePage;
