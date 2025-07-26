import { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Account from '../../component/settings/account/account';
import Profile from '../../component/settings/profile/profile';
import Navbar from '../../navbar/navbar';
import './settingpage.css';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'grp',
    label: 'Settings',
    type: 'group',
    children: [
      { key: '/settings/profile', label: 'Profile' },
      { key: '/settings/account', label: 'Account' },
      { key: '/settings/privacy', label: 'Privacy' },
      { key: '/settings/security', label: 'Security' },
      { key: '/settings/language', label: 'Language' },
    ],
  },
];

const SettingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // เมื่อเข้ามาครั้งแรก ถ้า path คือ /settings ให้ redirect ไปหน้า default
  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/profile');
    }
  }, [location.pathname, navigate]);

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key); // key = path เช่น "/settings/account"
  };

  return (
    <div className="setting-container">
      <Navbar />
      <div className="setting-wrapper">
        <div className="setting-box">
          <div className="setting-menu">
            <Menu
              onClick={onClick}
              selectedKeys={[location.pathname]}
              mode="inline"
              items={items}
              style={{
                borderInlineEnd: 'none',
                background: 'transparent',
              }}
            />
          </div>
          <div className="setting-content">
            <Routes>
              <Route path="profile" element={<Profile />} />
              <Route path="account" element={<Account />} />
              <Route path="privacy" element={<div>Privacy Settings Coming Soon</div>} />
              <Route path="security" element={<div>Security Settings Coming Soon</div>} />
              <Route path="language" element={<div>Language Settings Coming Soon</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
