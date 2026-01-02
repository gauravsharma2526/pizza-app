import React from 'react';
import { Plus, Minus, X, Tag, AlertCircle } from 'lucide-react';
import type { OrderItem } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { selectCanIncrementItem, selectIsItemAtLimit } from '../../store/selectors';
import { CART_LIMITS, CART_LIMIT_MESSAGES } from '../../constants/cart';
import { v4 as uuidv4 } from 'uuid';

interface CartItemProps {
  item: OrderItem;
}

/**
 * Individual cart item with quantity controls
 * Shows detailed discount information when applicable
 * Enforces cart limits with user-friendly feedback
 */
export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { pizza, quantity, originalPrice, discountAmount, finalPrice } = item;
  const hasDiscount = discountAmount > 0;
  const needsMoreForDiscount = quantity < CART_LIMITS.DISCOUNT_THRESHOLD;
  const itemsNeeded = CART_LIMITS.DISCOUNT_THRESHOLD - quantity;

  // Cart limit selectors
  const canIncrement = useAppSelector(selectCanIncrementItem(pizza.id));
  const isItemAtLimit = useAppSelector(selectIsItemAtLimit(pizza.id));

  const handleIncrement = () => {
    if (!canIncrement) {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'warning',
          message: isItemAtLimit
            ? CART_LIMIT_MESSAGES.MAX_PER_ITEM(pizza.name)
            : CART_LIMIT_MESSAGES.MAX_TOTAL,
        })
      );
      return;
    }
    dispatch(incrementQuantity(pizza.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(pizza.id));
  };

  return (
    <div className="flex gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {/* Pizza image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
        <img src={pizza.imageUrl} alt={pizza.name} className="w-full h-full object-cover" />
        {hasDiscount && (
          <div className="absolute top-1 left-1 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -10%
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">{pizza.name}</h4>
          <button
            onClick={() => dispatch(removeFromCart(pizza.id))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          ${pizza.price.toFixed(2)} each
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="w-7 text-center text-sm font-medium text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={!canIncrement}
              className={`p-1.5 rounded-r-lg transition-colors ${
                canIncrement
                  ? 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title={
                !canIncrement
                  ? isItemAtLimit
                    ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per pizza`
                    : 'Cart limit reached'
                  : undefined
              }
            >
              <Plus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Price with discount details */}
          <div className="text-right">
            {hasDiscount ? (
              <div>
                <span className="text-xs text-gray-400 line-through block">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="font-bold text-accent-600 dark:text-accent-400">
                  ${finalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {needsMoreForDiscount && (
                  <span className="block text-[10px] text-gray-400 dark:text-gray-500">
                    +{itemsNeeded} for 10% off
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-accent-600 dark:text-accent-400">
            <Tag className="w-3 h-3" />
            <span>Saved ${discountAmount.toFixed(2)} with bulk discount!</span>
          </div>
        )}

        {/* Limit warning */}
        {isItemAtLimit && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3 h-3" />
            <span>Max quantity reached ({CART_LIMITS.MAX_QUANTITY_PER_ITEM})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
