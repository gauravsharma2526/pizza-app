import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Pizza, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui';

/**
 * 404 Not Found page component
 * Displays when user navigates to a non-existent route
 */
export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Pizza illustration */}
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto relative">
            {/* Plate */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full shadow-xl" />

            {/* Pizza with bite taken out */}
            <div className="absolute inset-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full overflow-hidden shadow-lg">
              {/* Cheese texture */}
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full" />

              {/* Pepperoni dots */}
              <div className="absolute top-6 left-8 w-4 h-4 bg-red-600 rounded-full shadow-sm" />
              <div className="absolute top-12 right-6 w-3 h-3 bg-red-600 rounded-full shadow-sm" />
              <div className="absolute bottom-8 left-10 w-3 h-3 bg-red-600 rounded-full shadow-sm" />
              <div className="absolute bottom-12 right-10 w-4 h-4 bg-red-600 rounded-full shadow-sm" />

              {/* Bite mark */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-full" />
            </div>
          </div>

          {/* Question marks floating */}
          <span
            className="absolute top-0 right-8 text-4xl animate-bounce text-orange-400 dark:text-orange-500"
            style={{ animationDelay: '0.1s' }}
          >
            ?
          </span>
          <span
            className="absolute top-4 left-8 text-3xl animate-bounce text-amber-400 dark:text-amber-500"
            style={{ animationDelay: '0.3s' }}
          >
            ?
          </span>
          <span
            className="absolute bottom-8 right-4 text-2xl animate-bounce text-yellow-400 dark:text-yellow-500"
            style={{ animationDelay: '0.5s' }}
          >
            ?
          </span>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! This slice is missing
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Looks like someone already ate this page! Don't worry, we have plenty more delicious
          options for you.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300">
              <Home size={20} />
              Back to Home
            </Button>
          </Link>

          <Link to="/menu">
            <Button
              variant="secondary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-500/30 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300"
            >
              <Pizza size={20} />
              Browse Menu
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
            >
              <ArrowLeft size={14} />
              Go Back
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
            >
              <Search size={14} />
              Search Pizzas
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
            >
              <Pizza size={14} />
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
