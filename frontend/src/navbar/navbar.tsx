import { Dropdown, Modal } from 'antd';
import {
  CloseOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';
import Authentication from '../component/authentication/authentication/authentication';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'login') {
      setOpen(true);
    } else if (key === 'setting') {
      setOpen(true);
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
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        closeIcon={<CloseOutlined />}
        className="custom-modal"
        styles={{
          body: {
            padding: 0,
            overflow: "hidden",
            background: "transparent", // สำคัญ: ลบพื้นหลังขาวใน body
          },
          content: {
            background: "transparent", // สำคัญ: ลบพื้นหลังขาวของ modal box
            boxShadow: "none",         // ลบเงารอบ modal
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // ความมืดของพื้นหลัง modal
          },
        }}
      >
        <Authentication />
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
