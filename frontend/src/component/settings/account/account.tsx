import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './account.css';
import { GetUserById, UpdateUser } from "../../../services/https";
import type { UserInterface } from "../../../interfaces/User";

const { Title, Text } = Typography;

const Account = () => {
    const [userID, setUserID] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditing, setIsEditing] = useState(false);
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
                    password: user.Password,
                });
            } else {
                messageApi.error("ไม่พบข้อมูลผู้ใช้");
                setTimeout(() => navigate('/setting'), 2000);
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

    const onFinish = async (values: UserInterface) => {
        const submitData = {
            ...values,
        };

        try {
            const res = await UpdateUser(Number(userID), submitData);
            if (res.status === 200) {
                messageApi.success('บันทึกข้อมูลสำเร็จ');
                setIsEditing(false);
            } else {
                messageApi.error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล (code: ${res.status})`);
            }
        } catch (error: any) {
            messageApi.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            console.error("Save error:", error.message || error);
        }
    };
    useEffect(() => {
        if (userID) {
            fetchUserData(Number(userID));
        }
    }, [userID]);

    const renderButtons = () =>
        isEditing ? (
            <>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                    Save
                </Button>
            </>
        ) : (
            <Button type="default" onClick={() => setIsEditing(true)}>
                Edit
            </Button>
        );

    return (
        <div className="account-container">
            {contextHolder}
            <div className="account-box">
                <div className="account-header">
                    <Title level={3}>Update Account</Title>
                    <Text type="secondary">You can update your email and password.</Text>
                </div>
                {!loading && (
                    <Form form={form} layout="vertical" className="account-form" onFinish={onFinish}>
                        <Row gutter={32}>
                            <Col xs={24} md={16}>
                                <Form.Item label="Email" name="email">
                                    {isEditing ? (
                                        <Input />
                                    ) : (
                                        <Input disabled />
                                    )}
                                </Form.Item>
                                <Form.Item label="Password" name="password">
                                    {isEditing ? (
                                        <Input.Password />
                                    ) : (
                                        <Input disabled />
                                    )}
                                </Form.Item>
                                <div className="button-group">{renderButtons()}</div>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default Account;
