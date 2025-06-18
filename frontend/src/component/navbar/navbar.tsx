import { Menu, Dropdown } from 'antd';
import {
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'login') {
          navigate('/login');
        } else if (key === 'setting') {
          navigate('/setting'); // ถ้ามีหน้า setting
        }
      }}
      items={[
        { label: 'Login', key: 'login' },
        { label: 'Setting', key: 'setting' },
      ]}
    />
  );

  return (
    <div className="navbar">
      <div
        className="navbar-logo-text"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span>TRIP PLANNER</span>
      </div>

      <div className="navbar-links">
        <Dropdown overlay={menu} trigger={['click']}>
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
