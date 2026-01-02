import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Star,
  Flame,
  Leaf,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectPizzaById,
  selectAllPizzas,
  selectCartItemQuantity,
  selectCanAddToCart,
  selectIsCartAtLimit,
} from '../store/selectors';
import { addToCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Button, Badge, Card } from '../components/ui';
import { PizzaCard } from '../components/pizza';
import { v4 as uuidv4 } from 'uuid';
import { CART_LIMITS, CART_LIMIT_MESSAGES } from '../constants/cart';

/**
 * Pizza details page with full information and add to cart
 */
export const PizzaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pizza = useAppSelector(selectPizzaById(id || ''));
  const allPizzas = useAppSelector(selectAllPizzas);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Cart limit selectors
  const cartItemQuantity = useAppSelector(selectCartItemQuantity(id || ''));
  const isCartAtLimit = useAppSelector(selectIsCartAtLimit);
  const canAddInfo = useAppSelector(selectCanAddToCart(id || '', quantity));

  // Get similar pizzas (same category, excluding current)
  const similarPizzas = allPizzas
    .filter((p) => p.category === pizza?.category && p.id !== pizza?.id)
    .slice(0, 4);

  // Calculate if we can increment local quantity
  const canIncrementLocal = useMemo(() => {
    const wouldBeQuantity = quantity + 1;
    const wouldExceedPerItem =
      cartItemQuantity + wouldBeQuantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM;
    return !wouldExceedPerItem && wouldBeQuantity <= CART_LIMITS.MAX_QUANTITY_PER_ITEM;
  }, [quantity, cartItemQuantity]);

  // Check if item is at limit in cart
  const isItemAtLimit = cartItemQuantity >= CART_LIMITS.MAX_QUANTITY_PER_ITEM;

  if (!pizza) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pizza not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The pizza you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Check limits before adding
    if (!canAddInfo.canAdd) {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'warning',
          message:
            canAddInfo.limitType === 'per_item'
              ? CART_LIMIT_MESSAGES.MAX_PER_ITEM(pizza.name)
              : CART_LIMIT_MESSAGES.MAX_TOTAL,
        })
      );
      return;
    }

    // Check if we can add the full quantity or need to clamp
    const actualQuantityToAdd = Math.min(quantity, canAddInfo.maxAddable);

    if (actualQuantityToAdd < quantity) {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'warning',
          message: CART_LIMIT_MESSAGES.PARTIAL_ADD(actualQuantityToAdd, pizza.name),
        })
      );
    } else {
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'success',
          message: `${actualQuantityToAdd}x ${pizza.name} added to cart!`,
        })
      );
    }

    dispatch(addToCart({ pizzaId: pizza.id, quantity: actualQuantityToAdd }));
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const totalPrice = pizza.price * quantity;
  const discountedPrice =
    quantity >= CART_LIMITS.DISCOUNT_THRESHOLD
      ? totalPrice * (1 - CART_LIMITS.DISCOUNT_PERCENTAGE)
      : totalPrice;
  const hasDiscount = quantity >= CART_LIMITS.DISCOUNT_THRESHOLD;

  return (
    <div className="page-container">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img src={pizza.imageUrl} alt={pizza.name} className="w-full h-full object-cover" />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {pizza.isVegetarian && (
              <Badge variant="accent">
                <Leaf className="w-3.5 h-3.5 mr-1" />
                Vegetarian
              </Badge>
            )}
            {pizza.isSpicy && (
              <Badge variant="error">
                <Flame className="w-3.5 h-3.5 mr-1" />
                Spicy
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg">
              <Star className="w-4 h-4 text-secondary-500 fill-secondary-500" />
              <span className="font-semibold text-gray-800 dark:text-white">{pizza.rating}</span>
            </div>
          </div>

          {/* Cart quantity indicator */}
          {cartItemQuantity > 0 && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-primary-500 text-white text-sm font-bold rounded-full">
              {cartItemQuantity} in cart
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {pizza.category}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {pizza.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{pizza.description}</p>
          </div>

          {/* Prep time */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span>Ready in {pizza.prepTime} minutes</span>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {pizza.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Price and quantity */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price per pizza</p>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${pizza.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Minus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => canIncrementLocal && setQuantity((q) => q + 1)}
                  disabled={!canIncrementLocal}
                  className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors ${
                    canIncrementLocal
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    !canIncrementLocal
                      ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per pizza`
                      : undefined
                  }
                >
                  <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Discount hint */}
            {!hasDiscount && (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-xl">
                <Tag className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  Order {CART_LIMITS.DISCOUNT_THRESHOLD - quantity} more to get 10% off!
                </span>
              </div>
            )}

            {hasDiscount && (
              <div className="flex items-center gap-2 px-3 py-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl">
                <Check className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                <span className="text-sm text-accent-700 dark:text-accent-300">
                  10% bulk discount applied! You save ${(totalPrice - discountedPrice).toFixed(2)}
                </span>
              </div>
            )}

            {/* Limit warning */}
            {(isItemAtLimit || isCartAtLimit) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  {isItemAtLimit
                    ? `You've reached the max of ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} for this pizza`
                    : `Cart limit reached (${CART_LIMITS.MAX_TOTAL_ITEMS} pizzas max)`}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ${totalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    ${discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={isItemAtLimit || (isCartAtLimit && cartItemQuantity === 0)}
                className={isAdded ? 'bg-accent-600 hover:bg-accent-600' : ''}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added!
                  </>
                ) : isItemAtLimit ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Max Reached
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Similar pizzas */}
      {similarPizzas.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPizzas.map((p, index) => (
              <PizzaCard key={p.id} pizza={p} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PizzaDetails;
