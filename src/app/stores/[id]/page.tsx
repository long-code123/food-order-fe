'use client'
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout';
import { Food, createFood, deleteFood, fetchFoodsByStore, updateFood } from '@/api/foodAPI';
import { Admin, fetchAdminInfo } from '@/api/adminAPI';
import { Breadcrumb, Button, Card, Form, Input, Modal, Popconfirm, Space, Statistic, Table, TableProps, message } from 'antd';
import BreadCrumb from '@/components/breadcrumb';
import { HomeOutlined, StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { fetchStores } from '@/api/storeAPI';
import { Reviewstore, fetchReviewByStore } from '@/api/reviewstoreAPI';
import { Payment, fetchPaymentByStore } from '@/api/paymentAPI';

interface EditFoodForm {
  foodName: string;
  price: number;
  description: string;
  foodImage: string;
}

const ViewDetailStore = ({ params }: { params: { id: string } }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [reviewstores, setReviewstores] = useState<Reviewstore[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [storeEarning, setStoreEarning] = useState<number>(0);


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const storeId = parseInt(params.id);
        const fetchReview = await fetchReviewByStore(storeId);
        setReviewstores(fetchReview);
        const totalRating = fetchReview.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
        const average = totalRating / fetchReview.length;
        setAverageRating(average);
        const fetchedFoods = await fetchFoodsByStore(storeId);
        setFoods(fetchedFoods);
        const dataAdmin = await fetchAdminInfo();
        setAdmin(dataAdmin);
        const paymentsData = await fetchPaymentByStore(storeId);
        setPayments(paymentsData);
        setTotalPayments(paymentsData.length);
        const total = paymentsData.reduce((acc, curr) => acc + parseInt(curr.totalAmount), 0);
        setStoreEarning(total);
        const dataStore = await fetchStores();
        const selectedStore = dataStore.find(store => store.storeId === storeId);
        if (selectedStore) {
          setSelectedStoreName(selectedStore.storeName);
        }
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
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Stores', link: '/stores' },
    { label: 'Store Detail' }, // Label của trang hiện tại
  ];

  const columns1: TableProps<Reviewstore>['columns'] = [
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          <StarFilled style={{ color: '#ffc107' }} />
          <span>{rating}</span>
        </Space>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {admin?.role === 'super admin' && (
            <>
              <Popconfirm
                title="Are you sure to delete this food?"
                onConfirm={() => handleDelete(record.id)}
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
  ]


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
    <AppLayout activeMenuKey="store">
      <BreadCrumb items={[selectedStoreName, 'Detail']} />
      <Card title="Information">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginRight: '100px', marginLeft: '50px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
              Average Rating
            </div>
            <Statistic
              title=""
              value={averageRating}
              precision={1}
              suffix={<Space><StarFilled style={{ color: '#ffc107' }} /></Space>}
              style={{ fontSize: '20px' }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
              Store Earning
            </div>
            <Statistic title="" value={storeEarning} suffix="VND" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
              Total Payments
            </div>
            <Statistic title="" value={totalPayments} />
          </div>
        </div>

        <Table columns={columns1} dataSource={reviewstores} pagination={{ pageSize: 5 }} />
        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>List of Foods</p>
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

export default ViewDetailStore;
