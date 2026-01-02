import React from 'react';
import { ShoppingCart, ChevronUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCartItemsCount, selectCartTotals } from '../../store/selectors';
import { toggleCart } from '../../store/slices/cartSlice';

/**
 * Floating cart button for mobile devices
 * Shows cart summary and provides quick access to cart
 */
export const FloatingCartButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectCartItemsCount);
  const totals = useAppSelector(selectCartTotals);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Don't show if cart is empty
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 md:hidden">
      {/* Expanded view */}
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Your Cart</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronUp className="w-4 h-4 text-gray-500 rotate-180" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{itemCount} items</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-accent-600 dark:text-accent-400">
                <span>Discount</span>
                <span>-${totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                ${totals.total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              dispatch(toggleCart());
              setIsExpanded(false);
            }}
            className="w-full mt-4 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/30 transition-all active:scale-95"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">${totals.total.toFixed(2)}</span>

        {/* Item count badge */}
        <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] flex items-center justify-center px-1.5 text-xs font-bold bg-secondary-500 text-white rounded-full">
          {itemCount}
        </span>
      </button>
    </div>
  );
};

export default FloatingCartButton;
