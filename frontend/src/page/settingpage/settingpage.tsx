import { useState } from 'react';
import Account from '../../component/settings/account/account';
import Profile from '../../component/settings/profile/profile';
import Navbar from '../../navbar/navbar';
import './settingpage.css';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'grp',
    label: 'Settings',
    type: 'group',
    children: [
      { key: '1', label: 'Profile' },
      { key: '2', label: 'Account' },
      { key: '3', label: 'Privacy' },
      { key: '4', label: 'Security' },
      { key: '5', label: 'Language' },
    ],
  },
];

const SettingPage = () => {
  const [selectedKey, setSelectedKey] = useState<string>('1');

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Profile />;
      case '2':
        return <Account />;
      case '3':
        return <div>Privacy Settings Coming Soon</div>;
      case '4':
        return <div>Security Settings Coming Soon</div>;
      case '5':
        return <div>Language Settings Coming Soon</div>;
      default:
        return <div>Select a setting from the menu</div>;
    }
  };

  return (
    <div className="setting-container">
      <Navbar />
      <div className="setting-wrapper">
        <div className="setting-box">
          <div className="setting-menu">
            <Menu
              onClick={onClick}
              selectedKeys={[selectedKey]}
              mode="inline"
              items={items}
              style={{
                borderInlineEnd: 'none',
                background: 'transparent',
              }}
            />
          </div>
          <div className="setting-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
