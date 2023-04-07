import React, { useEffect, useState } from "react";
import { Form, Input, PageHeader, Button, Modal, message } from "antd";
import moment from "moment";
import E from "wangeditor"; //编辑文章内容 引入对象E
import {
  ArticleAddApi,
  ArticleSearchApi,
  ArticleUpdateApi,
} from "../request/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";

//外界声明editor
let editor = null;

export default function Edit() {
  const [content, setContent] = useState(""); //保存文章内容
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const params = useParams(); //获取路由数据
  //console.log(params); 传过来的是id
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 模拟componentDidMount  编辑文章内容
  useEffect(() => {
    const editor = new E("#div1");
    editor.config.onchange = (newHtml) => {
      setContent(newHtml);
    };
    editor.create();

    // 根据地址栏id做请求 主要是处理修改文章部分
    //console.log(params); //新建文章没有id，修改文章有id
    if (params.id) {
      //查看文章内容
      ArticleSearchApi({ id: params.id }).then((res) => {
        if (res.errCode === 0) {
          //let { title, subTitle } = res.data;
          editor.txt.html(res.data.content); // 重新设置编辑器内容
          setTitle(res.data.title);
          setSubTitle(res.data.subTitle);
        }
      });
    }
    return () => {
      editor.destroy();
    };
  }, [location.pathname]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // form.resetFields(); // reset重置
        console.log("Received values of form: ", values);
        let { title, subTitle } = values;
        //console.log(content);
        if (params.id) {
          ArticleUpdateApi({ title, subTitle, content }).then((res) => {
            if (res.errCode === 0) {
              message.success(res.message);
              //跳转到list页面
              navigate("/listlist");
            } else {
              message.error(res.message);
            }
            setIsModalVisible(false); // 关闭对话框
          });
        } else {
          // 添加文章的请求
          ArticleAddApi({ title, subTitle, content }).then((res) => {
            message.error(res.message);
          });
        }
      })
      .catch(() => {
        return;
      });
  };

  return (
    <div>
      {/* 标题头部分 */}
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="文章编辑"
        subTitle={"当前日期：" + moment(new Date()).format("YYYY-MM-DD")}
        extra={
          <Button
            key="1"
            type="primary"
            onClick={() => setIsModalVisible(true)} //点击就提示对话框
          >
            提交文章
          </Button>
        }
      ></PageHeader>

      {/* 文本编辑器部分 */}
      <div
        id="div1"
        style={{ padding: "0 20px 20px", background: "#fff" }}
      ></div>

      {/* 提交文章弹出的对话框 */}
      <Modal
        zIndex={99999}
        title="填写文章标题"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          autoComplete="off"
          initialValues={{ title: title, subTitle: subTitle }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请填写标题!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="副标题" name="subTitle">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

/* 
编辑文章有两个入口：
    1.从查看文章列表里点击‘编辑’ 修改文章，跳转到编辑页面，由于编辑页面一渲染就会接口调用传过来的参数，渲染到编辑页面，会直接显示文章内容
    2.从文章编辑进入 新建文章
*/
