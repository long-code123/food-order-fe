'use client'
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout';
import { Food, createFood, deleteFood, fetchFoodsByCategory, updateFood } from '@/api/foodAPI';
import { Admin, fetchAdminInfo } from '@/api/adminAPI';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from 'antd';
import { fetchCategories } from '@/api/categoryAPI';
import BreadCrumb from '@/components/breadcrumb';
import { useAuth } from '@/components/authProvider/authProvider';

interface EditFoodForm {
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}

const ViewDetailCategory = ({ params }: { params: { id: string } }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  useAuth();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const categoryId = parseInt(params.id);
        const fetchedFoods = await fetchFoodsByCategory(categoryId);
        setFoods(fetchedFoods);
        const dataAdmin = await fetchAdminInfo();
        setAdmin(dataAdmin);
        const dataCategory = await fetchCategories();
        const selectedCategory = dataCategory.find(category => category.categoryId === categoryId)
        if(selectedCategory){
          setSelectedCategoryName(selectedCategory.categoryName)
        }
        console.log(selectedCategory)
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, [params.id]);


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
      const updatedFoods = [...foods]; // Sao chép danh sách foods
      const index = updatedFoods.findIndex((food) => food.foodId === editingFood!.foodId); // Tìm vị trí của food cần cập nhật
      if (index !== -1) {
        updatedFoods[index] = { ...editingFood!, ...values }; // Cập nhật thông tin food trong danh sách
        setFoods(updatedFoods);
      }
      setIsUpdateModalVisible(false);
      message.success("Food updated successfully!");
    } catch (error) {
      console.error("Error updating food:", error);
      setError("Failed to update food");
    }
  };

  const handleDelete = async (foodId: number) => {
    try {
      await deleteFood(foodId);
      const updatedFoods = foods.filter((food) => food.foodId !== foodId); // Loại bỏ food đã xóa khỏi danh sách
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
    <AppLayout activeMenuKey="categories">
      <BreadCrumb items={[selectedCategoryName, 'Foods']} />

      <Card title="List Foods">
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
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default ViewDetailCategory;
