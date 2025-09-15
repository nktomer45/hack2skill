const categories = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 
  'Beauty', 'Automotive', 'Toys', 'Food', 'Health'
];

const productNames = [
  'Wireless Headphones', 'Smart Watch', 'Gaming Mouse', 'Laptop Stand',
  'Coffee Maker', 'Bluetooth Speaker', 'Phone Case', 'Keyboard',
  'Monitor', 'Desk Lamp', 'Tablet', 'Camera', 'Printer', 'Router',
  'Power Bank', 'USB Cable', 'Hard Drive', 'Webcam', 'Microphone',
  'Fitness Tracker', 'Smartwatch', 'Air Purifier', 'Vacuum Cleaner'
];

const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const generateMockProducts = (count = 1000) => {
  const products = [];
  const productMap = new Map();
  const categorySet = new Set(categories);
  
  for (let i = 1; i <= count; i++) {
    const category = getRandomItem(categories);
    const baseName = getRandomItem(productNames);
    const name = `${baseName} ${category} Pro ${i}`;
    const price = Math.floor(Math.random() * 500) + 10;
    const stock = Math.floor(Math.random() * 100);
    const status = stock > 20 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock';
    
    const product = {
      id: i,
      name,
      category,
      price,
      stock,
      status,
      image: `https://picsum.photos/100/100?random=${i}`,
      description: `High-quality ${name.toLowerCase()} with premium features and excellent performance.`,
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString()
    };
    
    products.push(product);
    productMap.set(i, product);
  }
  
  return { products, productMap, categorySet };
};

const searchProducts = (query, products) => {
  if (!query || query.length < 2) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.status.toLowerCase().includes(lowerQuery)
  );
};

const paginateData = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: data.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(data.length / limit),
    totalItems: data.length,
    hasNext: endIndex < data.length,
    hasPrev: page > 1
  };
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export { 
  generateMockProducts, 
  searchProducts, 
  paginateData, 
  debounce,
  categories,
  statuses 
};