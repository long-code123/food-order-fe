'use client'
import { Admin, fetchAdminInfo } from '@/api/adminAPI';
import { Order, fetchOrderByShipper } from '@/api/orderAPI';
import { Reviewshipper, deleteReviewshipper, fetchReviewByShipper } from '@/api/reviewshipperAPI';
import { fetchShippers } from '@/api/shipperAPI';
import BreadCrumb from '@/components/breadcrumb';
import AppLayout from '@/components/layout';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Statistic, Table, TableProps, message } from 'antd';
import { useEffect, useState } from 'react';


const ViewDetailShipper = ({ params }: { params: { id: string } }) => {
    const [reviewshippers, setReviewshippers] = useState<Reviewshipper[]>([]);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [selectedShipperName, setSelectedShiperName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [shipperEarning, setShipperEarning] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const shipperId = parseInt(params.id);
                const fetchReview = await fetchReviewByShipper(shipperId);
                setReviewshippers(fetchReview);
                const totalRating = fetchReview.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
                const average = totalRating / fetchReview.length;
                setAverageRating(average);
                const dataAdmin = await fetchAdminInfo();
                setAdmin(dataAdmin);
                const ordersData = await fetchOrderByShipper(shipperId);
                setOrders(ordersData);
                const totalDeliveryTime = ordersData.reduce((acc, curr) => acc + parseInt(curr.deliveryTime), 0);
                const totalEarning = totalDeliveryTime * 1000;
                setShipperEarning(totalEarning);
                setTotalOrders(ordersData.length);

                const dataShipper = await fetchShippers();
                const selectedShipper = dataShipper.find(shipper => shipper.shipperId === shipperId)
                if (selectedShipper) {
                    setSelectedShiperName(selectedShipper.shipperName)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchdata();
    }, [params.id]);

    const handleDelete = async (Id: number) => {
        try {
            await deleteReviewshipper(Id);
            const updatedShippers = reviewshippers.filter((reviewshippers) => reviewshippers.id !== Id); // Loại bỏ food đã xóa khỏi danh sách
            setReviewshippers(updatedShippers);
            message.success("Review deleted successfully!");
        } catch (error) {
            console.error("Error deleting food:", error);
            setError("Failed to delete food");
        }
    };

    const columns: TableProps<Reviewshipper>['columns'] = [
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

    return (
        <AppLayout activeMenuKey='shippers'>
            <BreadCrumb items={[selectedShipperName, 'Detail']} />
            <Card title="Infomation">
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
                            Shipper Earning
                        </div>
                        <Statistic title="" value={shipperEarning} suffix="VND" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                            Total Orders
                        </div>
                        <Statistic title="" value={totalOrders} />
                    </div>
                </div>

                <Table columns={columns} dataSource={reviewshippers} pagination={{ pageSize: 5 }} />
            </Card>
        </AppLayout>
    )
}

export default ViewDetailShipper;
