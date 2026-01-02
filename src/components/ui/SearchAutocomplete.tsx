/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectAllPizzas } from '../../store/selectors';
import { useDebounce } from '../../hooks';
import type { Pizza } from '../../types';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (pizza: Pizza) => void;
  placeholder?: string;
  className?: string;
}

// Popular/suggested search terms
const POPULAR_SEARCHES = ['Margherita', 'Pepperoni', 'Vegetarian', 'Spicy', 'Cheese'];

// Recent searches (would be persisted in real app)
const MAX_RECENT_SEARCHES = 5;

/**
 * Search input with autocomplete suggestions
 * Shows pizza results as user types with debouncing
 */
export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search pizzas...',
  className = '',
}) => {
  const allPizzas = useAppSelector(selectAllPizzas);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('pizza-recent-searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search value
  const debouncedValue = useDebounce(value, 200);

  // Filter pizzas based on search
  const suggestions = React.useMemo(() => {
    if (!debouncedValue.trim()) return [];

    const searchLower = debouncedValue.toLowerCase();
    return allPizzas
      .filter(
        (pizza) =>
          pizza.name.toLowerCase().includes(searchLower) ||
          pizza.ingredients.some((ing) => ing.toLowerCase().includes(searchLower)) ||
          pizza.description.toLowerCase().includes(searchLower)
      )
      .slice(0, 5);
  }, [debouncedValue, allPizzas]);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;

    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem('pizza-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pizza-recent-searches');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    const itemCount = suggestions.length > 0 ? suggestions.length : recentSearches.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (suggestions.length > 0 && suggestions[highlightedIndex]) {
            const pizza = suggestions[highlightedIndex];
            onChange(pizza.name);
            saveRecentSearch(pizza.name);
            onSelect?.(pizza);
            setIsOpen(false);
          } else if (recentSearches[highlightedIndex]) {
            onChange(recentSearches[highlightedIndex]);
            setIsOpen(false);
          }
        } else if (value.trim()) {
          saveRecentSearch(value.trim());
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions.length]);

  const showDropdown = isOpen && (suggestions.length > 0 || value === '');

  return (
    <div className={`relative ${className}`}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-900"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-slide-up"
        >
          {/* Search results */}
          {suggestions.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Pizzas
              </p>
              {suggestions.map((pizza, index) => (
                <Link
                  key={pizza.id}
                  to={`/pizza/${pizza.id}`}
                  onClick={() => {
                    saveRecentSearch(pizza.name);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    index === highlightedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <img
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {pizza.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {pizza.ingredients.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-0.5 text-xs text-secondary-500">
                      <Star className="w-3 h-3 fill-current" />
                      {pizza.rating}
                    </div>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      ${pizza.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Recent
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term, index) => (
                    <button
                      key={term}
                      onClick={() => {
                        onChange(term);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        index === highlightedIndex
                          ? 'bg-primary-50 dark:bg-primary-900/30'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular searches */}
              <div className="p-2">
                <p className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        onChange(term);
                        saveRecentSearch(term);
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Search all hint */}
          {value && suggestions.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">
                  Enter
                </kbd>{' '}
                to search all pizzas for "{value}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
