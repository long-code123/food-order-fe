'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import { User, deleteUser, fetchUsers, updateUser } from "@/api/userAPI";
import AppLayout from '@/components/layout';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";


interface EditUserForm {
  userName: string;
  userImage: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const[admin, setAdmin] = useState<Admin | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false); 
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    userName: "",
    userImage: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        const dataAdmin = await fetchAdminInfo();
        setAdmin(dataAdmin);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchData();
  }, []);

  const [editForm] = Form.useForm();


  const handleOpenModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalVisible(false);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    editForm.setFieldsValue(user); // Thiết lập giá trị cho form chỉnh sửa
  };

  const handleSaveClick = async () => {
    try {
      const values: EditUserForm = await editForm.validateFields(); // Lấy dữ liệu từ form
      await updateUser(editingUser!.userId, values);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setIsUpdateModalVisible(false);
      message.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };
  const columns: TableProps<User>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
    },
    {
      title: 'User Image',
      dataIndex: 'userImage',
      key: 'userImage',
      render: (userImage: string) => <img src={userImage} style={{ width: '100px', height: '100px' }} />,
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ađress',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {admin?.role === 'super admin' && (
            <>
              <Button type="primary" onClick={() => {
                handleEditClick(record);
                handleOpenModal();
              }}>Update</Button>
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDelete(record.userId)}
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

  return(
    <AppLayout activeMenuKey="users">
      <Card title="List users">
        <Table columns={columns} dataSource={users} />
      </Card>
      <Modal
        title="Edit User"
        visible={isUpdateModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="save" type="primary" onClick={handleSaveClick}>
            Save
          </Button>,
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,

        ]}
      >
              <Form
                form={editForm}
                layout="vertical"
                onValuesChange={(changedValues, allValues) => {
                  setNewUser(allValues);
                }}
              >
                <Form.Item
                  name="userName"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter user name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="userImage"
                  label="Image URL" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="dateOfBirth"
                  label="Date Of Birth"
                  rules={[{ required: true, message: 'Please enter date of birth' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please enter email' }]}
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <Input/>
                </Form.Item>
              </Form>
      </Modal>
    </AppLayout>


  );
}