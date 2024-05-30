// Trong component Breadcrumb
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface BreadCrumbProps {
  items: string[]; // Thay đổi kiểu dữ liệu của items
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadCrumb;
