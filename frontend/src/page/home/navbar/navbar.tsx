import "./navbar.css";

import {
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

const navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-logo-text">
        <span>TRIP PLANNER</span>
      </div>
      <div className="navbar-links">
        <div className="navbar-menu"><UserOutlined className="navbar-icon"/><MenuOutlined className="navbar-icon"/></div>
        <QuestionCircleOutlined className="navbar-icon"/>
      </div>
    </div>
  );
}

export default navbar;