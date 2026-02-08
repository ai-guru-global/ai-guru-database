
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetail from './ProductDetail';
import { CloudProduct } from '../types';

const mockProduct: CloudProduct = {
  id: 'tencent-cvm',
  name: '云服务器 CVM',
  description: '腾讯云提供的弹性计算服务。',
  categoryId: 'compute-vm',
  vendorId: 'tencent',
  website: 'https://cloud.tencent.com/product/cvm',
  features: ['弹性扩展', '高性能', '安全可靠'],
  documents: [
    {
      id: 'tencent-cvm-guide',
      title: '快速入门指南',
      type: 'guide',
      url: 'https://cloud.tencent.com/document/product/213/36308',
      lastUpdated: '2026-01-01'
    },
    {
      id: 'tencent-cvm-api',
      title: 'API 文档',
      type: 'api',
      url: 'https://cloud.tencent.com/document/api/213/15730',
      lastUpdated: '2026-01-01'
    }
  ]
};

describe('ProductDetail Component', () => {
  test('should render product detail when product is provided', () => {
    render(
      <ProductDetail
        product={mockProduct}
        onBack={() => {}}
      />
    );
    
    expect(screen.getByText('云服务器 CVM')).toBeInTheDocument();
    expect(screen.getByText('腾讯云提供的弹性计算服务。')).toBeInTheDocument();
    expect(screen.getByText('返回列表')).toBeInTheDocument();
  });

  test('should render "产品不存在" when product is undefined', () => {
    render(
      <ProductDetail
        product={undefined}
        onBack={() => {}}
      />
    );
    
    expect(screen.getByText('产品不存在')).toBeInTheDocument();
    expect(screen.getByText('返回列表')).toBeInTheDocument();
  });

  test('should display product features correctly', () => {
    render(
      <ProductDetail
        product={mockProduct}
        onBack={() => {}}
      />
    );
    
    expect(screen.getByText('弹性扩展')).toBeInTheDocument();
    expect(screen.getByText('高性能')).toBeInTheDocument();
    expect(screen.getByText('安全可靠')).toBeInTheDocument();
  });

  test('should display product documents correctly', () => {
    render(
      <ProductDetail
        product={mockProduct}
        onBack={() => {}}
      />
    );
    
    expect(screen.getByText('快速入门指南')).toBeInTheDocument();
    expect(screen.getByText('API 文档')).toBeInTheDocument();
    expect(screen.getAllByText('查看').length).toBe(2);
  });

  test('should have correct link to product website', () => {
    render(
      <ProductDetail
        product={mockProduct}
        onBack={() => {}}
      />
    );
    
    // 查找所有链接
    const links = screen.getAllByRole('link');
    // 检查是否有链接的href属性是正确的产品官网地址
    const hasCorrectLink = links.some(link => 
      link.getAttribute('href') === 'https://cloud.tencent.com/product/cvm'
    );
    expect(hasCorrectLink).toBe(true);
  });

  test('should call onBack when "返回列表" button is clicked', () => {
    const mockOnBack = jest.fn();
    
    render(
      <ProductDetail
        product={mockProduct}
        onBack={mockOnBack}
      />
    );
    
    fireEvent.click(screen.getByText('返回列表'));
    expect(mockOnBack).toHaveBeenCalled();
  });
});
