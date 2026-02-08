import type { CloudVendor, ProductCategory, CloudProduct, VendorProducts, JSONProduct, JSONProductDocument } from '../types';
import cloudProductsData from '../data/cloudProducts.json';

class DataService {
  private vendors: CloudVendor[];
  private categories: ProductCategory[];
  private products: CloudProduct[];

  constructor() {
    this.vendors = cloudProductsData.vendors;
    this.categories = cloudProductsData.categories;
    // 修复JSON数据类型转换错误
    this.products = cloudProductsData.products.map((product: JSONProduct) => ({
      ...product,
      documents: product.documents.map((doc: JSONProductDocument) => ({
        ...doc,
        type: doc.type as 'guide' | 'api' | 'faq' | 'tutorial' | 'whitepaper'
      }))
    }));
  }

  /**
   * 获取所有云厂商
   */
  getAllVendors(): CloudVendor[] {
    return this.vendors;
  }

  /**
   * 根据ID获取云厂商
   */
  getVendorById(id: string): CloudVendor | undefined {
    return this.vendors.find(vendor => vendor.id === id);
  }

  /**
   * 获取所有产品类别
   */
  getAllCategories(): ProductCategory[] {
    return this.categories;
  }

  /**
   * 根据ID获取产品类别
   */
  getCategoryById(id: string): ProductCategory | undefined {
    const findCategory = (categories: ProductCategory[]): ProductCategory | undefined => {
      for (const category of categories) {
        if (category.id === id) {
          return category;
        }
        if (category.children) {
          const found = findCategory(category.children);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };

    return findCategory(this.categories);
  }

  /**
   * 获取所有云产品
   */
  getAllProducts(): CloudProduct[] {
    return this.products;
  }

  /**
   * 根据厂商ID获取产品
   */
  getProductsByVendorId(vendorId: string): CloudProduct[] {
    return this.products.filter(product => product.vendorId === vendorId);
  }

  /**
   * 根据类别ID获取产品
   */
  getProductsByCategoryId(categoryId: string): CloudProduct[] {
    return this.products.filter(product => product.categoryId === categoryId);
  }

  /**
   * 根据厂商ID和类别ID获取产品
   */
  getProductsByVendorAndCategory(vendorId: string, categoryId: string): CloudProduct[] {
    return this.products.filter(
      product => product.vendorId === vendorId && product.categoryId === categoryId
    );
  }

  /**
   * 根据ID获取产品
   */
  getProductById(id: string): CloudProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * 获取特定厂商的所有产品和类别
   */
  getVendorProducts(vendorId: string): VendorProducts | undefined {
    const vendor = this.getVendorById(vendorId);
    if (!vendor) {
      return undefined;
    }

    const vendorProducts = this.getProductsByVendorId(vendorId);
    const categoryIds = new Set(vendorProducts.map(product => product.categoryId));

    const getCategoriesForProducts = (categories: ProductCategory[]): ProductCategory[] => {
      const result: ProductCategory[] = [];
      
      for (const category of categories) {
        const hasMatchingProducts = categoryIds.has(category.id);
        const children = category.children ? getCategoriesForProducts(category.children) : undefined;
        const hasMatchingChildren = children && children.length > 0;

        if (hasMatchingProducts || hasMatchingChildren) {
          result.push({
            ...category,
            children
          });
        }
      }
      
      return result;
    };

    const relevantCategories = getCategoriesForProducts(this.categories);

    return {
      vendor,
      categories: relevantCategories,
      products: vendorProducts
    };
  }

  /**
   * 搜索产品
   */
  searchProducts(keyword: string): CloudProduct[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerKeyword) ||
      product.description.toLowerCase().includes(lowerKeyword)
    );
  }
}

// 导出单例实例
export const dataService = new DataService();
