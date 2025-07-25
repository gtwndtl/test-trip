import { useEffect, useState } from 'react';
import { CloseOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Authentication from '../component/authentication/authentication/authentication';
import { GetUserById } from '../services/https';
import type { UserInterface } from '../interfaces/User';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userID = localStorage.getItem('id');
  const isLoggedIn = localStorage.getItem('isLogin') === 'true';

  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState<UserInterface | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID && isLoggedIn) {
        const user = await GetUserById(Number(userID));
        setUserData(user);
      }
    };
    fetchUserData();
  }, [userID, isLoggedIn]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Chat', path: '/chat' },
    { label: 'Summary', path: '/trip' },
  ];

  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'login' || key === 'setting') {
      setOpenModal(true);
    } else if (key === 'logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    navigate('/');
  };

  const dropdownItems = isLoggedIn
    ? [
      { label: 'Setting', key: 'setting' },
      { label: 'Logout', key: 'logout' },
    ]
    : [
      { label: 'Login', key: 'login' },
    ];

  return (
    <div className="navbar-container">
      <div className="navbar-title">Trip Planner</div>

      <div className="navbar-link">
        {navLinks.map(({ label, path }) => (
          <div
            key={label}
            className={location.pathname === path ? 'active' : ''}
            onClick={() => navigate(path)}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="navbar-menu">
        <div className="navbar-user">
          {isLoggedIn
            ? userData
              ? `${userData.Firstname} ${userData.Lastname}`
              : 'Loading...'
            : 'Guest'}
        </div>
        <Dropdown
          menu={{ items: dropdownItems, onClick: handleDropdownClick }}
          trigger={['click']}
        >
          <div className="navbar-dropdown">
            <UserOutlined className="navbar-icon" />
            <DownOutlined className="navbar-icon" />
          </div>
        </Dropdown>
      </div>

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={800}
        closeIcon={<CloseOutlined />}
        className="custom-modal"
        styles={{
          body: {
            padding: 0,
            overflow: 'hidden',
            background: 'transparent',
          },
          content: {
            background: 'transparent',
            boxShadow: 'none',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <Authentication />
      </Modal>
    </div>
  );
};

export default Navbar;
