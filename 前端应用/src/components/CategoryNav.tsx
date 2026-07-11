import React from 'react';
import { Tree, Typography } from 'antd';
import type { ProductCategory } from '../types';

const { Title } = Typography;

interface CategoryNavProps {
  categories: ProductCategory[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange
}) => {
  interface TreeDataNode {
    title: string;
    key: string;
    children?: TreeDataNode[];
  }

  const generateTreeData = (categories: ProductCategory[]): TreeDataNode[] => {
    return categories.map(category => {
      const node: TreeDataNode = {
        title: category.name,
        key: category.id
      };
      
      if (category.children && category.children.length > 0) {
        node.children = generateTreeData(category.children);
      }
      
      return node;
    });
  };

  const treeData = generateTreeData(categories);

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>产品类别</Title>
      <Tree
        defaultExpandAll
        selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
        onSelect={(_, info) => {
          onCategoryChange(info.node.key as string | null);
        }}
        treeData={treeData}
      />
    </div>
  );
};

export default CategoryNav;
