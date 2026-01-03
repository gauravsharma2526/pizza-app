import React, { useState, useMemo } from 'react';
import { 
  Package, Clock, CheckCircle, ChefHat, Truck, ShoppingBag, Receipt, TrendingUp,
  ChevronDown, ChevronUp, Percent, CreditCard, CalendarDays, Pizza
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectAllOrders } from '../store/selectors';
import { Card, Button } from '../components/ui';
import { HeroSection } from '../components/layout';
import { FALLBACK_IMAGE } from '../constants';
import type { Order } from '../types';

const ORDERS_PER_PAGE = 5;

/**
 * Orders page showing complete order history
 */
export const Orders: React.FC = () => {
  const orders = useAppSelector(selectAllOrders);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ORDERS_PER_PAGE);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Toggle order expansion
  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Get visible orders (for pagination)
  const reversedOrders = useMemo(() => [...orders].reverse(), [orders]);
  const visibleOrders = reversedOrders.slice(0, visibleCount);
  const hasMoreOrders = visibleCount < orders.length;

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'ready':
        return <Package className="w-5 h-5" />;
      case 'delivered':
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'preparing':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'ready':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'delivered':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSaved = orders.reduce((sum, order) => sum + order.totalDiscount, 0);
  const totalPizzas = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const heroBadges = [
    { icon: <Receipt className="w-4 h-4" />, text: `${orders.length} Orders Placed` },
    { icon: <TrendingUp className="w-4 h-4" />, text: `$${totalSpent.toFixed(2)} Total Spent` },
  ];

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        theme="secondary"
        subtitle="Your Orders"
        title="Order History"
        description="Track your pizza journey and revisit all your delicious orders. Every slice tells a story!"
        badges={heroBadges}
        backTo="/menu"
        backLabel="Back to Menu"
      />

      <div className="page-container py-8">

      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mx-auto w-fit mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You haven't placed any orders yet. Head to the menu and order some delicious pizzas!
          </p>
          <Link to="/menu">
            <Button variant="primary">Browse Menu</Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-bl-[4rem] -mr-4 -mt-4" />
              <div className="relative">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                  <Receipt className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Orders</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 rounded-bl-[4rem] -mr-4 -mt-4" />
              <div className="relative">
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Spent</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${totalSpent.toFixed(0)}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 rounded-bl-[4rem] -mr-4 -mt-4" />
              <div className="relative">
                <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400 mb-2">
                  <Percent className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Saved</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${totalSaved.toFixed(0)}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-bl-[4rem] -mr-4 -mt-4" />
              <div className="relative">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                  <Pizza className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Pizzas</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalPizzas}
                </div>
              </div>
            </Card>
          </div>

          {/* Orders list header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-400" />
              Recent Orders
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {visibleOrders.length} of {orders.length}
            </span>
          </div>

          {/* Collapsible Orders list */}
          <div className="space-y-4">
            {visibleOrders.map((order, index) => {
              const isExpanded = expandedOrders.has(order.id);
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              
              return (
                <Card
                  key={order.id}
                  className="animate-slide-up opacity-0 overflow-hidden"
                  style={{ 
                    animationDelay: `${Math.min(index * 0.05, 0.3)}s`, 
                    animationFillMode: 'forwards' 
                  }}
                >
                  {/* Collapsible Order Header - Always visible */}
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full flex items-center justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 -m-4 p-4 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Order thumbnail - show first pizza image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={imageErrors[order.items[0]?.pizza.id] ? FALLBACK_IMAGE : order.items[0]?.pizza.imageUrl}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [order.items[0]?.pizza.id]: true }))}
                        />
                        {itemCount > 1 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </div>
                      
                      {/* Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                            {getRelativeTime(order.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {order.items.map(i => i.pizza.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Right side - Status, Total, Expand */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div
                        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </div>
                        {order.totalDiscount > 0 && (
                          <div className="text-xs text-accent-600 dark:text-accent-400">
                            Saved ${order.totalDiscount.toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-1 rounded-full bg-gray-100 dark:bg-gray-800 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
                      {/* Full date */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {formatDate(order.createdAt)}
                      </p>

                      {/* Mobile status badge */}
                      <div
                        className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>

                      {/* Order items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                          <div
                            key={item.pizza.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                          >
                            <img
                              src={imageErrors[item.pizza.id] ? FALLBACK_IMAGE : item.pizza.imageUrl}
                              alt={item.pizza.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={() => setImageErrors(prev => ({ ...prev, [item.pizza.id]: true }))}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {item.pizza.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ${item.pizza.price.toFixed(2)} × {item.quantity}
                              </p>
                              {item.discountAmount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-accent-600 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/30 px-1.5 py-0.5 rounded-full mt-1">
                                  <Percent className="w-2.5 h-2.5" />
                                  10% discount
                                </span>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              {item.discountAmount > 0 && (
                                <p className="text-xs text-gray-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </p>
                              )}
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                ${item.finalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order summary */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                          <span className="text-gray-900 dark:text-white">
                            ${order.subtotal.toFixed(2)}
                          </span>
                        </div>
                        {order.totalDiscount > 0 && (
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-accent-600 dark:text-accent-400 flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              Bulk Discount
                            </span>
                            <span className="text-accent-600 dark:text-accent-400 font-medium">
                              -${order.totalDiscount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="font-semibold text-gray-900 dark:text-white">Total Paid</span>
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMoreOrders && (
            <div className="mt-8 text-center">
              <Button
                variant="secondary"
                onClick={() => setVisibleCount(prev => prev + ORDERS_PER_PAGE)}
                className="px-8"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Orders ({orders.length - visibleCount} remaining)
              </Button>
            </div>
          )}

          {/* Expand All / Collapse All */}
          {orders.length > 1 && (
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setExpandedOrders(new Set(orders.map(o => o.id)))}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
              >
                <ChevronDown className="w-4 h-4" />
                Expand All
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={() => setExpandedOrders(new Set())}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
              >
                <ChevronUp className="w-4 h-4" />
                Collapse All
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Orders;
