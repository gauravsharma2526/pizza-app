import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectCartWithDetails,
  selectCartTotals,
  selectCartItemsCount,
  selectCartLimitsInfo,
  selectCanIncrementItem,
  selectIsItemAtLimit,
} from '../../store/selectors';
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../../store/slices/cartSlice';
import { addOrder, setProcessing } from '../../store/slices/orderSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { Button, Card } from '../ui';
import { v4 as uuidv4 } from 'uuid';
import { CART_LIMITS, CART_LIMIT_MESSAGES } from '../../constants/cart';

/**
 * Quantity controls with limit enforcement for OrderSummary
 */
const QuantityControls: React.FC<{ pizzaId: string; pizzaName: string; quantity: number }> = ({
  pizzaId,
  pizzaName,
  quantity,
}) => {
  const dispatch = useAppDispatch();
  const canIncrement = useAppSelector(selectCanIncrementItem(pizzaId));
  const isItemAtLimit = useAppSelector(selectIsItemAtLimit(pizzaId));

  const handleIncrement = () => {
    if (!canIncrement) {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'warning',
          message: isItemAtLimit
            ? CART_LIMIT_MESSAGES.MAX_PER_ITEM(pizzaName)
            : CART_LIMIT_MESSAGES.MAX_TOTAL,
        })
      );
      return;
    }
    dispatch(incrementQuantity(pizzaId));
  };

  return (
    <div className="flex items-center gap-0.5 bg-white dark:bg-gray-700 rounded shadow-sm">
      <button
        onClick={() => dispatch(decrementQuantity(pizzaId))}
        className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l transition-colors"
      >
        <Minus className="w-2.5 h-2.5 text-gray-500" />
      </button>
      <span className="w-5 text-center text-[10px] font-medium text-gray-900 dark:text-white">
        {quantity}
      </span>
      <button
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={`p-0.5 rounded-r transition-colors ${
          canIncrement
            ? 'hover:bg-gray-100 dark:hover:bg-gray-600'
            : 'opacity-50 cursor-not-allowed'
        }`}
        title={
          !canIncrement
            ? isItemAtLimit
              ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`
              : 'Cart limit'
            : undefined
        }
      >
        <Plus className="w-2.5 h-2.5 text-gray-500" />
      </button>
    </div>
  );
};

/**
 * Order Summary component showing current order with discount details
 * Displayed on the Dashboard page
 */
export const OrderSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartWithDetails);
  const totals = useAppSelector(selectCartTotals);
  const itemCount = useAppSelector(selectCartItemsCount);
  const limitsInfo = useAppSelector(selectCartLimitsInfo);

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
          message: 'Your cart is empty. Add some pizzas first!',
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

  if (cartItems.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-lg">
            <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white">
            Order Summary
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mb-2">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your cart is empty</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-1.5 rounded-lg">
            <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white">
              Order Summary
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {itemCount} / {CART_LIMITS.MAX_TOTAL_ITEMS} items
            </p>
          </div>
        </div>
        <button
          onClick={handleClearCart}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Clear cart"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cart capacity bar */}
      {limitsInfo.percentUsed > 50 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            <span>Cart capacity</span>
            <span>{limitsInfo.percentUsed}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                limitsInfo.percentUsed >= 90
                  ? 'bg-red-500'
                  : limitsInfo.percentUsed >= 70
                    ? 'bg-amber-500'
                    : 'bg-primary-500'
              }`}
              style={{ width: `${limitsInfo.percentUsed}%` }}
            />
          </div>
          {limitsInfo.remaining <= 10 && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {limitsInfo.remaining} {limitsInfo.remaining === 1 ? 'slot' : 'slots'} remaining
            </p>
          )}
        </div>
      )}

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-60 custom-scrollbar">
        {cartItems.map((item) => {
          const hasDiscount = item.discountAmount > 0;

          return (
            <div
              key={item.pizza.id}
              className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              {/* Pizza image */}
              <img
                src={item.pizza.imageUrl}
                alt={item.pizza.name}
                className="w-10 h-10 rounded-md object-cover flex-shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate">
                    {item.pizza.name}
                  </h4>
                  <button
                    onClick={() => dispatch(removeFromCart(item.pizza.id))}
                    className="p-0.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  ${item.pizza.price.toFixed(2)} each
                </p>

                <div className="flex items-center justify-between mt-1">
                  {/* Quantity controls */}
                  <QuantityControls
                    pizzaId={item.pizza.id}
                    pizzaName={item.pizza.name}
                    quantity={item.quantity}
                  />

                  {/* Line total */}
                  <div className="text-right">
                    {hasDiscount ? (
                      <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">
                        ${item.finalPrice.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        ${item.finalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white">${totals.subtotal.toFixed(2)}</span>
        </div>
        {totals.totalDiscount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-accent-600 dark:text-accent-400">Discount (-10%)</span>
            <span className="text-accent-600 dark:text-accent-400">
              -${totals.totalDiscount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ${totals.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirm Order Button */}
      <Button variant="primary" size="md" onClick={handleConfirmOrder} className="w-full mt-3">
        <CheckCircle className="w-4 h-4" />
        Confirm Order
      </Button>
    </Card>
  );
};

export default OrderSummary;
