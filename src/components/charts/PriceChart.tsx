import React, { useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectFilteredPizzas, selectTheme } from '../../store/selectors';
import { Card } from '../ui';

interface ChartDataItem {
  name: string;
  fullName: string;
  price: number;
  category: string;
  rating: number;
}

interface Stats {
  avg: number;
  min: number;
  max: number;
}

/**
 * Enhanced bar chart showing pizza prices with insights
 */
export const PriceChart: React.FC = () => {
  const pizzas = useAppSelector(selectFilteredPizzas);
  const theme = useAppSelector(selectTheme);

  // Process data for chart
  const chartData = useMemo(() => {
    return pizzas.slice(0, 10).map((pizza) => ({
      name: pizza.name.length > 10 ? pizza.name.slice(0, 10) + '...' : pizza.name,
      fullName: pizza.name,
      price: pizza.price,
      category: pizza.category,
      rating: pizza.rating,
    }));
  }, [pizzas]);

  // Calculate stats
  const stats = useMemo((): Stats | null => {
    if (pizzas.length === 0) return null;
    const prices = pizzas.map((p) => p.price);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { avg, min, max };
  }, [pizzas]);

  // Dynamic color based on price relative to average
  const getBarColor = useCallback(
    (price: number) => {
      if (!stats) return '#6366f1';
      const ratio = price / stats.avg;
      if (ratio < 0.85) return '#22c55e'; // Green for cheap
      if (ratio > 1.15) return '#ef4444'; // Red for expensive
      return '#f59e0b'; // Amber for average
    },
    [stats]
  );

  // Custom tooltip render function (not a component)
  const renderTooltip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: TooltipProps<number, string> & { payload?: readonly any[] }) => {
      const { active, payload } = props;
      if (!active || !payload || !payload.length) return null;

      const data = payload[0].payload as ChartDataItem;
      const priceStatus = stats
        ? data.price < stats.avg * 0.85
          ? 'budget'
          : data.price > stats.avg * 1.15
            ? 'premium'
            : 'average'
        : 'average';

      return (
        <div
          className={`rounded-2xl overflow-hidden shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div
            className={`px-4 py-2 ${
              priceStatus === 'budget'
                ? 'bg-green-500'
                : priceStatus === 'premium'
                  ? 'bg-red-500'
                  : 'bg-amber-500'
            }`}
          >
            <p className="text-white font-semibold text-sm">{data.fullName}</p>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Price</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                ${data.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Category</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {data.category}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Rating</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ⭐ {data.rating}
              </span>
            </div>
            {stats && (
              <div
                className={`flex items-center gap-1 text-xs mt-1 pt-2 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                {priceStatus === 'budget' ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">
                      ${(stats.avg - data.price).toFixed(2)} below average
                    </span>
                  </>
                ) : priceStatus === 'premium' ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">
                      ${(data.price - stats.avg).toFixed(2)} above average
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Around average price</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    },
    [stats, theme]
  );

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No pizza data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Pizza Prices
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comparing prices across {chartData.length} pizzas
              </p>
            </div>
          </div>

          {/* Stats Pills */}
          {stats && (
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>From ${stats.min.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                <Minus className="w-3.5 h-3.5" />
                <span>Avg ${stats.avg.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Up to ${stats.max.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 md:p-6">
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <defs>
                {/* Gradient definitions for bars */}
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#f3f4f6'}
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: 11,
                  fontWeight: 500,
                }}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              <YAxis
                tick={{
                  fill: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 500,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={[0, 'dataMax + 2']}
              />

              {/* Average price reference line */}
              {stats && (
                <ReferenceLine
                  y={stats.avg}
                  stroke={theme === 'dark' ? '#fbbf24' : '#d97706'}
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={{
                    value: `Avg $${stats.avg.toFixed(2)}`,
                    fill: theme === 'dark' ? '#fbbf24' : '#d97706',
                    fontSize: 11,
                    fontWeight: 600,
                    position: 'right',
                  }}
                />
              )}

              <Tooltip
                content={renderTooltip}
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
              />

              <Bar dataKey="price" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, index) => {
                  const color = getBarColor(entry.price);
                  const gradientId =
                    color === '#22c55e'
                      ? 'url(#greenGradient)'
                      : color === '#ef4444'
                        ? 'url(#redGradient)'
                        : 'url(#amberGradient)';
                  return <Cell key={`cell-${index}`} fill={gradientId} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-green-500 to-green-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Budget-friendly</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-amber-500 to-amber-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Average price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-red-500 to-red-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 border-t-2 border-dashed border-amber-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Average line</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;
