/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, Leaf, Flame } from 'lucide-react';
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
import { Input, Select, Button } from '../ui';
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

  // Track previous filter search value for external sync detection
  const prevFilterSearchRef = useRef(filters.search);

  // Local state for search input (for immediate UI feedback)
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce the search value (300ms delay)
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update Redux store when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setSearchFilter(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, filters.search]);

  // Sync local state when filters.search changes externally (e.g., via reset)
  // This effect handles the case where Redux state changes from outside (reset button)
  useEffect(() => {
    // Only sync if the change came from outside (not from our own dispatch)
    if (prevFilterSearchRef.current !== filters.search && filters.search !== localSearch) {
      setLocalSearch(filters.search);
    }
    prevFilterSearchRef.current = filters.search;
  }, [filters.search, localSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'classic', label: 'Classic' },
    { value: 'meat', label: 'Meat Lovers' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'specialty', label: 'Specialty' },
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

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.isVegetarian !== null ||
    filters.isSpicy !== null ||
    filters.maxPrice !== null ||
    filters.ingredient;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card p-4 md:p-6 space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input with debouncing */}
        <div className="flex-1">
          <Input
            placeholder="Search by name, description, ingredients..."
            value={localSearch}
            onChange={handleSearchChange}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Category filter */}
        <div className="w-full lg:w-48">
          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value as PizzaCategory | 'all'))}
          />
        </div>

        {/* Sort */}
        <div className="w-full lg:w-52">
          <Select
            options={sortOptions}
            value={`${sortOption.field}-${sortOption.direction}`}
            onChange={(e) => handleSortChange(e.target.value)}
          />
        </div>
      </div>

      {/* Advanced filters */}
      <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Filter className="w-4 h-4" />
          Filters:
        </span>

        {/* Vegetarian toggle */}
        <button
          onClick={() => dispatch(setVegetarianFilter(filters.isVegetarian === true ? null : true))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            filters.isVegetarian === true
              ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <Leaf className="w-4 h-4" />
          Vegetarian
        </button>

        {/* Spicy toggle */}
        <button
          onClick={() => dispatch(setSpicyFilter(filters.isSpicy === true ? null : true))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            filters.isSpicy === true
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <Flame className="w-4 h-4" />
          Spicy
        </button>

        {/* Price filter */}
        <select
          value={filters.maxPrice?.toString() || ''}
          onChange={(e) =>
            dispatch(setMaxPriceFilter(e.target.value ? Number(e.target.value) : null))
          }
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-none focus:ring-2 focus:ring-primary-500"
        >
          {priceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Ingredient filter */}
        <select
          value={filters.ingredient}
          onChange={(e) => dispatch(setIngredientFilter(e.target.value))}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-none focus:ring-2 focus:ring-primary-500"
        >
          {ingredientOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Reset filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default PizzaFilters;
