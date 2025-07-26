import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './account.css';
import { GetUserById } from "../../../services/https";

const { Title, Text } = Typography;

const Account = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [userID, setUserID] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const id = localStorage.getItem('id');
        setUserID(id);
    }, []);

    const fetchUserData = async (userID: number) => {
        try {
            const user = await GetUserById(userID);
            if (user?.ID) {
                form.setFieldsValue({
                    email: user.Email,
                    password: user.Password,
                });
            } else {
                messageApi.open({
                    type: "error",
                    content: "ไม่พบข้อมูลผู้ใช้",
                });
                setTimeout(() => {
                    navigate("/setting");
                }, 2000);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            });
        }
    };

    useEffect(() => {
        if (userID) {
            fetchUserData(Number(userID));
        }
    }, [userID]);

    const handleSave = (values: any) => {
        console.log("Form submitted:", values);
        message.success("ข้อมูลถูกบันทึกเรียบร้อย (จำลอง)");
        // TODO: call update API
    };

    return (
        <div className="account-container">
            {contextHolder}
            <div className="account-box">
                <div className="account-header">
                    <Title level={3}>Update Account</Title>
                    <Text type="secondary">You can update your email and password.</Text>
                </div>
                <Form form={form} layout="vertical" className="account-form" onFinish={handleSave}>
                    <Row gutter={32}>
                        <Col xs={24} md={16}>
                            <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                                <Input.Password />
                            </Form.Item>

                            <div className="account-button-group">
                                <Button onClick={() => navigate("/setting")}>Cancel</Button>
                                <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                                    Save
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default Account;
