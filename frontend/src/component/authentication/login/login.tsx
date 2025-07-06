import { motion } from 'framer-motion';
import './login.css';
import { Button, Form, Input, Flex, Divider, message } from 'antd';
import type { SignInInterface } from '../../../interfaces/SignIn';
import { useNavigate } from 'react-router-dom';
import { SignInUser } from '../../../services/https';

const LoginPage = ({ onSwitch, isFirstRender }: { onSwitch: () => void; isFirstRender: boolean }) => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        const signInData: SignInInterface = {
            Email: values.email,
            Password: values.password,
        };

        try {
            const result = await SignInUser(signInData);
            console.log("SignInUser result:", result); // ดูค่า result ใน console

            if (result && result.token && result.token_type) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('token_type', result.token_type);
                alert("Login successful"); // เปลี่ยนเป็น alert ดูว่าแสดงไหม
                console.log("Navigating to /home");
                navigate('/chat');
            } else {
                message.error("Invalid login response");
            }
        } catch (error: any) {
            message.error(error.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-form">
                    <div className="login-header">
                        <span className="login-title">TRIP PLANNER</span>
                    </div>
                    <div className="signup">
                        <p className="signup-text">Don't have an account?</p>
                        <a className="signup-link" onClick={onSwitch}>Sign up</a>
                    </div>
                    <Form name="login"
                        onFinish={onFinish}>
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
                        <div style={{ marginBottom: 8 }}>
                            <Flex justify="flex-end" align="center">
                                <a className="login-forgot" href="">Forgot password?</a>
                            </Flex>
                        </div>
                        <Form.Item>
                            <div className="buttons-container">
                                <Button className="sign-in-button" type="text" htmlType="submit">
                                    Sign In
                                </Button>
                            </div>
                        </Form.Item>
                        <Divider style={{ marginTop: 16 }} />
                        <div className="buttons-container">
                            <Button type="text" className="apple-login-button" block icon={
                                <svg className="apple-icon" viewBox="0 0 1024 1024" height="1em" width="1em" fill="currentColor">
                                    <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
                                </svg>
                            }>
                                Sign In with Apple
                            </Button>

                            <Button type="text" className="google-login-button" block icon={
                                <svg className="google-icon" viewBox="0 0 48 48" height="1em" width="1em">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
            c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
            c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
            C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
            c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
            c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                            }>
                                Sign In with Google
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <motion.div
                className="login-right"
                initial={isFirstRender ? false : { x: '-100%' }} // ถ้าโหลดครั้งแรก ไม่ต้องเลื่อน
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
            </motion.div>

        </div>

    )
}

export default LoginPage;