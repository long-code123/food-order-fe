'use client'
import { Food, createFood, deleteFood, fetchFoods, updateFood } from '@/api/foodAPI';
import AppLayout from '@/components/layout';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import { Admin, fetchAdminInfo } from '@/api/adminAPI';
import { useAuth } from '@/components/authProvider/authProvider';

interface EditFoodForm {
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false); // Thêm state mới
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [newFood, setNewFood] = useState<Partial<Food>>({
    foodName: "",
    price: 0,
    description: "",
    foodImage: ""
  });

  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFoods();
        setFoods(data);
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

  const handleCreateFood = async () => {
    try {
      const createdFood = await createFood(newFood);
      console.log("Food created successfully:", createdFood);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
      setIsCreateModalVisible(false) ;
      createForm.resetFields();
      message.success("Food created successfully!");
    } catch (error) {
      console.error("Error creating food:", error);
      setError("Failed to create food");
    }
  };

  const [editForm] = Form.useForm();


  const handleOpenModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalVisible(false);
  };

  const handleEditClick = (food: Food) => {
    setEditingFood(food);
    editForm.setFieldsValue(food); // Thiết lập giá trị cho form chỉnh sửa
  };

  const handleSaveClick = async () => {
    try {
      const values: EditFoodForm = await editForm.validateFields(); // Lấy dữ liệu từ form
      await updateFood(editingFood!.foodId, values);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
      setIsUpdateModalVisible(false);
      message.success("Food updated successfully!");
    } catch (error) {
      console.error("Error updating food:", error);
      setError("Failed to update food");
    }
  };

  //Delete Food
  const handleDelete = async (foodId: number) => {
    try {
      await deleteFood(foodId);
      const updatedFoods = await fetchFoods();
      setFoods(updatedFoods);
      message.success("Food deleted successfully!");
    } catch (error) {
      console.error("Error deleting food:", error);
      setError("Failed to delete food");
    }
  };

  const columns: TableProps<Food>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'foodName',
      key: 'foodName',
      render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>{price} $</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Food Image',
      dataIndex: 'foodImage',
      key: 'foodImage',
      render: (foodImage: string) => <img src={foodImage} style={{ width: '100px', height: '100px' }} />,
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
                title="Are you sure to delete this food?"
                onConfirm={() => handleDelete(record.foodId)}
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
    <AppLayout activeMenuKey="foods">
      <Card title="List Foods">
        {admin?.role === 'super admin' && (
          <>
            <Button type="primary" onClick={handleOpenCreateModal}>Create Food</Button>
            <Modal
              title="Create Food"
              visible={isCreateModalVisible}
              onCancel={handleCloseCreateModal}
              footer={[
                <Button key="save" type="primary" onClick={handleCreateFood}>
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
                  setNewFood(allValues);
                }}
              >
                <Form.Item
                  name="foodName"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter food name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  name="foodImage"
                  label="Image URL" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
        <Table columns={columns} dataSource={foods} pagination={{ pageSize: 5 }} />
      </Card>
      <Modal
        title="Edit Food"
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
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="foodName"
            label="Name"
            rules={[{ required: true, message: 'Please enter food name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="foodImage"
            label="Image"
            rules={[{ required: true, message: 'Please enter Image' }]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>

  );
}

