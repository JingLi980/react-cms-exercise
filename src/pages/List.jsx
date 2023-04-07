import React, { useEffect, useState } from "react";
import "./less/ListTable.less";
import { Space, Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArticleListApi, ArticleDelApi } from "../request/api"; //请求数据
import moment from "moment/moment"; //时间
//import { Pagination } from "antd"; //分页

//标题组件
function MyTitle(props) {
  return (
    <div>
      <a
        className="table_title"
        href={"http://codesohight.com:8765/article/" + props.id}
      >
        {props.title}
      </a>
      <p style={{ color: "#999" }}>{props.subTitle}</p>
    </div>
  );
}

export default function ListTable() {
  const [update, setUpdate] = useState(1);
  const navigate = useNavigate();
  //文章部分
  const [arr, setArr] = useState([
    {
      key: "1",
      name: "John Brown",
      address: "New York No. 1 Lake Park",
    },
  ]);
  //分页 并初始化
  const [pagination, setPagination] = useState({
    current: 1, //默认打开所在的页数
    pageSize: 12, //每一个文章数量  不知道为什最终渲染的每一页的数量是这里决定的
    total: 0,
  });

  //展示部分
  const columns = [
    {
      dataIndex: "mytitle",
      key: "mytitle",
      width: "60%",
      render: (text) => <div>{text}</div>,
    },
    {
      dataIndex: "date",
      key: "date",
      render: (text) => <div>{text}</div>,
    },
    {
      key: "action",
      render: (text, record) => {
        //console.log(text);
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => navigate("/edit/" + text.key)}
            >
              编辑
            </Button>
            <Button type="danger" onClick={() => delFn(text.key)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  //提取像后台请求文章和分页的代码 从后台拿数据 更新state
  const getArticleList = (current, pageSize) => {
    ArticleListApi({
      num: current,
      count: pageSize,
    }).then((res) => {
      if (res.errCode === 0) {
        //console.log(res.data);
        //拿到分页数据并更新state中的pagination
        let { num, count, total } = res.data; //1 12 12
        setPagination({ current: num, pageSize: count, total });
        let newArr = JSON.parse(JSON.stringify(res.data.arr));
        //console.log(newArr); 从服务器拿来的数据 包括 date id title subTitle
        /* 
      1. JSON.stringify() 方法将一个 JS 对象或值转换为 JSON 字符串
      2. JSON.parse() 方法用来解析 JSON 字符串
      */
        let myarr = [];
        newArr.map((item) => {
          //对后台拿到的数据进行处理
          let obj = {
            key: item.id,
            date: moment(item.date).format("YYYY-MM-DD hh:mm:ss"),
            mytitle: (
              <MyTitle
                id={item.id}
                title={item.title}
                subTitle={item.subTitle}
              />
            ),
          };
          return myarr.push(obj);
        });
        setArr(myarr); //将拿到的数据更新到state
      }
    });
  };

  //请求文章列表
  useEffect(() => {
    getArticleList(pagination.current, pagination.pageSize);
  }, [pagination]);

  //点击分页按钮实现切换
  const pageChange = (arg) => {
    //arg相当于e
    getArticleList(arg.current, arg.pageSize);
  };

  // 删除
  const delFn = (id) => {
    ArticleDelApi({ id }).then((res) => {
      if (res.errCode === 0) {
        message.success(res.message);
        // 重新刷页面，要么重新请求这个列表的数据   window.reload   调用getList(1)  增加变量的检测
        setUpdate(update + 1);
      } else {
        message.success(res.message);
      }
    });
  };

  return (
    <div className="list_table">
      {/* columns列 dataSource数据 */}
      <Table
        columns={columns}
        showHeader={false}
        dataSource={arr}
        onChange={pageChange}
        pagination={pagination}
      />
    </div>
  );
}

/* 
  ListList页面如何展示信息
  1.我们从后台拿到文章数据newArr，对newArr中所有文章处理(生成obj)， 更新到state中(arr)。
  2.<Table columns={columns} showHeader={false} dataSource={arr} />中
  每一列columns 数据来源是state中的arr。
  将arr(obj,myarr)中data和mytitle 和columns里dataIndex值相对应 进行展示
*/
