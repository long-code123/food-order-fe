'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import { Voucher, createVoucher, deleteVoucher, fetchVouchers, updateVoucher } from "@/api/voucherAPI";
import AppLayout from '@/components/layout';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";


interface EditVoucherForm {
    description: string;
    value: number;
    conditition: string;
}

export default function Home() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newVoucher, setNewVoucher] = useState<Partial<Voucher>>({
        description: "",
        value: 0,
        conditition: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchVouchers();
                setVouchers(data);
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

    const handleCreateVoucher = async () => {
        try {
            const createdVoucher = await createVoucher(newVoucher);
            console.log("Voucher created successfully:", createdVoucher);
            const updatedStores = await fetchVouchers();
            setVouchers(updatedStores);
            setIsCreateModalVisible(false);
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

    const handleEditClick = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        editForm.setFieldsValue(voucher); // Thiết lập giá trị cho form chỉnh sửa
    };

    const handleSaveClick = async () => {
        try {
            const values: EditVoucherForm = await editForm.validateFields(); // Lấy dữ liệu từ form
            await updateVoucher(editingVoucher!.voucherId, values);
            const updatedVouchers = await fetchVouchers();
            setVouchers(updatedVouchers);
            setIsUpdateModalVisible(false);
            message.success("Voucher updated successfully!");
        } catch (error) {
            console.error("Error updating voucher:", error);
            setError("Failed to update voucher");
        }
    };

    const handleDelete = async (voucherId: number) => {
        try {
            await deleteVoucher(voucherId);
            const updatedVouchers = await fetchVouchers();
            setVouchers(updatedVouchers);
            message.success("Voucher deleted successfully!");
        } catch (error) {
            console.error("Error deleting voucher:", error);
            setError("Failed to delete voucher");
        }
    };
    const columns: TableProps<Voucher>['columns'] = [
        {
            title: 'Voucher description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Conditition',
            dataIndex: 'conditition',
            key: 'conditition',
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
                                title="Are you sure to delete this voucher?"
                                onConfirm={() => handleDelete(record.voucherId)}
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
        <AppLayout activeMenuKey="vouchers">
            <Card title="List vouchers">
                {admin?.role === 'super admin' && (
                    <>
                        <Button type="primary" onClick={handleOpenCreateModal}>Create Voucher</Button>
                        <Modal
                            title="Create Voucher"
                            visible={isCreateModalVisible}
                            onCancel={handleCloseCreateModal}
                            footer={[
                                <Button key="save" type="primary" onClick={handleCreateVoucher}>
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
                                    setNewVoucher(allValues);
                                }}
                            >
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: 'Please enter description' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="value"
                                    label="Value" // Thêm label cho trường URL hình ảnh
                                    rules={[{ required: true, message: 'Please enter value' }]} // Quy tắc yêu cầu nhập URL
                                >
                                    <Input type="number" />
                                </Form.Item>
                                <Form.Item
                                    name="conditition"
                                    label="Conditition"
                                    rules={[{ required: true, message: 'Please enter conditition' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                )}
                <Table columns={columns} dataSource={vouchers} />
            </Card>
            <Modal
                title="Edit Voucher"
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
                        setNewVoucher(allValues);
                    }}
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter discription' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Value"
                        rules={[{ required: true, message: 'Please enter value' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="conditition"
                        label="Conditition"
                        rules={[{ required: true, message: 'Please enter conditition' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>


    );
}