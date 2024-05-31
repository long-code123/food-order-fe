'use client'
import AppLayout from '@/components/layout';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { Admin, createAdmin, deleteAdmin, fetchAdminInfo, fetchAdmins, updateAdmin } from '@/api/adminAPI';
import { useAuth } from '@/components/authProvider/authProvider';

interface EditAdminForm {
    adminName: string;
    email: string;
    password?: string;
    role: string;
}

export default function Home() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [newAdmin, setNewAdmin] = useState<Partial<EditAdminForm>>({
        adminName: "",
        email: "",
        password: "",
        role: ""
    });

    useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminsData = await fetchAdmins();
                setAdmins(adminsData);
                const adminData = await fetchAdminInfo();
                setCurrentAdmin(adminData);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };
        fetchData();
    }, []);

    const [createForm] = Form.useForm();
    const handleOpenCreateModal = () => setIsCreateModalVisible(true);
    const handleCloseCreateModal = () => setIsCreateModalVisible(false);

    const handleCreateAdmin = async () => {
        try {
            const createdAdmin = await createAdmin(newAdmin);
            console.log("Admin created successfully:", createdAdmin);
            const updatedAdmins = await fetchAdmins();
            setAdmins(updatedAdmins);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            message.success("Admin created successfully!");
        } catch (error) {
            console.log(newAdmin)
            console.error("Error creating admin:", error);
            message.error("Failed to create admin");
        }
    };

    const [editForm] = Form.useForm();
    const handleOpenModal = () => setIsUpdateModalVisible(true);
    const handleCloseModal = () => setIsUpdateModalVisible(false);

    const handleEditClick = (admin: Admin) => {
        setEditingAdmin(admin);
        console.log(editingAdmin);
        editForm.setFieldsValue({ ...admin, password: '' }); // Đặt mật khẩu trống
        handleOpenModal();
    };

    const handleSaveClick = async () => {
        try {
            const values: EditAdminForm = await editForm.validateFields();
            const updatedValues = { ...values };
            console.log("Updating admin with data:", updatedValues);
            if (!values.password) {
                delete updatedValues.password; // Xóa mật khẩu nếu không được nhập
            }
            await updateAdmin(editingAdmin!.adminId, updatedValues);
            const updatedAdmins = await fetchAdmins();
            setAdmins(updatedAdmins);
            setIsUpdateModalVisible(false);
            message.success("Admin updated successfully!");
        } catch (error) {
            console.log("Updating admin with data:", editForm.validateFields);
            console.error("Error updating admin:", error);
            message.error("Failed to update admin");
        }
    };

    const handleDelete = async (adminId: number) => {
        try {
            await deleteAdmin(adminId);
            const updatedAdmins = await fetchAdmins();
            setAdmins(updatedAdmins);
            message.success("Admin deleted successfully!");
        } catch (error) {
            console.error("Error deleting admin:", error);
            message.error("Failed to delete admin");
        }
    };

    const columns: TableProps<Admin>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'adminName',
            key: 'adminName',
            render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Admin Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {currentAdmin?.role === 'super admin' && (
                        <>
                            <Button type="primary" onClick={() => handleEditClick(record)}>Update</Button>
                            <Popconfirm
                                title="Are you sure to delete this admin?"
                                onConfirm={() => handleDelete(record.adminId)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary">Delete</Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AppLayout activeMenuKey="admins">
            <Card title="List Admins">
                {currentAdmin?.role === 'super admin' && (
                    <>
                        <Button type="primary" onClick={handleOpenCreateModal}>Create Admin</Button>
                        <Modal
                            title="Create Admin"
                            visible={isCreateModalVisible}
                            onCancel={handleCloseCreateModal}
                            footer={[
                                <Button key="save" type="primary" onClick={handleCreateAdmin}>Save</Button>,
                                <Button key="cancel" onClick={handleCloseCreateModal}>Cancel</Button>,
                            ]}
                        >
                            <Form
                                form={createForm}
                                layout="vertical"
                                onValuesChange={(changedValues, allValues) => setNewAdmin(allValues)}
                            >
                                <Form.Item
                                    name="adminName"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter admin name' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Please enter email' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please enter password' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name="role"
                                    label="Admin Role"
                                    rules={[{ required: true, message: 'Please enter role' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                )}
                <Table columns={columns} dataSource={admins} pagination={{ pageSize: 5 }} />
            </Card>
            <Modal
                title="Edit Admin"
                visible={isUpdateModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="save" type="primary" onClick={handleSaveClick}>Save</Button>,
                    <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
                ]}
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        name="adminName"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter admin name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Admin Role"
                        rules={[{ required: true, message: 'Please enter role' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    );
}
