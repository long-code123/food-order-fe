'use client'

import { Admin, fetchAdminInfo } from "@/api/adminAPI";
import AppLayout from '@/components/layout';
import { Category, createCategory, deleteCategory, fetchCategories, updateCategory } from "@/api/categoryAPI";
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";


interface EditCategoryForm {
    categoryName: string;
    categoryImage: string;
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<Category>>({
        categoryName: "",
        categoryImage: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
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

    const handleCreateCategory = async () => {
        try {
            const createdCategory = await createCategory(newCategory);
            console.log("Category created successfully:", createdCategory);
            const updatedCategories = await fetchCategories();
            setCategories(updatedCategories);
            setIsCreateModalVisible(false);
            createForm.resetFields();
            message.success("Category created successfully!");
        } catch (error) {
            console.error("Error creating category:", error);
            setError("Failed to create category");
        }
    };

    const [editForm] = Form.useForm();


    const handleOpenModal = () => {
        setIsUpdateModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsUpdateModalVisible(false);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        editForm.setFieldsValue(category); // Thiết lập giá trị cho form chỉnh sửa
    };

    const handleSaveClick = async () => {
        try {
            const values: EditCategoryForm = await editForm.validateFields(); // Lấy dữ liệu từ form
            await updateCategory(editingCategory!.categoryId, values);
            const updatedCategories = await fetchCategories();
            setCategories(updatedCategories);
            setIsUpdateModalVisible(false);
            message.success("Category updated successfully!");
        } catch (error) {
            console.error("Error updating category:", error);
            setError("Failed to update category");
        }
    };

    const handleDelete = async (categoryId: number) => {
        try {
            await deleteCategory(categoryId);
            const updatedCategories = await fetchCategories();
            setCategories(updatedCategories);
            message.success("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category");
        }
    };
    const columns: TableProps<Category>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (text) => <a style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>{text}</a>,
        },
        {
            title: 'Category Image',
            dataIndex: 'categoryImage',
            key: 'categoryImage',
            render: (categoryImage: string) => <img src={categoryImage} style={{ width: '100px', height: '100px' }} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary">
                        <Link href={`/categories/${record.categoryId}`}>Detail</Link>
                    </Button>
                    {admin?.role === 'super admin' && (
                        <>
                            <Button type="primary" onClick={() => {
                                handleEditClick(record);
                                handleOpenModal();
                            }}>Update</Button>
                            <Popconfirm
                                title="Are you sure to delete this category?"
                                onConfirm={() => handleDelete(record.categoryId)}
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
            <Card title="List categories">
                {admin?.role === 'super admin' && (
                    <>
                        <Button type="primary" onClick={handleOpenCreateModal}>Create Category</Button>
                        <Modal
                            title="Create Category"
                            visible={isCreateModalVisible}
                            onCancel={handleCloseCreateModal}
                            footer={[
                                <Button key="save" type="primary" onClick={handleCreateCategory}>
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
                                    setNewCategory(allValues);
                                }}
                            >
                                <Form.Item
                                    name="categoryName"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter category name' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="categoryImage"
                                    label="Image URL" // Thêm label cho trường URL hình ảnh
                                    rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                )}
                <Table columns={columns} dataSource={categories} />
            </Card>
            <Modal
                title="Edit Category"
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
                        setNewCategory(allValues);
                    }}
                >
                    <Form.Item
                        name="categoryName"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter category name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="categoryImage"
                        label="Image URL" // Thêm label cho trường URL hình ảnh
                        rules={[{ required: true, message: 'Please enter Image URL' }]} // Quy tắc yêu cầu nhập URL
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>


    );
}