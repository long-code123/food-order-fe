// export const name: string = 'user-dropdown';
import React, { ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown } from 'antd'
import { LogoutOutlined, DownOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { Admin, fetchAdminInfo } from '@/api/adminAPI'
const Wrapper = styled.a`
  display: flex;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    margin-right: 8px;
  }
  .username {
    font-weight: 700;
    color: #2c3e50;
    margin-right: 4px;
  }
`
type IUserProps = {
    username?: string,
    avatar: string
}

const UserDropDown: React.FC<IUserProps> = ({ username, avatar }: IUserProps) => {
    const router = useRouter();
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


    const handleLogout = () => {
        localStorage.removeItem('userToken');
        router.push('/login');
    };

    const menu: any = (
        <Menu>
            <Menu.Item>
                <a target='_blank' rel='noopener noreferrer'>
                    <EditOutlined />
                    Role: {admin?.role}
                </a>
            </Menu.Item>
            {/* <Menu.Item>
                <a target='_blank' rel='noopener noreferrer'>
                    <EditOutlined />
                    Đổi mật khẩu
                </a>
            </Menu.Item> */}
            <Menu.Item>
                <a onClick={handleLogout} target='_blank' rel='noopener noreferrer'>
                    <LogoutOutlined />
                    Logout
                </a>
            </Menu.Item>
        </Menu>
    )


    return (
        <Dropdown overlay={menu}>
            <Wrapper className='ant-dropdown-link' href='#'>
                <img src={avatar} alt={username} />
                <span className='fullname'>{username}</span>
                <DownOutlined />
            </Wrapper>
        </Dropdown>
    )
}
export default UserDropDown;
