import React from 'react';
import { CompassOutlined } from '@ant-design/icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <CompassOutlined className="footer-icon" />
          <div>
            <h4 className="footer-brand">TRIP PLANNER</h4>
            <p className="footer-description">
              Turn your next trip into a hassle-free experience with Trip Planner.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Terms and Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5>Support</h5>
            <ul>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h5>Itineraries</h5>
            <ul>
              <li><a href="#">Community Trips</a></li>
              <li><a href="#">Find Destinations</a></li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TRIP PLANNER. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
