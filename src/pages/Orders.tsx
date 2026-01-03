import React from 'react';
import { Package, Clock, CheckCircle, ChefHat, Truck, ShoppingBag, Receipt, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectAllOrders } from '../store/selectors';
import { Card, Button } from '../components/ui';
import { HeroSection } from '../components/layout';
import type { Order } from '../types';

/**
 * Orders page showing complete order history
 */
export const Orders: React.FC = () => {
  const orders = useAppSelector(selectAllOrders);

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

  const heroBadges = [
    { icon: <Receipt className="w-4 h-4" />, text: `${orders.length} Orders Placed` },
    { icon: <TrendingUp className="w-4 h-4" />, text: `$${totalSpent.toFixed(2)} Total Spent` },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        theme="secondary"
        subtitle="Your Orders"
        title="Order History"
        description="Track your pizza journey and revisit all your delicious orders. Every slice tells a story!"
        badges={heroBadges}
        backTo="/"
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
          <Link to="/">
            <Button variant="primary">Browse Menu</Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {orders.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                ${totalSpent.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">
                ${totalSaved.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Saved</div>
            </Card>
          </div>

          {/* Orders list */}
          <div className="space-y-6">
            {[...orders].reverse().map((order, index) => (
              <Card
                key={order.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.pizza.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <img
                        src={item.pizza.imageUrl}
                        alt={item.pizza.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.pizza.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.pizza.price.toFixed(2)} × {item.quantity}
                        </p>
                        {item.discountAmount > 0 && (
                          <p className="text-xs text-accent-600 dark:text-accent-400">
                            10% bulk discount applied
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {item.discountAmount > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </p>
                        )}
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${item.finalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order summary */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {order.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-accent-600 dark:text-accent-400">Discount</span>
                      <span className="text-accent-600 dark:text-accent-400">
                        -${order.totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Orders;
