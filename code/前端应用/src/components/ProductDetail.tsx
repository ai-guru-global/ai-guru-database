import React from 'react';
import { Card, Typography, Tag, Space, Button, Divider, Descriptions } from 'antd';
import type { CloudProduct } from '../types';
import { LinkOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ProductDetailProps {
  product: CloudProduct | undefined;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  if (!product) {
    return (
      <div className="product-detail">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          返回列表
        </Button>
        <br />
        <br />
        <Card>
          <Title level={4}>产品不存在</Title>
        </Card>
      </div>
    );
  }

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

  const getDocumentTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      guide: 'blue',
      api: 'green',
      faq: 'orange',
      tutorial: 'purple',
      whitepaper: 'red'
    };
    return colorMap[type] || 'default';
  };

  return (
    <div className="product-detail">
      <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 16, border: '1px solid #d9d9d9' }}>
        返回列表
      </Button>
      
      <Card
        title={product.name}
        extra={
          <a href={product.website} target="_blank" rel="noopener noreferrer">
            <Button size="small">
              官网
            </Button>
          </a>
        }
        bordered
        style={{ borderRadius: 4, border: '1px solid #d9d9d9' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {product.description}
          </Text>
        </div>

        <Descriptions column={2} size="small">
          <Descriptions.Item label="类别">{product.categoryId ? product.categoryId.split('-').join(' ') : '未分类'}</Descriptions.Item>
          <Descriptions.Item label="官网">
            <a href={product.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
              {product.website} <LinkOutlined style={{ fontSize: 12 }} />
            </a>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>产品特性:</Text>
          <Space wrap size="small">
            {product.features.map((feature, index) => (
              <Tag key={index} color="blue">{feature}</Tag>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: '16px 0' }} />
        
        <div>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>相关文档:</Text>
          {product.documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{doc.title}</div>
                <Space size="small">
                  <Tag color={getDocumentTypeColor(doc.type)}>
                    {getDocumentTypeLabel(doc.type)}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {doc.lastUpdated}
                  </Text>
                </Space>
              </div>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1890ff' }}>
                查看 <LinkOutlined style={{ fontSize: 12 }} />
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
