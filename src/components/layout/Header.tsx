import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pizza, ShoppingCart, Menu, X, Sun, Moon, Plus, Gift, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectCartItemsCount,
  selectTheme,
  selectIsMobileMenuOpen,
  selectAllOrders,
  selectCartTotals,
} from '../../store/selectors';
import { toggleTheme, toggleMobileMenu, setMobileMenuOpen } from '../../store/slices/uiSlice';
import { toggleCart } from '../../store/slices/cartSlice';

/**
 * Main header component with navigation and cart
 */
export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const cartTotals = useAppSelector(selectCartTotals);
  const theme = useAppSelector(selectTheme);
  const isMobileMenuOpen = useAppSelector(selectIsMobileMenuOpen);
  const orders = useAppSelector(selectAllOrders);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/add-pizza', label: 'Add Pizza' },
    { path: '/orders', label: `Orders${orders.length > 0 ? ` (${orders.length})` : ''}` },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Promo Banner */}
      {showPromoBanner && (
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22 fill-rule=%22evenodd%22%3E%3Ccircle cx=%223%22 cy=%223%22 r=%223%22/%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
            <Gift className="w-4 h-4 hidden sm:block" />
            <span className="font-medium">
              <span className="hidden sm:inline">🎉 Special Offer: </span>
              Order 3+ of same pizza, get <span className="font-bold">10% OFF!</span>
            </span>
            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center gap-1 ml-2 font-semibold hover:underline"
            >
              Order Now <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowPromoBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-full shadow-pizza">
                  <Pizza className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Crust<span className="text-primary-500">&Co</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                  Crafted With Care
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* Add Pizza (mobile) */}
              <Link to="/add-pizza" className="md:hidden">
                <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>

              {/* Cart button with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCartDropdown(true)}
                onMouseLeave={() => setShowCartDropdown(false)}
              >
                <button
                  onClick={() => dispatch(toggleCart())}
                  className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center px-1 text-xs font-bold text-white bg-primary-500 rounded-full animate-bounce-in">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Cart mini dropdown */}
                {showCartDropdown && cartItemsCount > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
                      </span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        ${cartTotals.total.toFixed(2)}
                      </span>
                    </div>
                    {cartTotals.totalDiscount > 0 && (
                      <div className="text-xs text-accent-600 dark:text-accent-400 mb-3">
                        💰 You save ${cartTotals.totalDiscount.toFixed(2)}!
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => dispatch(toggleCart())}
                        className="flex-1 text-xs px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Quick View
                      </button>
                      <Link
                        to="/cart"
                        onClick={() => setShowCartDropdown(false)}
                        className="flex-1 text-xs px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-center font-medium"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
