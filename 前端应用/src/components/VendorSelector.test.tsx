import { render, screen, fireEvent } from '@testing-library/react';
import VendorSelector from './VendorSelector';
import { CloudVendor } from '../types';

const mockVendors: CloudVendor[] = [
  {
    id: 'tencent',
    name: '腾讯云',
    logo: 'https://imgcache.qq.com/qcloud/tcloud_logo/ico/favicon.ico',
    description: '腾讯云是腾讯公司旗下的云计算服务平台',
    website: 'https://cloud.tencent.com/'
  },
  {
    id: 'aliyun',
    name: '阿里云',
    logo: 'https://www.aliyun.com/favicon.ico',
    description: '阿里云是阿里巴巴集团旗下的云计算服务平台',
    website: 'https://www.aliyun.com/'
  }
];

describe('VendorSelector Component', () => {
  test('should render vendor selector with vendors', () => {
    render(
      <VendorSelector
        vendors={mockVendors}
        selectedVendorId={null}
        onVendorChange={() => {}}
      />
    );
    
    expect(screen.getByText('云厂商')).toBeInTheDocument();
    expect(screen.getByText('腾讯云')).toBeInTheDocument();
    expect(screen.getByText('阿里云')).toBeInTheDocument();
  });

  test('should call onVendorChange when vendor is selected', () => {
    const mockOnVendorChange = jest.fn();
    
    render(
      <VendorSelector
        vendors={mockVendors}
        selectedVendorId={null}
        onVendorChange={mockOnVendorChange}
      />
    );
    
    fireEvent.click(screen.getByText('腾讯云'));
    expect(mockOnVendorChange).toHaveBeenCalledWith('tencent');
    
    fireEvent.click(screen.getByText('阿里云'));
    expect(mockOnVendorChange).toHaveBeenCalledWith('aliyun');
  });

  test('should display selected vendor correctly', () => {
    render(
      <VendorSelector
        vendors={mockVendors}
        selectedVendorId='tencent'
        onVendorChange={() => {}}
      />
    );
    
    // 在Ant Design的Radio组件中，选中的选项会有ant-radio-checked类
    const tencentRadio = screen.getByText('腾讯云').closest('.ant-radio-button-wrapper');
    expect(tencentRadio).toHaveClass('ant-radio-button-wrapper-checked');
    
    const aliyunRadio = screen.getByText('阿里云').closest('.ant-radio-button-wrapper');
    expect(aliyunRadio).not.toHaveClass('ant-radio-button-wrapper-checked');
  });
});
