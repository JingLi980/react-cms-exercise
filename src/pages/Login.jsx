import React from "react";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./less/Login.less";
import logoImg from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginApi } from "../request/api";

export default function Login() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    LoginApi({
      username: values.username,
      password: values.password,
    }).then((res) => {
      console.log(res);
      if (res.errCode === 0) {
        message.success(res.message);
        // 存储数据
        localStorage.setItem("avatar", res.data.avatar);
        localStorage.setItem("cms-token", res.data["cms-token"]);
        localStorage.setItem("editable", res.data.editable);
        localStorage.setItem("player", res.data.player);
        localStorage.setItem("username", res.data.username);
        // 跳转到根路径
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        message.error(res.message);
      }
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login">
      <div className="login_box">
        <img src={logoImg} alt="" />
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          labelCol={{
            span: 5,
          }}
          style={{
            maxWidth: 400,
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名/手机号!" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名/手机号"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请输入密码"
            />
          </Form.Item>

          {/* <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item>
            <Link to="/register">还没账号？立即注册</Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
