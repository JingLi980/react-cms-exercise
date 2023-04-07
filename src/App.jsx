import React from "react";
import "./assets/base.less";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "./components/Header";
import Aside from "./components/Aside";
import Bread from "./components/Bread";

export default function App() {
  return (
    <div>
      <Layout id="app">
        <Header />
        <Layout>
          <div className="container">
            <Aside />
            <div className="container_box">
              <Bread />
              <div className="container_content">
                <Outlet />
              </div>
            </div>
          </div>
        </Layout>
        <footer>Respect | Copyright &copy; 2023 Author 李晶</footer>
      </Layout>
    </div>
  );
}
