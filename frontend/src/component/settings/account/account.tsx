import { Form, Input, Row, Col, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './account.css';
import { GetUserById } from "../../../services/https";
import { RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Account = () => {
    const [userID, setUserID] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);

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
                    password: "*******",
                });
            } else {
                messageApi.error("ไม่พบข้อมูลผู้ใช้");
                setTimeout(() => navigate('/settings'), 2000);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userID) {
            fetchUserData(Number(userID));
        }
    }, [userID]);

    return (
        <div className="account-container">
            {contextHolder}
            <div className="account-box">
                <div className="account-header">
                    <Title level={3}>Account</Title>
                    <Text type="secondary">You can update your email and password.</Text>
                </div>
                {!loading && (
                    <Form form={form} layout="vertical" className="account-form">
                        <Row gutter={32}>
                            <Col xs={24} md={16}>
                                <Form.Item label="Email" name="email">
                                    <Input
                                        disabled
                                        suffix={
                                            <RightOutlined
                                                onClick={() => navigate("/setting/change-email")}
                                                style={{ color: "#999", cursor: "pointer" }}
                                            />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Password" name="password">
                                    <Input
                                        disabled
                                        type="password"
                                        suffix={
                                            <RightOutlined
                                                onClick={() => navigate("/settings/account/change-password")}
                                                style={{ cursor: "pointer", color: "#999" }}
                                            />
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default Account;
