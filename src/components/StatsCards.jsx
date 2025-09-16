import { Package, DollarSign, AlertTriangle, Layers } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600', 
    warning: 'bg-orange-100 text-orange-600',
    destructive: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2 mb-1">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={`text-xs font-medium ${
                trend.positive 
                  ? 'text-success' 
                  : 'text-destructive'
              }`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ products }) => {
  
  const totalProducts = products.length;
  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockItems = products.filter(product => product.stock < 20).length;
  const categories = [...new Set(products.map(product => product.category))].length;
  const inStockItems = products.filter(product => product.status === 'In Stock').length;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      subtitle: `${inStockItems} in stock`,
      icon: Package,
      color: 'primary',
      trend: { positive: true, value: 12.5 }
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      subtitle: 'Estimated value',
      icon: DollarSign,
      color: 'success',
      trend: { positive: true, value: 8.3 }
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.toString(),
      subtitle: 'Need attention',
      icon: AlertTriangle,
      color: 'warning',
      trend: { positive: false, value: 2.1 }
    },
    {
      title: 'Categories',
      value: categories.toString(),
      subtitle: 'Product types',
      icon: Layers,
      color: 'primary',
      trend: { positive: true, value: 5.0 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>

  );
};

export default StatsCards;