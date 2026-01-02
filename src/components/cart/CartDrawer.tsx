import React from 'react';
import { X, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCartIsOpen, selectCartWithDetails, selectCartTotals } from '../../store/selectors';
import { setCartOpen, clearCart } from '../../store/slices/cartSlice';
import { addOrder, setProcessing } from '../../store/slices/orderSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { CartItem } from './CartItem';
import { Button } from '../ui';
import { v4 as uuidv4 } from 'uuid';

/**
 * Slide-out cart drawer with order summary
 */
export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectCartIsOpen);
  const cartItems = useAppSelector(selectCartWithDetails);
  const totals = useAppSelector(selectCartTotals);

  const handleClose = () => dispatch(setCartOpen(false));

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(
      addNotification({
        id: uuidv4(),
        type: 'info',
        message: 'Cart cleared',
      })
    );
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'error',
          message: 'Your cart is empty',
        })
      );
      return;
    }

    dispatch(setProcessing(true));

    // Simulate order processing
    setTimeout(() => {
      const order = {
        id: uuidv4(),
        items: cartItems,
        subtotal: totals.subtotal,
        totalDiscount: totals.totalDiscount,
        total: totals.total,
        createdAt: new Date().toISOString(),
        status: 'confirmed' as const,
      };

      dispatch(addOrder(order));
      dispatch(clearCart());
      dispatch(setProcessing(false));
      dispatch(setCartOpen(false));
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'success',
          message: `Order #${order.id.slice(0, 8)} confirmed! Total: $${totals.total.toFixed(2)}`,
          duration: 7000,
        })
      );
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface-light dark:bg-surface-dark shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Your Order</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add some delicious pizzas to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.pizza.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Order summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-5 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {/* Discount info */}
              {totals.totalDiscount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
                  <Tag className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
                    10% bulk discount applied!
                  </span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600 dark:text-accent-400">Discount</span>
                    <span className="text-accent-600 dark:text-accent-400">
                      -${totals.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleClearCart} className="flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="primary" size="lg" onClick={handleConfirmOrder} className="flex-1">
                  Confirm Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
