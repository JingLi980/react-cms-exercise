import React, { useState, useEffect } from "react";
import {
  ReadOutlined,
  EditOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("查看文章列表", "list", <ReadOutlined />),
  getItem("文章编辑", "edit", <EditOutlined />),
  getItem("修改资料", "means", <DatabaseOutlined />),
];

export default function Aside() {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultKey, setDefaultKey] = useState("");

  //一旦渲染立刻获得动态的路由路径，不使用默认的
  useEffect(() => {
    let path = location.pathname; //点击左侧导航获取的地址
    //console.log(path);
    let key = path.split("/")[1]; //将path以/分隔，并取序列1的项
    //console.log(key);
    if (key === "") navigate("/list"); //localhost:3000/打开时默认是list
    setDefaultKey(key); //更新state
  }, [location.pathname]);

  //及时更新路径
  const handleClick = (e) => {
    navigate("/" + e.key); //字符串拼接 例如生成/list
    setDefaultKey(e.key); //更新state
  };

  return (
    <Menu
      onClick={handleClick}
      style={{ width: 200 }}
      //defaultSelectedKeys={["list"]} //默认路由
      selectedKeys={[defaultKey]}
      defaultOpenKeys={["list"]}
      mode="inline"
      className="aside"
      theme="dark"
      items={items}
    />
  );
}
