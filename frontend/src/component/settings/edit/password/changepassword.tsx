import { Form, Input, Typography, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ChangePassword } from "../../../../services/https";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import './changepassword.css';
import type { ChangePasswordInput } from '../../../../interfaces/ChangePassword';

const { Title, Text } = Typography;

const ChangePasswordUser = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      const res = await ChangePassword(payload);
      messageApi.open({
        type: 'success',
        content: res.message || "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
        duration: 2,
      });
      setTimeout(() => {
        navigate("/settings/account");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      messageApi.open({
        type: 'error',
        content: err.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
        duration: 3,
      });
    }
  };

  const renderButtons = () => (
    <>
      <Button onClick={() => navigate("/settings/account")}>Cancel</Button>
      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
        Save
      </Button>
    </>
  );

  return (
    <div className="change-password">
      {contextHolder}
      <div className="change-password-header">
        <Title level={3}>Change Password</Title>
        <Text type="secondary">
          Update your password for better security.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        autoComplete="off"
        requiredMark={false}
        className="change-password-form"
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password
            placeholder="Enter current password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message: "Must include uppercase, lowercase, and a number",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Enter new password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return value === getFieldValue("newPassword")
                  ? Promise.resolve()
                  : Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm new password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <div className="button-group">{renderButtons()}</div>
      </Form>
    </div>
  );
};

export default ChangePasswordUser;
