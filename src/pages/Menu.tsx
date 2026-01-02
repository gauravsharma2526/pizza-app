import React from 'react';
import { UtensilsCrossed, BarChart3 } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { selectFilteredPizzas } from '../store/selectors';
import { PizzaFilters, PizzaGrid } from '../components/pizza';
import { PriceChart, OrderDistributionChart } from '../components/charts';
import { OrderSummary, OrderHistory } from '../components/order';

/**
 * Menu page with pizza grid, filters, and order sidebar
 */
export const Menu: React.FC = () => {
  const filteredPizzas = useAppSelector(selectFilteredPizzas);

  return (
    <div className="min-h-screen">
      <div className="page-container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Our Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our handcrafted pizzas made with the freshest ingredients
          </p>
        </div>

        {/* Filters */}
        <section className="mb-8">
          <PizzaFilters />
        </section>

        {/* Main content grid */}
        <section className="pb-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Pizza grid - takes 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                    <UtensilsCrossed className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  Pizza Collection
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredPizzas.length} pizzas found
                </span>
              </div>
              <PizzaGrid />
            </div>

            {/* Sidebar - Order Summary only (sticky) */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary - Most important, always visible */}
                <OrderSummary />

                {/* Order Distribution - only show when cart has items */}
                <OrderDistributionChart />

                {/* Order History - compact */}
                <OrderHistory />
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section - Full width below main content */}
        <section className="py-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="section-title flex items-center gap-3 mb-6">
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-xl">
              <BarChart3 className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            Menu Insights
          </h2>
          <PriceChart />
        </section>
      </div>
    </div>
  );
};

export default Menu;
