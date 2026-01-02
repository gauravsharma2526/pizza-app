import React, { useEffect } from 'react';
import { CheckCircle, X, Pizza, Clock, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { triggerPizzaConfetti } from '../../utils/confetti';
import { Button } from './Button';
import type { Order } from '../../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

/**
 * Order success modal with celebration animation
 * Shows order details and triggers confetti
 */
export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, order }) => {
  useEffect(() => {
    if (isOpen && order) {
      // Trigger confetti when modal opens
      triggerPizzaConfetti();
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl pointer-events-auto animate-bounce-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success header with gradient */}
          <div className="relative bg-gradient-to-br from-accent-500 via-accent-600 to-green-600 px-6 py-8 text-center text-white overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-pulse">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="text-2xl font-display font-bold mb-2">Order Confirmed! 🎉</h2>
            <p className="text-white/80">Your delicious pizzas are on their way!</p>
          </div>

          {/* Order details */}
          <div className="px-6 py-6">
            {/* Order ID */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span className="text-sm">Order ID</span>
              </div>
              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Order items summary */}
            <div className="space-y-3 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.pizza.id} className="flex items-center gap-3">
                  <img
                    src={item.pizza.imageUrl}
                    alt={item.pizza.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.pizza.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${item.finalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>

            {/* Order total */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                {order.totalDiscount > 0 && (
                  <p className="text-xs text-accent-600 dark:text-accent-400">
                    You saved ${order.totalDiscount.toFixed(2)}!
                  </p>
                )}
              </div>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ${order.total.toFixed(2)}
              </span>
            </div>

            {/* Estimated time */}
            <div className="flex items-center gap-2 p-3 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-xl mb-6">
              <Clock className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Estimated Delivery
                </p>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">30-45 minutes</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                <Pizza className="w-4 h-4" />
                Order More
              </Button>
              <Link to="/orders" className="flex-1" onClick={onClose}>
                <Button variant="primary" className="w-full">
                  View Orders
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessModal;
