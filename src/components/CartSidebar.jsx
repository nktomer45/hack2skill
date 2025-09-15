import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  totalPrice,
  totalItems 
}) => {
  if (!isOpen) return null;

  const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex items-center space-x-3 p-4 border-b border-border/40 last:border-b-0">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground truncate">
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground">
          ${item.price} each
        </p>
        <Badge variant="secondary" className="text-xs">
          {item.category}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1 bg-secondary/50 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="h-8 w-8 p-0 hover:bg-secondary"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-8 w-8 p-0 hover:bg-secondary"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
      <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
      <p className="text-sm text-muted-foreground">
        Add some products to get started
      </p>
    </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Shopping Cart
            </h2>
            {totalItems > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-border/60 bg-gradient-to-r from-secondary/30 to-transparent p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-foreground">
                Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
              <span className="text-xl font-bold text-primary">
                ${totalPrice}
              </span>
            </div>
            
            <Button 
              className="w-full btn-primary h-12 text-base font-medium"
              onClick={() => {
                console.log('Proceeding to checkout...');
              }}
            >
              Proceed to Checkout
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;