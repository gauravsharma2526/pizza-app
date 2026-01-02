import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Tag,
  Plus,
  Minus,
  CheckCircle,
  X,
  ArrowLeft,
  Pizza,
  Percent,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectCartWithDetails,
  selectCartTotals,
  selectCartItemsCount,
  selectCartLimitsInfo,
  selectCanIncrementItem,
  selectIsItemAtLimit,
} from '../store/selectors';
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../store/slices/cartSlice';
import { addOrder, setProcessing } from '../store/slices/orderSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Button, Card, OrderSuccessModal } from '../components/ui';
import { v4 as uuidv4 } from 'uuid';
import type { Order } from '../types';
import { CART_LIMITS, CART_LIMIT_MESSAGES } from '../constants/cart';

/**
 * Quantity controls component with limit enforcement for Cart page
 */
const CartQuantityControls: React.FC<{
  pizzaId: string;
  pizzaName: string;
  quantity: number;
}> = ({ pizzaId, pizzaName, quantity }) => {
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
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      <button
        onClick={() => dispatch(decrementQuantity(pizzaId))}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      <span className="w-12 text-center text-lg font-semibold text-gray-900 dark:text-white">
        {quantity}
      </span>
      <button
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={`p-2 rounded-lg transition-colors ${
          canIncrement
            ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
            : 'opacity-50 cursor-not-allowed'
        }`}
        aria-label="Increase quantity"
        title={
          !canIncrement
            ? isItemAtLimit
              ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per pizza`
              : 'Cart limit reached'
            : undefined
        }
      >
        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

/**
 * Dedicated Cart/Checkout page with full order summary
 * Shows all cart items with detailed discount information
 * Includes celebration modal on order confirmation
 */
export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartWithDetails);
  const totals = useAppSelector(selectCartTotals);
  const itemCount = useAppSelector(selectCartItemsCount);
  const limitsInfo = useAppSelector(selectCartLimitsInfo);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

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
      const order: Order = {
        id: uuidv4(),
        items: cartItems,
        subtotal: totals.subtotal,
        totalDiscount: totals.totalDiscount,
        total: totals.total,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      dispatch(addOrder(order));
      dispatch(clearCart());
      dispatch(setProcessing(false));

      // Show success modal with confetti
      setConfirmedOrder(order);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setConfirmedOrder(null);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-16">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mx-auto w-fit mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any pizzas yet. Browse our delicious menu and find your
              favorites!
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                <Pizza className="w-5 h-5" />
                Browse Menu
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
              Your Order
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {itemCount} / {CART_LIMITS.MAX_TOTAL_ITEMS} items in your cart
            </p>
          </div>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Cart</span>
        </button>
      </div>

      {/* Cart Capacity Warning */}
      {limitsInfo.percentUsed >= 70 && (
        <div
          className={`mb-6 p-4 rounded-2xl border ${
            limitsInfo.percentUsed >= 90
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 ${
                limitsInfo.percentUsed >= 90
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            />
            <div className="flex-1">
              <p
                className={`font-medium ${
                  limitsInfo.percentUsed >= 90
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-amber-800 dark:text-amber-200'
                }`}
              >
                {limitsInfo.percentUsed >= 90 ? 'Cart almost full!' : 'Cart filling up'}
              </p>
              <p
                className={`text-sm ${
                  limitsInfo.percentUsed >= 90
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {limitsInfo.remaining} {limitsInfo.remaining === 1 ? 'slot' : 'slots'} remaining
                (max {CART_LIMITS.MAX_TOTAL_ITEMS} pizzas per order)
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    limitsInfo.percentUsed >= 90 ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${limitsInfo.percentUsed}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-500">{limitsInfo.percentUsed}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Discount Info Banner */}
      <div className="mb-8 p-4 bg-gradient-to-r from-accent-50 to-secondary-50 dark:from-accent-900/20 dark:to-secondary-900/20 border border-accent-200 dark:border-accent-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-xl">
            <Percent className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <p className="font-semibold text-accent-800 dark:text-accent-200">
              Bulk Discount Available!
            </p>
            <p className="text-sm text-accent-700 dark:text-accent-300">
              Order {CART_LIMITS.DISCOUNT_THRESHOLD} or more of the same pizza and get{' '}
              {CART_LIMITS.DISCOUNT_PERCENTAGE * 100}% off that item
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const hasDiscount = item.discountAmount > 0;
            const needsMoreForDiscount = item.quantity < CART_LIMITS.DISCOUNT_THRESHOLD;
            const itemsNeeded = CART_LIMITS.DISCOUNT_THRESHOLD - item.quantity;
            const isAtItemLimit = item.quantity >= CART_LIMITS.MAX_QUANTITY_PER_ITEM;

            return (
              <Card key={item.pizza.id} className="overflow-hidden">
                <div className="flex gap-4">
                  {/* Pizza image */}
                  <Link to={`/pizza/${item.pizza.id}`} className="flex-shrink-0 relative">
                    <img
                      src={item.pizza.imageUrl}
                      alt={item.pizza.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover hover:scale-105 transition-transform"
                    />
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -10%
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <Link to={`/pizza/${item.pizza.id}`}>
                          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {item.pizza.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {item.pizza.ingredients.slice(0, 4).join(', ')}
                          {item.pizza.ingredients.length > 4 && '...'}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.pizza.id))}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Unit price */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      ${item.pizza.price.toFixed(2)} per pizza
                    </p>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                      {/* Quantity controls with limits */}
                      <CartQuantityControls
                        pizzaId={item.pizza.id}
                        pizzaName={item.pizza.name}
                        quantity={item.quantity}
                      />

                      {/* Line total with discount details */}
                      <div className="text-right">
                        {hasDiscount ? (
                          <>
                            <div className="text-sm text-gray-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </div>
                            <div className="text-xl font-bold text-accent-600 dark:text-accent-400">
                              ${item.finalPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-accent-600 dark:text-accent-400">
                              You save ${item.discountAmount.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              ${item.finalPrice.toFixed(2)}
                            </div>
                            {needsMoreForDiscount && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Add {itemsNeeded} more for 10% off
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {/* Discount badge */}
                      {hasDiscount && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
                          <Tag className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                          <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
                            10% bulk discount applied!
                          </span>
                        </div>
                      )}

                      {/* Item limit warning */}
                      {isAtItemLimit && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            Max quantity reached ({CART_LIMITS.MAX_QUANTITY_PER_ITEM})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {itemCount} / {CART_LIMITS.MAX_TOTAL_ITEMS} items
                  </p>
                </div>
              </div>

              {/* Cart capacity bar */}
              {limitsInfo.percentUsed > 30 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Cart capacity</span>
                    <span>{limitsInfo.percentUsed}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                </div>
              )}

              {/* Items breakdown */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.pizza.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.pizza.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600 dark:text-accent-400 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Bulk Discount
                    </span>
                    <span className="text-accent-600 dark:text-accent-400 font-medium">
                      -${totals.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Savings highlight */}
              {totals.totalDiscount > 0 && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
                    You're saving ${totals.totalDiscount.toFixed(2)} with bulk discounts!
                  </span>
                </div>
              )}

              {/* Confirm Order Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmOrder}
                className="w-full mt-6"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Order
              </Button>

              {/* Continue shopping */}
              <Link to="/" className="block mt-3">
                <Button variant="ghost" size="md" className="w-full">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Success Modal with Confetti */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        order={confirmedOrder}
      />
    </div>
  );
};

export default Cart;
