import React from "react";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./less/Login.less";
import logoImg from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { RegisterApi } from "../request/api";

//useNavigate使得一般组件具有路由组件的三大属性

export default function Register() {
  const navigate = useNavigate(); //函数式组件跳转

  const onFinish = (values) => {
    RegisterApi({
      //接口调用传值
      username: values.username,
      password: values.password,
    }).then((res) => {
      //接口状态返回
      if (res.errCode === 0) {
        //注册成功提示
        message.success(res.message);
        // 跳到登录页
        setTimeout(() => navigate("/login"), 1500);
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
            rules={[{ required: true, message: "Please input your username!" }]}
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

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "请再次输入密码！",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("您输入的密码不一样，请重新输入！")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Link to="/login">已有账号？立即登录</Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              立即注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
