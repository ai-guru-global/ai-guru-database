import React from 'react';
import { Card, Col, Typography, Tag, Space, Button } from 'antd';
import type { CloudProduct } from '../types';
import { LinkOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


interface ProductListProps {
  products: CloudProduct[];
  onProductSelect: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  const getDocumentTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      guide: '指南',
      api: 'API文档',
      faq: '常见问题',
      tutorial: '教程',
      whitepaper: '白皮书'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="product-list">
      <Title level={4} style={{ marginBottom: 16 }}>产品列表</Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-8px' }}>
        {products.map(product => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} style={{ padding: '8px' }}>
              <Card
                title={product.name}
                extra={
                  <Space size="small">
                    <Button
                      type="primary"
                      icon={<BookOutlined />}
                      onClick={() => onProductSelect(product.id)}
                      size="small"
                    >
                      文档
                    </Button>
                    <Button
                      icon={<LinkOutlined />}
                      href={product.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                    >
                      官网
                    </Button>
                  </Space>
                }
                hoverable
                style={{ 
                  borderRadius: 4, 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #f0f0f0'
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Text type="secondary" style={{ fontSize: 13 }}>{product.description}</Text>
                <br />
                <br />
                <Space wrap size="small">
                  {product.features.map((feature, index) => (
                    <Tag key={index} color="blue">{feature}</Tag>
                  ))}
                </Space>
                <br />
                <br />
                <Text strong style={{ fontSize: 13 }}>文档:</Text>
              <div style={{ paddingLeft: 12, marginTop: 8 }}>
                {product.documents.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12 }}>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 2 }}>{doc.title}</div>
                      <Space size="small">
                        <Tag color="green">{getDocumentTypeLabel(doc.type)}</Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>{doc.lastUpdated}</Text>
                      </Space>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                      查看
                    </a>
                  </div>
                ))}
              </div>
              </Card>
            </Col>
          ))}
      </div>
    </div>
  );
};

export default ProductList;
