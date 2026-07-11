import React, { useState, useMemo } from 'react';
import { Layout, Typography, Input } from 'antd';
import { dataService } from '../services/dataService';

import VendorSelector from '../components/VendorSelector';
import CategoryNav from '../components/CategoryNav';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;

const DocumentCenter: React.FC = () => {
  // 加载数据
  const allVendors = dataService.getAllVendors();
  const allCategories = dataService.getAllCategories();
  const initialProducts = dataService.getAllProducts();

  // 状态管理
  const vendors = allVendors;
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(
    allVendors.length > 0 ? allVendors[0].id : null
  );
  const categories = allCategories;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const allProducts = initialProducts;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 根据厂商和类别过滤产品
  const filteredByVendorAndCategory = useMemo(() => {
    return allProducts.filter(product => {
      const matchesVendor = !selectedVendorId || product.vendorId === selectedVendorId;
      const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
      return matchesVendor && matchesCategory;
    });
  }, [allProducts, selectedVendorId, selectedCategoryId]);

  // 根据搜索关键词过滤产品
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return filteredByVendorAndCategory;
    }
    return dataService.searchProducts(searchTerm);
  }, [filteredByVendorAndCategory, searchTerm]);

  // 当选择的产品变化时，更新产品详情
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return undefined;
    return dataService.getProductById(selectedProductId);
  }, [selectedProductId]);

  // 处理厂商选择
  const handleVendorChange = (vendorId: string) => {
    setSelectedVendorId(vendorId);
  };

  // 处理类别选择
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // 处理产品选择
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  // 处理返回列表
  const handleBackToList = () => {
    setSelectedProductId(null);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 40px', 
        borderBottom: '1px solid #f0f0f0', 
        position: 'fixed', 
        width: '100%', 
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={2} style={{ margin: '0', color: '#1890ff', fontWeight: 500 }}>
            CloudMaster
          </Title>
        </div>
        <div style={{ width: '300px' }}>
          <Search
            placeholder="搜索产品"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            style={{ border: '1px solid #d9d9d9' }}
          />
        </div>
      </Header>
      <Layout style={{ padding: '64px 0 0', minHeight: '100vh' }}>
        <Sider width={140} style={{ background: '#fff', padding: '16px', borderRight: '1px solid #f0f0f0' }}>
          <VendorSelector
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            onVendorChange={handleVendorChange}
          />
        </Sider>
        <Sider width={140} style={{ background: '#fff', padding: '16px', borderRight: '1px solid #f0f0f0' }}>
          <CategoryNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </Sider>
        <Content style={{ padding: '16px 24px', background: '#fff', overflow: 'auto' }}>
          {selectedProductId ? (
            <ProductDetail
              product={selectedProduct}
              onBack={handleBackToList}
            />
          ) : (
            <ProductList
              products={filteredProducts}
              onProductSelect={handleProductSelect}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DocumentCenter;
