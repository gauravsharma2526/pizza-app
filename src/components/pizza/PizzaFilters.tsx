/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Leaf, 
  Flame, 
  DollarSign, 
  ChefHat,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingDown,
  Tag
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectPizzaFilters,
  selectPizzaSortOption,
  selectUniqueIngredients,
} from '../../store/selectors';
import {
  setSearchFilter,
  setCategoryFilter,
  setVegetarianFilter,
  setSpicyFilter,
  setMaxPriceFilter,
  setIngredientFilter,
  resetFilters,
  setSortOption,
} from '../../store/slices/pizzaSlice';
import { Input } from '../ui';
import { useDebounce } from '../../hooks';
import type { PizzaCategory, PizzaSortOption } from '../../types';

/**
 * Pizza filters and sorting controls
 * Uses debouncing for search input to prevent excessive re-renders
 */
export const PizzaFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectPizzaFilters);
  const sortOption = useAppSelector(selectPizzaSortOption);
  const allIngredients = useAppSelector(selectUniqueIngredients);

  // Track if user is currently typing (to prevent sync from overwriting)
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if we're intentionally clearing (to prevent debounced value from re-dispatching)
  const isClearingRef = useRef(false);

  // Local state for search input (for immediate UI feedback)
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce the search value (300ms delay)
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update Redux store when debounced value changes
  useEffect(() => {
    // Skip if we're intentionally clearing - don't re-dispatch stale debounced value
    if (isClearingRef.current) {
      // Reset the clearing flag once the debounced value has caught up
      if (debouncedSearch === '') {
        isClearingRef.current = false;
      }
      return;
    }
    if (debouncedSearch !== filters.search) {
      dispatch(setSearchFilter(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, filters.search]);

  // Sync local state ONLY when filters.search is reset externally (e.g., Clear All button)
  // We detect external reset by checking if filters.search became empty while we're not typing
  useEffect(() => {
    if (!isTypingRef.current && filters.search !== localSearch) {
      setLocalSearch(filters.search);
    }
  }, [filters.search, localSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Mark as typing to prevent sync from overwriting
    isTypingRef.current = true;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to mark as not typing after debounce completes
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 400); // Slightly longer than debounce delay
    
    setLocalSearch(e.target.value);
  }, []);

  // Handle clearing search input specifically
  const handleClearSearch = useCallback(() => {
    // Clear typing ref to allow sync
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    // Mark as clearing to prevent debounced value from re-dispatching
    isClearingRef.current = true;
    // Clear both local and redux state
    setLocalSearch('');
    dispatch(setSearchFilter(''));
  }, [dispatch]);

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    // Clear typing ref to allow sync
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    // Mark as clearing to prevent debounced value from re-dispatching
    isClearingRef.current = true;
    // Immediately clear local search state first
    setLocalSearch('');
    // Then reset all filters
    dispatch(resetFilters());
  }, [dispatch]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: '🍕' },
    { value: 'classic', label: 'Classic', icon: '🧀' },
    { value: 'meat', label: 'Meat Lovers', icon: '🥓' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { value: 'specialty', label: 'Specialty', icon: '⭐' },
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'rating-desc', label: 'Top Rated' },
    { value: 'rating-asc', label: 'Lowest Rated' },
  ];

  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '10', label: 'Under $10' },
    { value: '15', label: 'Under $15' },
    { value: '20', label: 'Under $20' },
    { value: '25', label: 'Under $25' },
  ];

  const ingredientOptions = [
    { value: '', label: 'Any Ingredient' },
    ...allIngredients.map((ing) => ({ value: ing, label: ing })),
  ];

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [
      PizzaSortOption['field'],
      PizzaSortOption['direction'],
    ];
    dispatch(setSortOption({ field, direction }));
  };

  // Count active filters (excluding sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.isVegetarian !== null) count++;
    if (filters.isSpicy !== null) count++;
    if (filters.maxPrice !== null) count++;
    if (filters.ingredient) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  // Check if quick filters are active
  const isBudgetFriendlyActive = filters.maxPrice === 15;
  const isUnder20Active = filters.maxPrice === 20;
  const isVeggieActive = filters.isVegetarian === true;

  // Quick filter handlers with toggle functionality
  const handleBudgetFriendly = useCallback(() => {
    if (isBudgetFriendlyActive) {
      dispatch(setMaxPriceFilter(null));
    } else {
      dispatch(setMaxPriceFilter(15));
    }
  }, [dispatch, isBudgetFriendlyActive]);

  const handleUnder20 = useCallback(() => {
    if (isUnder20Active) {
      dispatch(setMaxPriceFilter(null));
    } else {
      dispatch(setMaxPriceFilter(20));
    }
  }, [dispatch, isUnder20Active]);

  const handleVeggie = useCallback(() => {
    if (isVeggieActive) {
      dispatch(setVegetarianFilter(null));
    } else {
      dispatch(setVegetarianFilter(true));
    }
  }, [dispatch, isVeggieActive]);

  // Quick filter configuration with active state
  const quickFilters = [
    { label: 'Budget', icon: TrendingDown, action: handleBudgetFriendly, isActive: isBudgetFriendlyActive, color: 'emerald' },
    { label: 'Under $20', icon: Tag, action: handleUnder20, isActive: isUnder20Active, color: 'blue' },
    { label: 'Veggie', icon: Leaf, action: handleVeggie, isActive: isVeggieActive, color: 'green' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Filter Card */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />
        
        <div className="p-5 md:p-6">
          {/* Search Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search input with debouncing */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Input
                  placeholder="Search pizzas by name, description, or ingredients..."
                  value={localSearch}
                  onChange={handleSearchChange}
                  leftIcon={<Search className="w-5 h-5 text-primary-500" />}
                  className="!bg-gray-50 dark:!bg-gray-800/50 !border-gray-200 dark:!border-gray-700 hover:!border-primary-300 dark:hover:!border-primary-600 focus:!border-primary-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => dispatch(setCategoryFilter(cat.value as PizzaCategory | 'all'))}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filters.category === cat.value
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25 scale-[1.02]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02]'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters & Sort Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            {/* Quick Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">
                Quick:
              </span>
              {quickFilters.map((qf, idx) => {
                const activeStyles: Record<string, string> = {
                  amber: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25',
                  emerald: 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25',
                  blue: 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/25',
                  green: 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/25',
                };
                return (
                  <button
                    key={idx}
                    onClick={qf.action}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      qf.isActive
                        ? activeStyles[qf.color]
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <qf.icon className="w-3.5 h-3.5" />
                    {qf.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Sort:</span>
              </div>
              <select
                value={`${sortOption.field}-${sortOption.direction}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters & Clear Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            showAdvanced || activeFilterCount > 0
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          More Filters
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Reset filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 animate-slide-down">
          <div className="flex flex-wrap items-center gap-3">
            {/* Vegetarian toggle */}
            <button
              onClick={() => dispatch(setVegetarianFilter(filters.isVegetarian === true ? null : true))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                filters.isVegetarian === true
                  ? 'bg-accent-100 dark:bg-accent-900/30 border-accent-500 text-accent-700 dark:text-accent-300'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-accent-300 dark:hover:border-accent-600'
              }`}
            >
              <Leaf className={`w-4 h-4 ${filters.isVegetarian ? 'text-accent-600' : ''}`} />
              <span className="text-sm font-medium">Vegetarian</span>
            </button>

            {/* Spicy toggle */}
            <button
              onClick={() => dispatch(setSpicyFilter(filters.isSpicy === true ? null : true))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                filters.isSpicy === true
                  ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-600'
              }`}
            >
              <Flame className={`w-4 h-4 ${filters.isSpicy ? 'text-red-600' : ''}`} />
              <span className="text-sm font-medium">Spicy</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            {/* Price filter */}
            <div className="flex items-center gap-2">
              <DollarSign className={`w-4 h-4 ${filters.maxPrice ? 'text-secondary-600' : 'text-gray-400'}`} />
              <select
                value={filters.maxPrice?.toString() || ''}
                onChange={(e) =>
                  dispatch(setMaxPriceFilter(e.target.value ? Number(e.target.value) : null))
                }
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filters.maxPrice
                    ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-500 text-secondary-700 dark:text-secondary-300'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-secondary-300 dark:hover:border-secondary-600'
                }`}
              >
                {priceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ingredient filter */}
            <div className="flex items-center gap-2">
              <ChefHat className={`w-4 h-4 ${filters.ingredient ? 'text-primary-600' : 'text-gray-400'}`} />
              <select
                value={filters.ingredient}
                onChange={(e) => dispatch(setIngredientFilter(e.target.value))}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filters.ingredient
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                {ingredientOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Active:
                </span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <Search className="w-2.5 h-2.5" />
                    "{filters.search.slice(0, 15)}{filters.search.length > 15 ? '...' : ''}"
                    <button onClick={handleClearSearch} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    {categoryOptions.find(c => c.value === filters.category)?.icon} {filters.category}
                    <button onClick={() => dispatch(setCategoryFilter('all'))} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {filters.isVegetarian && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                    <Leaf className="w-2.5 h-2.5" /> Vegetarian
                    <button onClick={() => dispatch(setVegetarianFilter(null))} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {filters.isSpicy && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <Flame className="w-2.5 h-2.5" /> Spicy
                    <button onClick={() => dispatch(setSpicyFilter(null))} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
                    <DollarSign className="w-2.5 h-2.5" /> Under ${filters.maxPrice}
                    <button onClick={() => dispatch(setMaxPriceFilter(null))} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {filters.ingredient && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <ChefHat className="w-2.5 h-2.5" /> {filters.ingredient}
                    <button onClick={() => dispatch(setIngredientFilter(''))} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PizzaFilters;
