// 'use client'
// import {
//     CoffeeOutlined,
//     HomeOutlined,
//     MenuFoldOutlined,
//     MenuUnfoldOutlined,
//     UploadOutlined,
//     UserOutlined,
//     VideoCameraOutlined,
// } from '@ant-design/icons';
// import { Avatar, Col, Layout, Menu, Row } from 'antd';
// import React, { useState } from 'react';
// import FoodList from '@/components/food';
// import AdminInfo from '@/components/adminInfo';


// const { Header, Sider, Content } = Layout;
// const App = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const [selectedKey, setSelectedKey] = useState('1');



//     const handleMenuClick = (e: any) => {
//         setSelectedKey(e.key);
//     };

//     return (
//         <Layout>
//             <Sider trigger={null} collapsible collapsed={collapsed}>
//                 <div className="logo" />
//                 <Menu
//                     theme="dark"
//                     mode="inline"
//                     defaultSelectedKeys={['1']}
//                     selectedKeys={[selectedKey]}
//                     className='sider-items'
//                     onClick={handleMenuClick}
//                     items={[
//                         {
//                             key: '1',
//                             icon: <CoffeeOutlined />,
//                             label: 'List of Foods',
//                         },
//                         {
//                             key: '2',
//                             icon: <HomeOutlined />,
//                             label: 'List of Stores',
//                         },
//                         {
//                             key: '3',
//                             icon: <UserOutlined />,
//                             label: 'List of Users',
//                         },
//                     ]}
//                 />
//             </Sider>
//             <Layout className="site-layout">
//                 <Header
//                     className="site-layout-background"
//                     style={{
//                         padding: 0,
//                     }}
//                 >
//                     <Row>
//                         <Col md={18}>
//                             {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
//                                 className: 'trigger',
//                                 onClick: () => setCollapsed(!collapsed),
//                             })}
//                         </Col>
//                         <Col md={6}>
//                             <div>
//                                 <AdminInfo/>
//                             </div>

//                         </Col>
//                     </Row>

//                 </Header>
//                 <Content
//                     className="site-layout-background"
//                     style={{
//                         margin: '24px 16px',
//                         padding: 24,
//                         minHeight: 280,
//                     }}
//                 >
//                     {selectedKey === '1' && <FoodList></FoodList>}
//                     {selectedKey === '2' && <div>Content for nav 2</div>}
//                     {selectedKey === '3' && <div>Content for nav 3</div>}
//                 </Content>
//             </Layout>
//         </Layout>
//     );
// };
// export default App;

'use client'

import AppLayout from '@/components/layout';

import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Card } from 'antd'

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
// interface Food {
//   foodId: number;
//   foodName: string;
//   price: number;
//   description: string;
//   foodImage: string;
// }
// async function getData() {
//   const res = await fetch('http://localhost:8000/api/v1/foods');
//   return res.json();
// }

export default async function Home() {
//   const data: Food[] = await getData();
//   console.log(data);
 
  return (
    <AppLayout activeMenuKey="foods">
        <Card title="List Foods">
        <Table columns={columns} dataSource={data} />
        </Card>
    </AppLayout>
  );
}
