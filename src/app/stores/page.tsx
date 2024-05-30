'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import AppLayout from '@/components/layout';
import { createStore, deleteStore, fetchStores, updateStore } from "@/api/storeAPI";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { Store } from "antd/es/form/interface";
import { useEffect, useState } from "react";
import { Food, fetchFoodsByStore} from "@/api/foodAPI";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";


interface EditStoreForm {
  storeName: string;
  storeImage: string;
  address: string
}

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const[admin, setAdmin] = useState<Admin | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false); 
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [newStore, setNewStore] = useState<Partial<Store>>({
    storeName: "",
    storeImage: "",
    address: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStores();
        setStores(data);
        const dataAdmin = await fetchAdminInfo();
        setAdmin(dataAdmin);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchData();
  }, []);


  const [createForm] = Form.useForm();

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true);
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false)
  }

  const handleCreateStore = async () => {
    try {
      const createdStore = await createStore(newStore);
      console.log("Store created successfully:", createdStore);
      const updatedStores = await fetchStores();
      setStores(updatedStores);
      setIsCreateModalVisible(false) ;
      createForm.resetFields();
      message.success("Store created successfully!");
    } catch {
      console.error("Error creating store:", error);
      setError("Failed to create store");
    }
  };

  const [editForm] = Form.useForm();


  const handleOpenModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalVisible(false);
  };

  const handleEditClick = (store: Store) => {
    setEditingStore(store);
    editForm.setFieldsValue(store); // Thiết lập giá trị cho form chỉnh sửa
  };

  const handleSaveClick = async () => {
    try {
      const values: EditStoreForm = await editForm.validateFields(); // Lấy dữ liệu từ form
      await updateStore(editingStore!.storeId, values);
      const updatedStores = await fetchStores();
      setStores(updatedStores);
      setIsUpdateModalVisible(false);
      message.success("Store updated successfully!");
    } catch (error) {
      console.error("Error updating store:", error);
      setError("Failed to update store");
    }
  };

  const handleDelete = async (storeId: number) => {
    try {
      await deleteStore(storeId);
      const updatedStores = await fetchStores();
      setStores(updatedStores);
      message.success("Store deleted successfully!");
    } catch (error) {
      console.error("Error deleting store:", error);
      setError("Failed to delete store");
    }
  };
  const columns: TableProps<Store>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (text) =>  <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }} >{text}</a>,
    },
    {
      title: 'Store Image',
      dataIndex: 'storeImage',
      key: 'storeImage',
      render: (storeImage: string) => <img src={storeImage} style={{ width: '100px', height: '100px' }} />,
    },
    
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">
            <Link href={`/stores/${record.storeId}`}>Detail</Link>
          </Button>
          {admin?.role === 'super admin' && (
            <>
              <Button type="primary" onClick={() => {
                handleEditClick(record);
                handleOpenModal();
              }}>Update</Button>
              <Popconfirm
                title="Are you sure to delete this store?"
                onConfirm={() => handleDelete(record.storeId)}
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
    <AppLayout activeMenuKey="store">
            {/* {foodItems.length > 0 && (
        <BreadCrumb items={[selectedStoreName, 'Foods']} />
      )} */}
      <Card title="List stores">
      {admin?.role === 'super admin' && (
          <>
            <Button type="primary" onClick={handleOpenCreateModal}>Create Store</Button>
            <Modal
              title="Create Store"
              visible={isCreateModalVisible}
              onCancel={handleCloseCreateModal}
              footer={[
                <Button key="save" type="primary" onClick={handleCreateStore}>
                  Save
                </Button>,
                <Button key="cancel" onClick={handleCloseCreateModal}>
                  Cancel
                </Button>
              ]}
            >
              <Form
                form={createForm}
                layout="vertical"
                onValuesChange={(changedValues, allValues) => {
                  setNewStore(allValues);
                }}
              >
                <Form.Item
                  name="storeName"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter store name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="storeImage"
                  label="Image URL" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
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
          </>
        )}
        <Table columns={columns} dataSource={stores} />
      </Card>
      <Modal
        title="Edit Store"
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
                  setNewStore(allValues);
                }}
              >
                <Form.Item
                  name="storeName"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter store name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="storeImage"
                  label="Image URL" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
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