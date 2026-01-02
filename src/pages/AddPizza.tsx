import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Pizza as PizzaIcon,
  Plus,
  X,
  Save,
  ArrowLeft,
  DollarSign,
  Clock,
  Image as ImageIcon,
  FileText,
  Tags,
} from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addPizza } from '../store/slices/pizzaSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Button, Input, Select, Card } from '../components/ui';
import { v4 as uuidv4 } from 'uuid';
import type { PizzaCategory } from '../types';

// Form validation schema
const pizzaSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z
    .number({ error: 'Price must be a number' })
    .positive('Price must be greater than 0')
    .max(100, 'Price must be less than $100'),
  category: z.enum(['classic', 'meat', 'vegetarian', 'specialty'], {
    error: 'Please select a category',
  }),
  ingredients: z
    .array(z.object({ value: z.string().min(1, 'Ingredient cannot be empty') }))
    .min(1, 'At least one ingredient is required'),
  imageUrl: z.string().url('Please enter a valid URL'),
  isVegetarian: z.boolean(),
  isSpicy: z.boolean(),
  prepTime: z
    .number({ error: 'Prep time must be a number' })
    .int('Prep time must be a whole number')
    .positive('Prep time must be greater than 0')
    .max(60, 'Prep time must be less than 60 minutes'),
});

type PizzaFormData = z.infer<typeof pizzaSchema>;

/**
 * Add Pizza page with form validation
 */
export const AddPizza: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PizzaFormData>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'classic',
      ingredients: [{ value: '' }],
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
      isVegetarian: false,
      isSpicy: false,
      prepTime: 15,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const categoryOptions = [
    { value: 'classic', label: 'Classic' },
    { value: 'meat', label: 'Meat Lovers' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'specialty', label: 'Specialty' },
  ];

  const onSubmit = (data: PizzaFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newPizza = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category as PizzaCategory,
        ingredients: data.ingredients.map((i) => i.value),
        imageUrl: data.imageUrl,
        isVegetarian: data.isVegetarian,
        isSpicy: data.isSpicy,
        rating: 4.5, // Default rating for new pizzas
        prepTime: data.prepTime,
      };

      dispatch(addPizza(newPizza));
      dispatch(
        addNotification({
          id: uuidv4(),
          type: 'success',
          message: `${data.name} has been added to the menu!`,
        })
      );

      setIsSubmitting(false);
      reset();
      navigate('/');
    }, 1000);
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
          <PizzaIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Add New Pizza
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new pizza to add to your menu</p>
      </div>

      {/* Form */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <Input
              label="Pizza Name"
              placeholder="Enter pizza name"
              leftIcon={<PizzaIcon className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                placeholder="Describe your pizza..."
                rows={3}
                className={`
                  w-full px-4 py-3 pl-10 rounded-xl
                  bg-gray-50 border border-gray-200
                  text-gray-900 placeholder-gray-400
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-900
                  ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}
                `}
                {...register('description')}
              />
            </div>
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Prep Time row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  leftIcon={<DollarSign className="w-5 h-5" />}
                  error={errors.price?.message}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />

            <Controller
              name="prepTime"
              control={control}
              render={({ field }) => (
                <Input
                  label="Prep Time (minutes)"
                  type="number"
                  min="1"
                  placeholder="15"
                  leftIcon={<Clock className="w-5 h-5" />}
                  error={errors.prepTime?.message}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>

          {/* Category */}
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />
          </div>

          {/* Image URL */}
          <div>
            <Input
              label="Image URL"
              placeholder="https://example.com/pizza.jpg"
              leftIcon={<ImageIcon className="w-5 h-5" />}
              error={errors.imageUrl?.message}
              {...register('imageUrl')}
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ingredients
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Ingredient ${index + 1}`}
                      leftIcon={<Tags className="w-5 h-5" />}
                      error={errors.ingredients?.[index]?.value?.message}
                      {...register(`ingredients.${index}.value`)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ value: '' })}
                className="w-full"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </Button>
            </div>
            {errors.ingredients?.message && (
              <p className="mt-1.5 text-sm text-red-500">{errors.ingredients.message}</p>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                {...register('isVegetarian')}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Vegetarian
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                {...register('isSpicy')}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Spicy</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
              <Save className="w-4 h-4" />
              Add Pizza to Menu
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPizza;
