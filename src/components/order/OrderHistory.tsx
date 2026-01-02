import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, ChefHat, Truck, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAllOrders } from '../../store/selectors';
import { addToCart } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { Card } from '../ui';
import type { Order } from '../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order History component showing past orders
 * Includes quick reorder functionality
 */
export const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);

  // Quick reorder - adds all items from a past order to the cart
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      dispatch(addToCart({ pizzaId: item.pizza.id, quantity: item.quantity }));
    });
    dispatch(
      addNotification({
        id: uuidv4(),
        type: 'success',
        message: `Added ${order.items.length} items from order #${order.id.slice(0, 8)} to cart!`,
      })
    );
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  if (orders.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            Order History
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-lg">
            <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            Order History
          </h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        {[...orders]
          .reverse()
          .slice(0, 3)
          .map((order) => (
            <div
              key={order.id}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
            >
              {/* Compact order header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              {/* Compact order items - show just names */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                {order.items.map((item) => `${item.quantity}× ${item.pizza.name}`).join(', ')}
              </p>

              {/* Order total and reorder button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleReorder(order)}
                  className="flex items-center gap-1 text-[10px] text-primary-600 dark:text-primary-400 hover:underline"
                  title="Add all items to cart"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reorder
                </button>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        {orders.length > 3 && (
          <Link
            to="/orders"
            className="block text-center text-xs text-primary-600 dark:text-primary-400 hover:underline py-2"
          >
            View all {orders.length} orders →
          </Link>
        )}
      </div>
    </Card>
  );
};

export default OrderHistory;
