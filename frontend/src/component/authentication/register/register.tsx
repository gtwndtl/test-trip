// RegisterPage.tsx
import { motion } from 'framer-motion';
import './register.css';
import { Button, Form, Input, message } from 'antd';
import { CreateUser } from '../../../services/https';
import type { UserInterface } from '../../../interfaces/User';
// import { GoogleOAuthProvide } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// const CLIENT_ID = "427408818914-2fs6vg5tselbmp2l5b4jk0ojl6p5ud39.apps.googleusercontent.com"

const RegisterPage = ({ onSwitch }: { onSwitch: () => void }) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const newUser: UserInterface = {
                Email: values.email,
                Password: values.password,
            };
            await CreateUser(newUser);
            message.success('สมัครสมาชิกสำเร็จ!');
            form.resetFields();
            onSwitch(); // ไปหน้า login
        } catch (error) {
            message.error('ไม่สามารถสมัครสมาชิกได้');
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="register-page">
            <motion.div
                className="register-left"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <div className="register-right">
                <div className="register-form-container">
                    <div className="register-header">
                        <span className="register-title">TRIP PLANNER</span>
                    </div>
                    <div className="signin-switch">
                        <p className="signin-text">Already have an account?</p>
                        <a className="signin-link" onClick={onSwitch}>Sign In</a>
                    </div>
                    <Form form={form} name="register" onFinish={onFinish}>
                        <Form.Item
                            name="email"
                            rules={[{ type: 'email', required: true, message: 'Please input your Email!' }]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your Password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item>
                            <div className="register-button-container">
                                <Button className="register-button" type="text" htmlType="submit">
                                    Sign Up
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
