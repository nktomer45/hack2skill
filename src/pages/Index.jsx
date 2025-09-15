import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import ProductTable from '@/components/ProductTable';
import CartSidebar from '@/components/CartSidebar';
import EditProductDialog from '@/components/EditProductDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { 
  generateMockProducts, 
  searchProducts, 
  paginateData, 
  debounce 
} from '@/utils/mockData';

const ITEMS_PER_PAGE = 10;

const Index = ({
  cartItems,
  isCartOpen,
  addToCart,
  updateQuantity,
  removeFromCart,
  toggleCart,
  setIsCartOpen,
  totalItems,
  totalPrice
}) => {
  const { toast } = useToast();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { products } = generateMockProducts(1000);
      setAllProducts(products);
      setFilteredProducts(products);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((query) => {
      const results = searchProducts(query, allProducts);
      setFilteredProducts(results);
      setCurrentPage(1); 
    }, 300),
    [allProducts]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 1000,
    });
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    const updatedProducts = allProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setAllProducts(updatedProducts);
    
    const updatedFiltered = filteredProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setFilteredProducts(updatedFiltered);
    
    toast({
      title: "Product updated",
      description: `${updatedProduct.name} has been updated successfully.`,
      duration: 2000,
    });
  };

  const handleDeleteProduct = (product) => {
    setDeleteProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (product) => {
    const updatedProducts = allProducts.filter(p => p.id !== product.id);
    setAllProducts(updatedProducts);
    
    const updatedFiltered = filteredProducts.filter(p => p.id !== product.id);
    setFilteredProducts(updatedFiltered);
    
    toast({
      title: "Product deleted",
      description: `${product.name} has been deleted successfully.`,
      duration: 2000,
    });
  };

  const paginatedData = useMemo(() => {
    return paginateData(filteredProducts, currentPage, ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          cartCount={totalItems}
          onMenuClick={() => {}}
        />

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <div>
          <div className="mb-6">
            <StatsCards products={allProducts} />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}{filteredProducts.length > ITEMS_PER_PAGE ? `-${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}` : ''} of {filteredProducts.length} products
            </div>
          </div>

          <ProductTable
            products={paginatedData.data}
            currentPage={paginatedData.currentPage}
            totalPages={paginatedData.totalPages}
            onPageChange={handlePageChange}
            onAddToCart={handleAddToCart}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilteredProducts(allProducts);
                  setCurrentPage(1);
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
        totalItems={totalItems}
      />

      <EditProductDialog
        product={editProduct}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmDialog
        product={deleteProduct}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteProduct(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;