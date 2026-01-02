import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppSelector } from '../../store/hooks';
import { selectOrderDistributionData, selectTheme } from '../../store/selectors';
import { Card } from '../ui';
import { PieChart as PieIcon } from 'lucide-react';

/**
 * Pie chart showing distribution of pizzas in current order
 */
export const OrderDistributionChart: React.FC = () => {
  const data = useAppSelector(selectOrderDistributionData);
  const theme = useAppSelector(selectTheme);

  const colors = [
    '#ef4444',
    '#f59e0b',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
  ];

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    padding: '12px',
  };

  // Don't show empty state - just return null when no items
  if (data.length === 0) {
    return null;
  }

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
          <PieIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
        </div>
        <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white">
          Order Distribution
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {total} {total === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex gap-3">
        {/* Pie Chart - Fixed size */}
        <div className="flex-shrink-0 w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [`${value} ${value === 1 ? 'pizza' : 'pizzas'}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Compact Legend */}
        <div className="flex-1 min-w-0 max-h-24 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {data.map((item, index) => {
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xs group"
                  title={`${item.name}: ${item.value} (${percentage}%)`}
                >
                  <span
                    className="flex-shrink-0 w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="truncate text-gray-700 dark:text-gray-300 flex-1 min-w-0">
                    {item.name}
                  </span>
                  <span className="flex-shrink-0 font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderDistributionChart;
