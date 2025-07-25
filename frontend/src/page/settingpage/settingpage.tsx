import { useEffect, useState } from 'react';
import Navbar from '../../navbar/navbar';
import { GetUserById } from '../../services/https';
import './settingpage.css';
import type { UserInterface } from '../../interfaces/User';
import { Col, Form, Input, Row } from 'antd';

const SettingPage = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const id = localStorage.getItem('id');
    const loginState = localStorage.getItem('isLogin') === 'true';
    setUserID(id);
    setIsLoggedIn(loginState);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID && isLoggedIn) {
        try {
          const user = await GetUserById(Number(userID));
          setUserData(user);
          form.setFieldsValue({
            firstname: user.Firstname,
            lastname: user.Lastname,
            email: user.Email,
            birthday: user.Birthday,
            age: user.Age,
          });
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUserData();
  }, [userID, isLoggedIn, form]);

  return (
    <div className="setting-container">
      <Navbar />
      <div className="setting-content">
        <div className="setting-section">
          <h1>Account Settings</h1>
          <p>Edit your name, email, and more.</p>
          <div className="setting-account-section">
            <Form form={form} layout="vertical">
              <Form.Item label="First Name" name="firstname">
                <Input />
              </Form.Item>
              <Form.Item label="Last Name" name="lastname">
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
              <Form.Item label="Birthday" name="birthday">
                <Input />
              </Form.Item>
              <Form.Item label="Age" name="age">
                <Input />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
