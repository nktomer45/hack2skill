import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';

const Cart = ({ 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  totalPrice,
  totalItems,
  onSearch 
}) => {
  const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="card-dashboard rounded-xl p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Product Image */}
        <img 
          src={item.image} 
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
        />
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {item.description}
          </p>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <span className="text-lg font-bold text-primary">
              ${item.price}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 bg-secondary/50 rounded-xl p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="h-10 w-10 p-0 hover:bg-secondary rounded-lg"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-12 text-center text-lg font-semibold">
              {item.quantity}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-10 w-10 p-0 hover:bg-secondary rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        
          {/* Total */}
          <div className="text-left md:text-right min-w-[80px]">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="bg-secondary/30 rounded-full p-8 mb-6">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Looks like you haven't added any products to your cart yet. 
        Start browsing our amazing collection!
      </p>
      <Link to="/">
        <Button className="btn-primary">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );

  const OrderSummary = () => (
    <div className="card-dashboard rounded-xl p-6 sticky top-24">
      <h3 className="text-xl font-semibold text-foreground mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
          <span className="font-medium">${totalPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-success">Free</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">${(parseFloat(totalPrice) * 0.08).toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-primary">
          ${(parseFloat(totalPrice) * 1.08).toFixed(2)}
        </span>
      </div>
      
      <div className="space-y-3">
        <Button className="w-full btn-primary h-12 text-base font-medium">
          <CreditCard className="h-4 w-4 mr-2" />
          Proceed to Checkout
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-primary text-center">
          🚚 Free shipping on orders over $50
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header
        onSearch={onSearch}
        cartCount={totalItems}
        onCartClick={() => {}} 
      />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link 
              to="/" 
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Shopping Cart</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {totalItems > 0 ? (
                    `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
                  ) : (
                    'Your cart is empty'
                  )}
                </p>
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </Badge>
            )}
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;