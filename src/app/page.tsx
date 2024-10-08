'use client'
import { Order, fetchOrders } from '@/api/orderAPI';
import { Payment, fetchPayments } from '@/api/paymentAPI';
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
}

export default function Home() {
  const [orders, setOrders] = useState<ConvertedOrder[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalShipper, setTotalShipper] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [storesIncome, setStoreIncome] = useState(0);
  const [totalStore, setTotalStore] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataOrder = await fetchOrders();
        const convertedOrders: ConvertedOrder[] = dataOrder.map(order => ({
          ...order,
          deliveryTime: parseInt(order.deliveryTime)
        }));
        console.log('Converted Orders: ', convertedOrders);
        setOrders(convertedOrders);
        setTotalOrder(dataOrder.length);
        const total = convertedOrders.reduce((acc, order) => acc + order.deliveryTime, 0);
        setTotalIncome(total * 3000); // 1 đơn vị là 3000 VND

        const dataShipper = await fetchShippers();
        setTotalShipper(dataShipper.length);

        const dataPayment = await fetchPayments();
        setPayments(dataPayment);
        setTotalPayment(dataPayment.length);
        const totalIncomeStore = dataPayment.reduce((acc, payment) => acc + parseInt(payment.totalAmount), 0);
        setStoreIncome(totalIncomeStore);

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
          <Card title={<span style={{ fontSize: '30px' }}>Dashboard of Stores</span>} />
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
                title={<span style={{ fontSize: '20px' }}>Total Payments:</span>}
                value={totalPayment}
                suffix={<DollarCircleOutlined />}
              />
            </div>
          </div>
          <Card title="Store's Income Per Day">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={payments}>
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
};
