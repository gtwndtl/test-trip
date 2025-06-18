import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} ProjectAgain. All rights reserved.
        </p>
        <p className="footer-subtext">
          Developed by the ProjectAgain team.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
