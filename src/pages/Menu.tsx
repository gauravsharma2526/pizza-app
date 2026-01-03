import React from 'react';
import { UtensilsCrossed, BarChart3, Sparkles } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { selectFilteredPizzas } from '../store/selectors';
import { PizzaFilters, PizzaGrid } from '../components/pizza';
import { PriceChart, OrderDistributionChart } from '../components/charts';
import { OrderSummary } from '../components/order';
import { HeroSection } from '../components/layout';

/**
 * Menu page with pizza grid, filters, and order sidebar
 */
export const Menu: React.FC = () => {
  const filteredPizzas = useAppSelector(selectFilteredPizzas);

  const heroBadges = [
    { icon: <Sparkles className="w-4 h-4" />, text: `${filteredPizzas.length} Pizzas Available` },
    { icon: <UtensilsCrossed className="w-4 h-4" />, text: 'Fresh Daily' },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        theme="primary"
        subtitle="Explore Our Menu"
        title="Our Pizza Collection"
        description="From classic favorites to innovative creations, discover handcrafted pizzas made with the freshest ingredients and authentic Italian recipes"
        badges={heroBadges}
      />

      <div className="page-container py-8">

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

            {/* Sidebar - Order Summary (sticky) */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary - Quick cart reference */}
                <OrderSummary />

                {/* Order Distribution - shows current cart distribution */}
                <OrderDistributionChart />
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
