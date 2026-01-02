import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  Clock,
  Star,
  Flame,
  Leaf,
  ShoppingCart,
  Heart,
  AlertCircle,
} from 'lucide-react';
import type { Pizza } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { addNotification } from '../../store/slices/uiSlice';
import {
  selectFavoriteIds,
  selectCanAddToCart,
  selectCartItemQuantity,
  selectIsCartAtLimit,
} from '../../store/selectors';
import { Card, Badge, Button } from '../ui';
import { v4 as uuidv4 } from 'uuid';
import { CART_LIMITS, CART_LIMIT_MESSAGES } from '../../constants/cart';

interface PizzaCardProps {
  pizza: Pizza;
  index?: number;
}

/**
 * Pizza card component displaying pizza details with add to cart functionality
 * Enforces cart limits with user-friendly feedback
 */
export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, index = 0 }) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const isFavorite = favoriteIds.has(pizza.id);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Cart limit selectors
  const cartItemQuantity = useAppSelector(selectCartItemQuantity(pizza.id));
  const isCartAtLimit = useAppSelector(selectIsCartAtLimit);
  const canAddInfo = useAppSelector(selectCanAddToCart(pizza.id, quantity));

  // Calculate if we can increment local quantity
  const canIncrementLocal = useMemo(() => {
    const wouldBeQuantity = quantity + 1;
    const wouldExceedPerItem =
      cartItemQuantity + wouldBeQuantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM;
    return !wouldExceedPerItem && wouldBeQuantity <= CART_LIMITS.MAX_QUANTITY_PER_ITEM;
  }, [quantity, cartItemQuantity]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(pizza.id));
    dispatch(
      addNotification({
        id: uuidv4(),
        type: isFavorite ? 'info' : 'success',
        message: isFavorite
          ? `${pizza.name} removed from favorites`
          : `${pizza.name} added to favorites! ❤️`,
      })
    );
  };

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

    setIsAdding(true);
    dispatch(addToCart({ pizzaId: pizza.id, quantity: actualQuantityToAdd }));
    setQuantity(1);
    setTimeout(() => setIsAdding(false), 300);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canIncrementLocal) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // Show discount info if user would get a discount
  const showDiscountHint = quantity >= CART_LIMITS.DISCOUNT_THRESHOLD;

  // Check if item is at limit in cart
  const isItemAtLimit = cartItemQuantity >= CART_LIMITS.MAX_QUANTITY_PER_ITEM;

  return (
    <Card
      className={`overflow-hidden animate-slide-up opacity-0`}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      padding="none"
    >
      {/* Image Container */}
      <Link to={`/pizza/${pizza.id}`} className="block relative group">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {pizza.isVegetarian && (
            <Badge variant="accent" size="sm">
              <Leaf className="w-3 h-3 mr-1" />
              Veg
            </Badge>
          )}
          {pizza.isSpicy && (
            <Badge variant="error" size="sm">
              <Flame className="w-3 h-3 mr-1" />
              Spicy
            </Badge>
          )}
        </div>

        {/* Rating and favorite badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Rating badge */}
          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full">
            <Star className="w-3.5 h-3.5 text-secondary-500 fill-secondary-500" />
            <span className="text-xs font-semibold text-gray-800 dark:text-white">
              {pizza.rating}
            </span>
          </div>
        </div>

        {/* Cart quantity indicator */}
        {cartItemQuantity > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
            {cartItemQuantity} in cart
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/pizza/${pizza.id}`}>
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {pizza.name}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {pizza.ingredients.join(', ')}
        </p>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{pizza.prepTime} min</span>
        </div>

        {/* Price and Discount Info */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${pizza.price.toFixed(2)}
            </span>
            {showDiscountHint ? (
              <span className="text-xs text-accent-600 dark:text-accent-400 font-medium bg-accent-50 dark:bg-accent-900/30 px-2 py-1 rounded-full animate-pulse">
                🎉 10% off!
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {quantity === 1 && 'Add 2 more for 10% off'}
                {quantity === 2 && 'Add 1 more for 10% off!'}
              </span>
            )}
          </div>
          {/* Show calculated savings when discount applies */}
          {showDiscountHint && (
            <div className="mt-1 text-xs text-accent-600 dark:text-accent-400">
              You save ${(pizza.price * quantity * CART_LIMITS.DISCOUNT_PERCENTAGE).toFixed(2)} on
              this item!
            </div>
          )}
        </div>

        {/* Limit warning */}
        {(isItemAtLimit || isCartAtLimit) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {isItemAtLimit
                ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per pizza`
                : 'Cart limit reached'}
            </span>
          </div>
        )}

        {/* Quantity selector and Add to Cart */}
        <div className="mt-3 flex items-center gap-2">
          {/* Quantity selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={!canIncrementLocal}
              className={`p-2 rounded-r-lg transition-colors ${
                canIncrementLocal
                  ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              aria-label="Increase quantity"
              title={
                !canIncrementLocal
                  ? `Max ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per pizza`
                  : undefined
              }
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Add to cart button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={isItemAtLimit || (isCartAtLimit && cartItemQuantity === 0)}
            className={`flex-1 ${isAdding ? 'scale-95' : ''}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isItemAtLimit ? 'Max Reached' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PizzaCard;
