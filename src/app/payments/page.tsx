'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import AppLayout from '@/components/layout';
import { Payment, createPayment, deletePayment, fetchPayments, updatePayment } from "@/api/paymentAPI";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/authProvider/authProvider";


interface EditPaymentForm {
    paymentDate: string;
    totalAmount: string;
    paymentMethod: string;
    paymentStatus: string;
}

export default function Home() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newPayment, setNewPayment] = useState<Partial<Payment>>({
        paymentDate: "",
        totalAmount: "",
        paymentMethod: "",
        paymentStatus: ""
    });

    useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPayments();
                setPayments(data);
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

    const handleCreatePayment = async () => {
        try {
            const createdPayment = await createPayment(newPayment);
            console.log("Payment created successfully:", createdPayment);
            const updatedPayments = await fetchPayments();
            setPayments(updatedPayments);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            message.success("Payment created successfully!");
        } catch (error) {
            console.error("Error creating payment:", error);
            setError("Failed to create payment");
        }
    };

    const [editForm] = Form.useForm();


    const handleOpenModal = () => {
        setIsUpdateModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsUpdateModalVisible(false);
    };

    const handleEditClick = (payment: Payment) => {
        setEditingPayment(payment);
        editForm.setFieldsValue(payment); // Thiết lập giá trị cho form chỉnh sửa
    };

    const handleSaveClick = async () => {
        try {
            const values: EditPaymentForm = await editForm.validateFields(); // Lấy dữ liệu từ form
            await updatePayment(editingPayment!.paymentId, values);
            const updatedPayments = await fetchPayments();
            setPayments(updatedPayments);
            setIsUpdateModalVisible(false);
            message.success("Payment updated successfully!");
        } catch (error) {
            console.error("Error updating payment:", error);
            setError("Failed to update payment");
        }
    };

    const handleDelete = async (paymentId: number) => {
        try {
            await deletePayment(paymentId);
            const updatedPayments = await fetchPayments();
            setPayments(updatedPayments);
            message.success("Payment deleted successfully!");
        } catch (error) {
            console.error("Error deleting payment:", error);
            setError("Failed to delete payment");
        }
    };
    const columns: TableProps<Payment>['columns'] = [
        {
            title: 'Date',
            dataIndex: 'paymentDate',
            key: 'paymentNapaymentDateme',
            render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: 'Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
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
                                title="Are you sure to delete this payment?"
                                onConfirm={() => handleDelete(record.paymentId)}
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
        <AppLayout activeMenuKey="payments">
            <Card title="List payments">
            {admin?.role === 'super admin' && (
          <>
            <Button type="primary" onClick={handleOpenCreateModal}>Create Payment</Button>
            <Modal
              title="Create Payment"
              visible={isCreateModalVisible}
              onCancel={handleCloseCreateModal}
              footer={[
                <Button key="save" type="primary" onClick={handleCreatePayment}>
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
                  setNewPayment(allValues);
                }}
              >
                <Form.Item
                  name="paymentDate"
                  label="Date"
                  rules={[{ required: true, message: 'Please enter Date' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="totalAmount"
                  label="Total Amount" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Total Amount' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input type="number"/>
                </Form.Item>
                <Form.Item
                  name="paymentMethod"
                  label="Method" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Method' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="paymentStatus"
                  label="Status" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Status' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
                <Table columns={columns} dataSource={payments} />
            </Card>
            <Modal
                title="Edit Payment"
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
                  setNewPayment(allValues);
                }}
              >
                <Form.Item
                  name="paymentDate"
                  label="Date"
                  rules={[{ required: true, message: 'Please enter Date' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="totalAmount"
                  label="Total Amount" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Total Amount' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input type="number"/>
                </Form.Item>
                <Form.Item
                  name="paymentMethod"
                  label="Method" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Method' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="paymentStatus"
                  label="Status" // Thêm label cho trường URL hình ảnh
                  rules={[{ required: true, message: 'Please enter Status' }]} // Quy tắc yêu cầu nhập URL
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
        </AppLayout>


    );
}