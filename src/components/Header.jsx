import { useState } from 'react';
import { Search, ShoppingCart, User, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = ({ onSearch, cartCount, onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="bg-white border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">ProductHub</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Link to="/cart">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;