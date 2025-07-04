import { Dropdown, Modal } from 'antd';
import {
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';
import LoginPage from '../authentication/login/login';

const Navbar = () => {
  const navigate = useNavigate();
  const [modal2Open, setModal2Open] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'login') {
      setModal2Open(true);
    } else if (key === 'setting') {
      navigate('/');
    }
  };

  const menuItems = [
    { label: 'Login', key: 'login' },
    { label: 'Setting', key: 'setting' },
  ];

  return (
    <div className="navbar">
      <div
        className="navbar-logo-text"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span>TRIP PLANNER</span>
      </div>

      <Modal
        centered
        open={modal2Open}
        footer={null}
        onCancel={() => setModal2Open(false)}
      >
        <LoginPage />
      </Modal>



      <div className="navbar-links">
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          trigger={['click']}
        >
          <div className="navbar-menu" style={{ cursor: 'pointer' }}>
            <UserOutlined className="navbar-icon" />
            <MenuOutlined className="navbar-icon" />
          </div>
        </Dropdown>
        <QuestionCircleOutlined className="navbar-icon" />
      </div>
    </div>
  );
};

export default Navbar;
