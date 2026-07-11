
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import { CloudProduct } from '../types';

const mockProducts: CloudProduct[] = [
  {
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
  },
  {
    id: 'tencent-cos',
    name: '对象存储 COS',
    description: '腾讯云提供的对象存储服务。',
    categoryId: 'storage-object',
    vendorId: 'tencent',
    website: 'https://cloud.tencent.com/product/cos',
    features: ['海量存储', '安全可靠', '低成本'],
    documents: [
      {
        id: 'tencent-cos-guide',
        title: '快速入门指南',
        type: 'guide',
        url: 'https://cloud.tencent.com/document/product/436/11360',
        lastUpdated: '2026-01-01'
      }
    ]
  }
];

describe('ProductList Component', () => {
  test('should render product list with products', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductSelect={() => {}}
      />
    );
    
    expect(screen.getByText('产品列表')).toBeInTheDocument();
    expect(screen.getByText('云服务器 CVM')).toBeInTheDocument();
    expect(screen.getByText('对象存储 COS')).toBeInTheDocument();
  });

  test('should display product features correctly', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductSelect={() => {}}
      />
    );
    
    expect(screen.getByText('弹性扩展')).toBeInTheDocument();
    expect(screen.getByText('高性能')).toBeInTheDocument();
    expect(screen.getAllByText('安全可靠').length).toBe(2);
    expect(screen.getByText('海量存储')).toBeInTheDocument();
    expect(screen.getByText('低成本')).toBeInTheDocument();
  });

  test('should display product documents correctly', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductSelect={() => {}}
      />
    );
    
    expect(screen.getAllByText('快速入门指南').length).toBe(2);
    expect(screen.getByText('API 文档')).toBeInTheDocument();
  });

  test('should call onProductSelect when "文档" button is clicked', () => {
    const mockOnProductSelect = jest.fn();
    
    render(
      <ProductList
        products={mockProducts}
        onProductSelect={mockOnProductSelect}
      />
    );
    
    // 获取所有"文档"按钮
    const viewDocButtons = screen.getAllByText('文档');
    fireEvent.click(viewDocButtons[0]);
    expect(mockOnProductSelect).toHaveBeenCalledWith('tencent-cvm');
    
    fireEvent.click(viewDocButtons[1]);
    expect(mockOnProductSelect).toHaveBeenCalledWith('tencent-cos');
  });

  test('should have correct links to product websites', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductSelect={() => {}}
      />
    );
    
    // 获取所有"官网"按钮
    const officialWebsiteButtons = screen.getAllByText('官网');
    expect(officialWebsiteButtons[0].closest('a')).toHaveAttribute('href', 'https://cloud.tencent.com/product/cvm');
    expect(officialWebsiteButtons[1].closest('a')).toHaveAttribute('href', 'https://cloud.tencent.com/product/cos');
  });
});
