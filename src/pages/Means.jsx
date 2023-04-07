import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import "./less/Means.less";
import { GetUserDataApi, ChangeUserDataApi } from "../request/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import PubSub from "pubsub-js";

//限制图片
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function Means() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    GetUserDataApi().then((res) => {
      console.log(res);
      if (res.errCode === 0) {
        message.success(res.message);
        // 存到sessionStorage
        sessionStorage.setItem("username", res.data.username);
        PubSub.publish("methodName", { isLoading: true }); //消息发布
      }
    });
  }, [localStorage.getItem("avatar")]);

  //表单提交事件
  const onFinish = (values) => {
    // 如果表单的username有值，并且不等于初始化时拿到的username，同时密码非空
    if (
      values.username &&
      values.username !== sessionStorage.getItem("username") &&
      values.password.trim() !== ""
    ) {
      // 做表单的提交...
      ChangeUserDataApi({
        username: values.username,
        password: values.password,
      }).then((res) => {
        console.log(res);
        // 当你修改成功的时候，不要忘了重新登录
      });
    }
  };

  //// 点击了上传图片
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        // 存储图片名称
        localStorage.setItem("avatar", info.file.response.data.filePath);
        if (info.file.response.errCode === 0) {
          message.success(info.file.response.message);
        } else {
          message.error(info.file.response.message);
        }
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <div className="means">
      <Form
        labelCol={{ span: 5 }}
        style={{ width: "400px" }}
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="修改用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "用户名不能为空!",
            },
          ]}
        >
          <Input placeholder="请输入新用户名" />
        </Form.Item>

        <Form.Item
          label="修改密码"
          name="password"
          rules={[
            {
              required: true,
              message: "密码不能为空!",
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            提交
          </Button>
        </Form.Item>
      </Form>
      <p>点击下方修改头像：</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{ "cms-token": localStorage.getItem("cms-token") }} //携带请求头
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
}
