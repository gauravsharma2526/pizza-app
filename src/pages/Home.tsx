import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Clock,
  Leaf,
  Flame,
  Award,
  Truck,
  Gift,
  ChevronDown,
  Sparkles,
  Star,
  ArrowRight,
  TrendingUp,
  Zap,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectAllPizzas } from '../store/selectors';
import { addToCart } from '../store/slices/cartSlice';
import { addNotification } from '../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import { FALLBACK_IMAGE } from '../constants';

/**
 * Home/Landing page with hero banner, featured sections, and CTAs
 */
export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const allPizzas = useAppSelector(selectAllPizzas);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (pizzaId: string) => {
    setImageErrors((prev) => ({ ...prev, [pizzaId]: true }));
  };

  // Calculate average rating
  const avgRating =
    allPizzas.length > 0
      ? (allPizzas.reduce((sum, p) => sum + p.rating, 0) / allPizzas.length).toFixed(1)
      : '0';

  // Best Sellers - Top rated pizzas
  const bestSellers = useMemo(() => {
    return [...allPizzas].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [allPizzas]);

  // Quick Picks - Affordable and fast options
  const quickPicks = useMemo(() => {
    return [...allPizzas]
      .filter((p) => p.price <= 15 && p.prepTime <= 20)
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
  }, [allPizzas]);

  // Quick add to cart handler
  const handleQuickAdd = (pizzaId: string, pizzaName: string) => {
    dispatch(addToCart({ pizzaId, quantity: 1 }));
    dispatch(
      addNotification({
        id: uuidv4(),
        type: 'success',
        message: `${pizzaName} added to cart!`,
      })
    );
  };

  // Features data
  const features = [
    {
      icon: ChefHat,
      title: 'Master Chefs',
      description: 'Expert pizzaiolos crafting perfection',
      color: 'primary',
    },
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'Farm-to-table quality ingredients',
      color: 'accent',
    },
    {
      icon: Clock,
      title: 'Quick Prep',
      description: 'Ready in 15-20 minutes',
      color: 'secondary',
    },
    {
      icon: Flame,
      title: 'Wood-Fired',
      description: 'Authentic Italian taste',
      color: 'primary',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest toppings',
      color: 'secondary',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Hot & fresh to your door',
      color: 'accent',
    },
  ];

  const visibleFeatures = showAllFeatures ? features : features.slice(0, 3);

  // Popular categories for quick navigation
  const categories = [
    {
      name: 'Classic',
      emoji: '🍕',
      count: allPizzas.filter((p) => p.category === 'classic').length,
    },
    {
      name: 'Specialty',
      emoji: '⭐',
      count: allPizzas.filter((p) => p.category === 'specialty').length,
    },
    { name: 'Vegetarian', emoji: '🥬', count: allPizzas.filter((p) => p.isVegetarian).length },
    { name: 'Spicy', emoji: '🌶️', count: allPizzas.filter((p) => p.isSpicy).length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />

        <div className="relative page-container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* Promo badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-medium mb-6 animate-bounce-in">
                <Gift className="w-4 h-4" />
                <span>Order 3+ of same pizza, get 10% off!</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Handcrafted with{' '}
                <span className="text-gradient bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                  Love & Passion
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                Authentic Italian pizzas made with the freshest ingredients, baked to perfection in
                our wood-fired ovens.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/menu" className="btn-primary group text-base px-8 py-4">
                  <UtensilsCrossed className="w-5 h-5" />
                  Explore Menu
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/add-pizza"
                  className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 py-4"
                >
                  Create Your Own
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{allPizzas.length}+</div>
                  <div className="text-sm text-gray-400">Pizzas</div>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div className="text-center">
                  <div className="flex items-center gap-1 text-3xl font-bold text-white">
                    <Star className="w-6 h-6 text-secondary-400 fill-secondary-400" />
                    {avgRating}
                  </div>
                  <div className="text-sm text-gray-400">Avg Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-400">10%</div>
                  <div className="text-sm text-gray-400">Bulk Discount</div>
                </div>
              </div>
            </div>

            {/* Right content - Featured pizza image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating badges */}
                <div className="absolute -left-4 top-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 animate-float z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">100% Fresh</div>
                      <div className="text-sm text-gray-500">Ingredients</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 animate-float-delayed z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">15-20 min</div>
                      <div className="text-sm text-gray-500">Preparation</div>
                    </div>
                  </div>
                </div>

                {/* Main pizza image circle */}
                <div className="relative w-[400px] h-[400px] mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full opacity-20 animate-pulse" />
                  <div className="absolute inset-4 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full opacity-30" />
                  <img
                    src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop"
                    alt="Delicious Pizza"
                    className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] object-cover rounded-full shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              className="fill-background-light dark:fill-background-dark"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="page-container">
        {/* Category Quick Links */}
        <section className="py-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to="/menu"
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <span className="text-4xl mb-3 block">{category.emoji}</span>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} options</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-primary-600">Crust & Co</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to delivering the finest pizza experience with quality ingredients and
              authentic recipes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                primary:
                  'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
                secondary:
                  'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
                accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
              };

              return (
                <div
                  key={feature.title}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {!showAllFeatures && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllFeatures(true)}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center gap-2"
              >
                Show more features
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Best Sellers Section */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2.5 rounded-xl">
                <TrendingUp className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Best Sellers
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our most loved pizzas by customers
                </p>
              </div>
            </div>
            <Link
              to="/menu"
              className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((pizza, index) => (
              <div
                key={pizza.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Rank badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  #{index + 1}
                </div>

                {/* Image */}
                <Link to={`/pizza/${pizza.id}`} className="block aspect-[4/3] overflow-hidden">
                  <img
                    src={imageErrors[pizza.id] ? FALLBACK_IMAGE : pizza.imageUrl}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImageError(pizza.id)}
                  />
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/pizza/${pizza.id}`}>
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {pizza.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-secondary-500 fill-secondary-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {pizza.rating}
                    </span>
                    <span className="text-sm text-gray-500">rating</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${pizza.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleQuickAdd(pizza.id, pizza.name)}
                      className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                      aria-label={`Add ${pizza.name} to cart`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Picks Section */}
        {quickPicks.length > 0 && (
          <section className="py-12 bg-gray-50 dark:bg-gray-900/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-accent-100 dark:bg-accent-900/30 p-2.5 rounded-xl">
                  <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Quick Picks
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fast prep, great value - under $15 & ready in 20 min
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickPicks.map((pizza) => (
                <div
                  key={pizza.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Fast badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-accent-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pizza.prepTime}min
                  </div>

                  {/* Image */}
                  <Link to={`/pizza/${pizza.id}`} className="block aspect-[4/3] overflow-hidden">
                    <img
                      src={imageErrors[pizza.id] ? FALLBACK_IMAGE : pizza.imageUrl}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => handleImageError(pizza.id)}
                    />
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/pizza/${pizza.id}`}>
                      <h3 className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {pizza.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {pizza.ingredients.slice(0, 3).join(', ')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        ${pizza.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleQuickAdd(pizza.id, pizza.name)}
                        className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                        aria-label={`Add ${pizza.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        <section className="py-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Order?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Explore our full menu with {allPizzas.length}+ handcrafted pizzas. Filter by
                category, price, or dietary preferences.
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                <UtensilsCrossed className="w-5 h-5" />
                View Full Menu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
