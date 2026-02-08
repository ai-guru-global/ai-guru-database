import { dataService } from './dataService';

describe('DataService', () => {
  describe('getAllVendors', () => {
    test('should return all vendors', () => {
      const vendors = dataService.getAllVendors();
      expect(vendors).toBeInstanceOf(Array);
      expect(vendors.length).toBeGreaterThan(0);
      expect(vendors[0]).toHaveProperty('id');
      expect(vendors[0]).toHaveProperty('name');
    });
  });

  describe('getVendorById', () => {
    test('should return vendor by id', () => {
      const vendor = dataService.getVendorById('tencent');
      expect(vendor).toBeDefined();
      expect(vendor?.id).toBe('tencent');
      expect(vendor?.name).toBe('腾讯云');
    });

    test('should return undefined for non-existent vendor', () => {
      const vendor = dataService.getVendorById('non-existent');
      expect(vendor).toBeUndefined();
    });
  });

  describe('getAllCategories', () => {
    test('should return all categories', () => {
      const categories = dataService.getAllCategories();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
    });
  });

  describe('getCategoryById', () => {
    test('should return category by id', () => {
      const category = dataService.getCategoryById('compute');
      expect(category).toBeDefined();
      expect(category?.id).toBe('compute');
      expect(category?.name).toBe('计算');
    });

    test('should return undefined for non-existent category', () => {
      const category = dataService.getCategoryById('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('getAllProducts', () => {
    test('should return all products', () => {
      const products = dataService.getAllProducts();
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('documents');
      expect(products[0].documents).toBeInstanceOf(Array);
    });
  });

  describe('getProductsByVendorId', () => {
    test('should return products by vendor id', () => {
      const products = dataService.getProductsByVendorId('tencent');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      products.forEach(product => {
        expect(product.vendorId).toBe('tencent');
      });
    });

    test('should return empty array for non-existent vendor', () => {
      const products = dataService.getProductsByVendorId('non-existent');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(0);
    });
  });

  describe('getProductsByCategoryId', () => {
    test('should return products by category id', () => {
      const products = dataService.getProductsByCategoryId('compute-vm');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      products.forEach(product => {
        expect(product.categoryId).toBe('compute-vm');
      });
    });

    test('should return empty array for non-existent category', () => {
      const products = dataService.getProductsByCategoryId('non-existent');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(0);
    });
  });

  describe('getProductsByVendorAndCategory', () => {
    test('should return products by vendor and category', () => {
      const products = dataService.getProductsByVendorAndCategory('tencent', 'compute-vm');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      products.forEach(product => {
        expect(product.vendorId).toBe('tencent');
        expect(product.categoryId).toBe('compute-vm');
      });
    });

    test('should return empty array for non-existent combination', () => {
      const products = dataService.getProductsByVendorAndCategory('tencent', 'non-existent');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(0);
    });
  });

  describe('getProductById', () => {
    test('should return product by id', () => {
      const product = dataService.getProductById('tencent-cvm');
      expect(product).toBeDefined();
      expect(product?.id).toBe('tencent-cvm');
      expect(product?.name).toBe('云服务器 CVM');
    });

    test('should return undefined for non-existent product', () => {
      const product = dataService.getProductById('non-existent');
      expect(product).toBeUndefined();
    });
  });

  describe('getVendorProducts', () => {
    test('should return vendor products and categories', () => {
      const vendorProducts = dataService.getVendorProducts('tencent');
      expect(vendorProducts).toBeDefined();
      expect(vendorProducts?.vendor).toBeDefined();
      expect(vendorProducts?.categories).toBeInstanceOf(Array);
      expect(vendorProducts?.products).toBeInstanceOf(Array);
      expect(vendorProducts?.products.length).toBeGreaterThan(0);
    });

    test('should return undefined for non-existent vendor', () => {
      const vendorProducts = dataService.getVendorProducts('non-existent');
      expect(vendorProducts).toBeUndefined();
    });
  });

  describe('searchProducts', () => {
    test('should return products matching keyword', () => {
      const products = dataService.searchProducts('云服务器');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
      products.forEach(product => {
        expect(product.name.toLowerCase()).toContain('云服务器'.toLowerCase());
      });
    });

    test('should return empty array for non-matching keyword', () => {
      const products = dataService.searchProducts('non-matching-keyword');
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(0);
    });

    test('should return all products for empty keyword', () => {
      const products = dataService.searchProducts('');
      const allProducts = dataService.getAllProducts();
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(allProducts.length);
    });
  });
});
