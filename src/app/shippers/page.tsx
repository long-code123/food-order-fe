'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import AppLayout from '@/components/layout';
import { Shipper, createShipper, deleteShipper, fetchShippers, updateShipper } from "@/api/shipperAPI";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/authProvider/authProvider";


interface EditShipperForm {
  shipperName: string;
  shipperImage: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export default function Home() {
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editingShipper, setEditingShipper] = useState<Shipper | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newShipper, setNewShipper] = useState<Partial<Shipper>>({
    shipperName: "",
    shipperImage: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: ""
  });

  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShippers();
        setShippers(data);
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

  const handleEditClick = (shipper: Shipper) => {
    setEditingShipper(shipper);
    editForm.setFieldsValue(shipper); // Thiết lập giá trị cho form chỉnh sửa
  };

  const handleSaveClick = async () => {
    try {
      const values: EditShipperForm = await editForm.validateFields(); // Lấy dữ liệu từ form
      await updateShipper(editingShipper!.shipperId, values);
      const updatedShippers = await fetchShippers();
      setShippers(updatedShippers);
      setIsUpdateModalVisible(false);
      message.success("Shipper updated successfully!");
    } catch (error) {
      console.error("Error updating shipper:", error);
      setError("Failed to update shipper");
    }
  };

  const handleDelete = async (shipperId: number) => {
    try {
      await deleteShipper(shipperId);
      const updatedShippers = await fetchShippers();
      setShippers(updatedShippers);
      message.success("Shipper deleted successfully!");
    } catch (error) {
      console.error("Error deleting shipper:", error);
      setError("Failed to delete shipper");
    }
  };
  const columns: TableProps<Shipper>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'shipperName',
      key: 'shipperName',
      render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
    },
    {
      title: 'Shipper Image',
      dataIndex: 'shipperImage',
      key: 'shipperImage',
      render: (shipperImage: string) => <img src={shipperImage} style={{ width: '100px', height: '100px' }} />,
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
          <Button type="primary">
            <Link href={`/shippers/${record.shipperId}`}>Detail</Link>
          </Button>
          {admin?.role === 'super admin' && (
            <>
              <Button type="primary" onClick={() => {
                handleEditClick(record);
                handleOpenModal();
              }}>Update</Button>
              <Popconfirm
                title="Are you sure to delete this shipper?"
                onConfirm={() => handleDelete(record.shipperId)}
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
    <AppLayout activeMenuKey="shippers">
      <Card title="List shippers">
        <Table columns={columns} dataSource={shippers} />
      </Card>
      <Modal
        title="Edit Shipper"
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
            setNewShipper(allValues);
          }}
        >
          <Form.Item
            name="shipperName"
            label="Name"
            rules={[{ required: true, message: 'Please enter shipper name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shipperImage"
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
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>


  );
}