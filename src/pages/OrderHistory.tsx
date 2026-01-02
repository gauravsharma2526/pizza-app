import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Package, Clock, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectAllOrders } from '../store/selectors';
import { removeOrder } from '../store/slices/orderSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Card, Button, Badge } from '../components/ui';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order History page showing all confirmed orders
 */
export const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);

  const handleDeleteOrder = (orderId: string) => {
    dispatch(removeOrder(orderId));
    dispatch(
      addNotification({
        id: uuidv4(),
        type: 'info',
        message: 'Order removed from history',
      })
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'preparing':
        return 'warning';
      case 'ready':
        return 'accent';
      case 'delivered':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl">
          <Receipt className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Order History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 inline-block mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your confirmed orders will appear here.
          </p>
          <Link to="/">
            <Button variant="primary">Browse Menu</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {[...orders].reverse().map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                    <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      getStatusColor(order.status) as
                        | 'success'
                        | 'warning'
                        | 'primary'
                        | 'secondary'
                        | 'accent'
                        | 'error'
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="py-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.pizza.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.pizza.imageUrl}
                        alt={item.pizza.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.pizza.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.pizza.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.discountAmount > 0 && (
                        <span className="text-xs text-gray-400 line-through block">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${item.finalPrice.toFixed(2)}
                      </span>
                      {item.discountAmount > 0 && (
                        <span className="text-xs text-accent-600 dark:text-accent-400 block">
                          -10% discount
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600 dark:text-accent-400">Discount</span>
                    <span className="text-accent-600 dark:text-accent-400">
                      -${order.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Paid</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
