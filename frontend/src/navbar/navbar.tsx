import { useEffect, useState, useCallback } from 'react';
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

  const [userID, setUserID] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Load login state and user ID
  useEffect(() => {
    const id = localStorage.getItem('id');
    const loginState = localStorage.getItem('isLogin') === 'true';
    setUserID(id);
    setIsLoggedIn(loginState);  
  }, []);

  // Fetch user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (userID && isLoggedIn) {
        try {
          const user = await GetUserById(Number(userID));
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUserData();
  }, [userID, isLoggedIn]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUserID(null);
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  }, [navigate]);

  const handleDropdownClick = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case 'login':
          setOpenModal(true);
          break;
        case 'setting':
          navigate('/settings');
          break;
        case 'logout':
          handleLogout();
          break;
        default:
          break;
      }
    },
    [navigate, handleLogout]
  );

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'CHAT', path: '/chat' },
    { label: 'SUMMARY', path: '/trip' },
  ];

  const dropdownItems = isLoggedIn
    ? [
        { label: 'Setting', key: 'setting' },
        { label: 'Logout', key: 'logout' },
      ]
    : [{ label: 'Login', key: 'login' }];

  const renderUserGreeting = () => {
    if (!isLoggedIn) return 'Welcome, Guest';
    if (isLoggedIn && !userData) return 'Loading profile...';
    return `Welcome, ${userData?.Firstname}`;
  };

  return (
    <div className="navbar-container">
      <div className="navbar-title"><h1>TRIP PLANNER</h1></div>
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
        <div className="navbar-user">{renderUserGreeting()}</div>

        <Dropdown
          menu={{ items: dropdownItems, onClick: handleDropdownClick }}
          trigger={['click']}
        >
          <div className="navbar-dropdown">
            <UserOutlined className="navbar-profile-icon" />
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
