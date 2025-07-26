import { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, Typography, message, DatePicker, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GetUserById, UpdateUser } from '../../../services/https';
import './profile.css';
import dayjs from 'dayjs';
import type { UserInterface } from '../../../interfaces/User';

const { Text, Title, Link } = Typography;

const Profile = () => {
    const [userID, setUserID] = useState<string | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditing, setIsEditing] = useState(false); // <-- โหมดแก้ไข

    useEffect(() => {
        const id = localStorage.getItem('id');
        setUserID(id);
    }, []);

    const fetchUserData = async (userID: number) => {
        try {
            const user = await GetUserById(userID);
            if (user?.ID) {
                form.setFieldsValue({
                    firstname: user.Firstname,
                    lastname: user.Lastname,
                    birthday: user.Birthday ? dayjs(user.Birthday) : null,
                    age: user.Age,
                });
            } else {
                messageApi.open({
                    type: "error",
                    content: "ไม่พบข้อมูลผู้ใช้",
                });
                setTimeout(() => navigate('/setting'), 2000);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            });
        }
    };
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

    return (
        <div className="profile-container">
            {contextHolder}
            <div className="profile-box">
                <div className="profile-header">
                    <Title level={3}>Profile Settings</Title>
                    <Text type="secondary">Edit your name and avatar.</Text>
                </div>
                <Form form={form} layout="vertical" className="profile-form" onFinish={onFinish}>
                    <Row gutter={32}>
                        <Col xs={24} md={16}>
                            <Form.Item label="First Name" name="firstname">
                                {isEditing ? (
                                    <Input />
                                ) : (
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item label="Last Name" name="lastname">
                                {isEditing ? (
                                    <Input />
                                ) : (
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item label="Birthday" name="birthday">
                                {isEditing ? (
                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                ) : (
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item label="Age" name="age">
                                {isEditing ? (
                                    <InputNumber />
                                ) : (
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <div className="delete-section">
                                <Link>Delete Your Account</Link>
                                <Text type="secondary" style={{ display: 'block' }}>
                                    You will receive an email to confirm your decision. All your data will be erased.
                                </Text>
                            </div>

                            <div className="button-group">
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="default" onClick={() => setIsEditing(true)}>
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </Col>

                        <Col xs={24} md={8} className="avatar-section">
                            <div className="avatar-placeholder" />
                            <Upload showUploadList={false}>
                                <Button icon={<UploadOutlined />} type="primary">
                                    Upload a picture
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default Profile;
