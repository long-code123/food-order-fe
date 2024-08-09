// 'use client'
import Head from 'next/head'
import { LayoutWrapper, ContentWrapper, LogoWrapper } from '@/components/wrapper'
import styled from 'styled-components'
import Link from 'next/link'
import {
    BarsOutlined,
    CoffeeOutlined,
    CommentOutlined,
    DollarOutlined,
    FileDoneOutlined,
    GiftOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TruckOutlined,
    UserOutlined,
    WechatOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Layout, Menu } from 'antd';
import React, { memo, useState,ReactNode ,useEffect} from 'react';
import FoodList from '@/components/food';
import UserDropDown from './user-dropdown'
import type { MenuProps } from 'antd';
import { Admin, fetchAdminInfo } from '@/api/adminAPI';
import { useRouter } from 'next/navigation';


const { Header, Sider, Content,Footer } = Layout;
const LogoName = styled.span`
	margin: 12px;
	font-size: 21px;
	line-height: 30px;
	font-weight: 700;
	color: #2ecc71;
`
type IProps = {
	title?: string,
	children?: ReactNode,
	activeMenuKey?: string
}

const App = memo(({ title, activeMenuKey, children}:IProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState(activeMenuKey);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAdminInfo();
                setAdmin(data);
            } catch (error: any) {
                setError(error.message);
                console.error("Error fetching admin info:", error);
            }
        };

        fetchData();
    }, []);
    
    const handleMenuClick = (e: any) => {
        setSelectedKey(e.key);
    };
    useEffect(() => {

	}, [])

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!admin) {
        return <p>Loading...</p>;
    }


    return (
        <LayoutWrapper>
            <Head>
				<title>{title} | Food Order CMS</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
            <Layout style={{ minHeight: '100vh' }}>
            <Header id='headerNav'>
          <div style={{ 'display': 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
            <div style={{
              color: '#fff',
              fontSize: '18px',
              lineHeight: '64px',
              padding: '0 24px',
              cursor: 'pointer',
              transition: 'color 0.3s',
            }}>
              {collapsed ?
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(false)} /> :
                <MenuFoldOutlined className="trigger"
                  onClick={() => setCollapsed(true)} />}
            </div>
            <LogoWrapper>
              <img src='https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Grab_%28application%29_logo.svg/2560px-Grab_%28application%29_logo.svg.png' />
            </LogoWrapper>
          </div>
          <UserDropDown username={admin.adminName} avatar="https://lh3.googleusercontent.com/ogw/ADGmqu_t6ocQYu86ewBqgpoKp35oKKv8l98N6RpyzL_L=s32-c-mo" />
        </Header>
            <Layout style={{ marginTop: '1px' }}>
                <Sider theme='light' width={200} trigger={null} collapsible collapsed={collapsed}>
                    <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedKey as string]}
                    onClick={handleMenuClick}
                    style={{ padding: '0px' }}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <CoffeeOutlined />,
                            label: <Link href="/">Dashboard</Link>,
                        },
                        {
                            key: 'foods',
                            icon: <HomeOutlined />,
                            label: <Link href="/foods">Foods</Link>,
                        },
                        {
                            key: 'store',
                            icon: <HomeOutlined />,
                            label: <Link href="/stores">Stores</Link>,
                        },
                        {
                            key: 'categories',
                            icon: <BarsOutlined />,
                            label: <Link href="/categories">Categories</Link>,
                        },
                        {
                            key: 'shippers',
                            icon: <TruckOutlined />,
                            label: <Link href="/shippers">Shippers</Link>,
                        },
                        {
                            key: 'users',
                            icon: <UserOutlined />,
                            label: <Link href="/users">Users</Link>,
                        },
                        {
                            key: 'admins',
                            icon: <UserOutlined />,
                            label: <Link href="/admins">Admins</Link>,
                        },
                        {
                            key: 'vouchers',
                            icon: <GiftOutlined />,
                            label: <Link href="/vouchers">Vouchers</Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout"  style={{ marginTop: '1px' }}>
                <Content style={{ overflow: 'initial', minHeight: '100vh' }}>
							<ContentWrapper>
								{children}
							</ContentWrapper>
                           
						</Content>
                        <Footer style={{ textAlign: 'center' }}>
							©  {new Date().getFullYear()} Nguyen Ba Long Team
						</Footer>
            </Layout>
            </Layout>
            </Layout>
        </LayoutWrapper>
    );
});
export default App;

