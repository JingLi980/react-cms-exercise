import React, { useState, useEffect } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

export default function Bread() {
  //设置变量
  const [breadName, setBreadName] = useState("");
  //获取路径
  const { pathname } = useLocation();
  //一旦路径变化要获取对应路径，并修改breadName
  //监听路径
  useEffect(() => {
    switch (pathname) {
      case "/list":
        setBreadName("查看文章列表");
        break;
      case "/edit":
        setBreadName("文章编辑");
        break;
      case "/means":
        setBreadName("修改资料");
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <Breadcrumb style={{ height: "30px", lineHeight: "30px" }}>
      <Breadcrumb.Item href="/list">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item>{breadName}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
