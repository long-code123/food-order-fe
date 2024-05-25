import React, { useEffect, useState } from "react";
import { fetchAdminInfo, Admin } from "@/app/api/adminAPI";
import { Avatar } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";


const AdminInfo = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const handleLogout = () => {
        localStorage.removeItem('userToken');
        router.push('/login'); // Redirect to login page after logout
    };

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

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!admin) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-info-container">
            <div className="admin-info-header">
                <Avatar size='default' icon={<UserOutlined />} />
                <span className="admin-name">{admin.adminName}</span>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="admin-info-content">
                <span style = {{color: 'white'}}>Email: {admin.email}</span>
                <div><span style = {{color: 'white'}}>Role: {admin.role}</span></div>
            </div>
        </div>
    );
};

export default AdminInfo;
