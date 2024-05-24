'use client'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Layout, Menu, Row } from 'antd';
import React, { useState } from 'react';
import FoodList from '@/components/food';
import { useRouter } from "next/navigation";


const { Header, Sider, Content } = Layout;
const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const router = useRouter();


    const handleLogout = () => {
        localStorage.removeItem('userToken');
        router.push('/login'); // Redirect to login page after logout
      };
    const handleMenuClick = (e: any) => {
        setSelectedKey(e.key);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedKey]}
                    className='sider-items'
                    onClick={handleMenuClick}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                >
                    <Row>
                        <Col md={18}>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </Col>
                        <Col md={6}>
                            <div>
                                <Avatar size='default' icon={<UserOutlined />}></Avatar>
                                <span style={{ color: 'white' }}>Nguyen Ba Long</span>
                                <button onClick={handleLogout}>Logout</button>
                            </div>

                        </Col>
                    </Row>

                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {selectedKey === '1' && <FoodList></FoodList>}
                    {selectedKey === '2' && <div>Content for nav 2</div>}
                    {selectedKey === '3' && <div>Content for nav 3</div>}
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;