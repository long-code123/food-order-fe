'use client'
import { Order, fetchOrders } from '@/api/orderAPI';
import { fetchShippers } from '@/api/shipperAPI';
import { fetchStores } from '@/api/storeAPI';
import { useAuth } from '@/components/authProvider/authProvider';
import AppLayout from '@/components/layout';
import { DollarCircleOutlined, FileDoneOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Table, Card, Statistic, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Column } = Table;
const { TabPane } = Tabs;

interface ConvertedOrder extends Omit<Order, 'deliveryTime'> {
  deliveryTime: number;
  totalAmount: number;
}

export default function Home() {
  const [orders, setOrders] = useState<ConvertedOrder[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalShipper, setTotalShipper] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [storesIncome, setStoreIncome] = useState(0);
  const [totalStore, setTotalStore] = useState(0);
  const [storeIncomeData, setStoreIncomeData] = useState<any[]>([]);

  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataOrder = await fetchOrders();
        const convertedOrders: ConvertedOrder[] = dataOrder.map(order => {
          const totalAmount = order.items.reduce(
            (acc, item) => acc + item.food.price * item.quantity, 
            0
          );
          const deliveryTime = parseInt(order.deliveryTime); // Chuyển đổi thành số nguyên nếu cần
          console.log("Delivery Time:", deliveryTime); // In ra giá trị deliveryTime của từng đơn hàng
          return {
            ...order,
            deliveryTime: parseInt(order.deliveryTime),
            totalAmount
          };

        });
        
        setOrders(convertedOrders);
        setTotalOrder(dataOrder.length);
        const total = convertedOrders.reduce((acc, order) => acc + order.deliveryTime, 0);
        setTotalIncome(total * 3000);

        const dataShipper = await fetchShippers();
        setTotalShipper(dataShipper.length);

        const storeIncome = convertedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        setStoreIncome(Math.floor(storeIncome * 24000));

        // Chuẩn bị dữ liệu cho biểu đồ thu nhập của cửa hàng
        const incomeData = convertedOrders.map(order => ({
          createdAt: order.createdAt,
          totalAmount: order.totalAmount,
        }));
        setStoreIncomeData(incomeData);

        const dataStore = await fetchStores();
        setTotalStore(dataStore.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <AppLayout activeMenuKey='dashboard'>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Dashboard of Shippers" key="1">
          <Card title={<span style={{ fontSize: '30px' }}>Dashboard of Shippers</span>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '100px', marginRight: '100px' }}>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Income:</span>}
                  value={totalIncome}
                  suffix="VND"
                />
              </div>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Shippers:</span>}
                  value={totalShipper}
                  suffix={<UserOutlined />}
                />
              </div>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Orders:</span>}
                  value={totalOrder}
                  suffix={<FileDoneOutlined />}
                />
              </div>
            </div>
          </Card>
          <Card title="Shipper's Income Per Day">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(tickItem) => {
                    const date = new Date(tickItem);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    return formattedDate;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deliveryTime" stroke="#dc143c" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
        <TabPane tab="Dashboard of Stores" key="2">
          <Card title={<span style={{ fontSize: '30px' }}>Dashboard of Stores</span>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '100px', marginRight: '100px' }}>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Income:</span>}
                  value={storesIncome}
                  suffix="VND"
                />
              </div>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Stores:</span>}
                  value={totalStore}
                  suffix={<HomeOutlined />}
                />
              </div>
              <div>
                <Statistic
                  title={<span style={{ fontSize: '20px' }}>Total Orders:</span>}
                  value={totalOrder}
                  suffix={<DollarCircleOutlined />}
                />
              </div>
            </div>
          </Card>
          <Card title="Store's Income Per Day">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={storeIncomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(tickItem) => {
                    const date = new Date(tickItem);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                    return formattedDate;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalAmount" stroke="#ff7f0e" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
      </Tabs>
    </AppLayout>
  );
}
