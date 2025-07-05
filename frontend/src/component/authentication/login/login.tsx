import './login.css';
import { Button, Form, Input, Flex, Divider } from 'antd';


const LoginPage = () => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };
    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-form">
                    <Form name="login"
                        onFinish={onFinish}>
                        <div className="login-header">
                            <span className="login-title">TRIP PLANNER</span>
                        </div>
                        <div className="signup">
                            <p className="signup-text">Are you have account?</p>
                            <a className="signup-link" href="">Sign up</a>
                        </div>
                        <Form.Item name="email" rules={[{ type: 'email', required: true, message: 'Please input your Email!' }]}>
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                            <Input type="password" placeholder="Password" />
                        </Form.Item>
                        <div style={{ marginBottom: 16 }}>
                            <Flex justify="flex-end" align="center">
                                <a className="login-forgot" href="">Forgot password?</a>
                            </Flex>
                        </div>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider plain style={{ color: '#9BA5B7' }}>เดี๋ยวมาทำ</Divider>
                </div>
            </div>
            <div className="login-right"></div>
        </div>

    )
}

export default LoginPage;