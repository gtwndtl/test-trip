import { motion } from 'framer-motion';
import './register.css';
import { Button, Form, Input } from 'antd';

const RegisterPage = ({ onSwitch }: { onSwitch: () => void }) => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="register-page">
            <motion.div
                className="register-left"
                initial={{ x: '100%' }}      // เริ่มจากขวานอกจอ
                animate={{ x: 0 }}           // เคลื่อนเข้ามาอยู่ตำแหน่งปกติ
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
                    <Form name="register" onFinish={onFinish}>
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
                            rules={[{ required: true, message: 'Please confirm your Password!' }]}
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
