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
  DollarSign,
  Clock,
  Image as ImageIcon,
  FileText,
  Tags,
  Leaf,
  Flame,
  Sparkles,
  ChefHat,
} from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addPizza } from '../store/slices/pizzaSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Button, Input, Select, Card } from '../components/ui';
import { HeroSection } from '../components/layout';
import { v4 as uuidv4 } from 'uuid';
import type { PizzaCategory } from '../types';

// ============================================================================
// Form Schema & Types
// ============================================================================

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

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_OPTIONS = [
  { value: 'classic', label: '🧀 Classic' },
  { value: 'meat', label: '🥓 Meat Lovers' },
  { value: 'vegetarian', label: '🥬 Vegetarian' },
  { value: 'specialty', label: '⭐ Specialty' },
];

const HERO_BADGES = [
  { icon: <ChefHat className="w-4 h-4" />, text: 'Create Your Masterpiece' },
  { icon: <Sparkles className="w-4 h-4" />, text: 'Add to Menu' },
];

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500';

// ============================================================================
// Reusable Form Section Component
// ============================================================================

interface FormSectionProps {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  noBorder?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  icon,
  iconBgClass,
  title,
  children,
  rightContent,
  noBorder = false,
}) => (
  <div className={noBorder ? 'pb-6' : 'pb-6 border-b border-gray-200 dark:border-gray-700'}>
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${iconBgClass}`}>{icon}</div>
      {title}
      {rightContent && <span className="ml-auto">{rightContent}</span>}
    </h2>
    {children}
  </div>
);

// ============================================================================
// Toggle Option Component
// ============================================================================

interface ToggleOptionProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  register: ReturnType<typeof useForm<PizzaFormData>>['register'];
  name: 'isVegetarian' | 'isSpicy';
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, icon, isActive, register, name }) => {
  return (
    <label
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isActive
          ? name === 'isVegetarian'
            ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <input type="checkbox" className="sr-only" {...register(name)} />
      <span
        className={
          isActive
            ? name === 'isVegetarian'
              ? 'text-accent-600'
              : 'text-red-600'
            : 'text-gray-400'
        }
      >
        {icon}
      </span>
      <span
        className={`text-sm font-medium ${
          isActive
            ? name === 'isVegetarian'
              ? 'text-accent-700 dark:text-accent-300'
              : 'text-red-700 dark:text-red-300'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </span>
    </label>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Add Pizza page with form validation
 * Uses react-hook-form with Zod schema validation
 */
export const AddPizza: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
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
      imageUrl: DEFAULT_IMAGE_URL,
      isVegetarian: false,
      isSpicy: false,
      prepTime: 15,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // Watch checkbox values for styling
  const isVegetarian = watch('isVegetarian');
  const isSpicy = watch('isSpicy');

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
      navigate('/menu');
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        theme="primary"
        subtitle="Create Your Pizza"
        title="Add New Pizza"
        description="Craft a delicious new pizza to add to your menu. Fill in the details below."
        badges={HERO_BADGES}
        backTo="/menu"
        backLabel="Back to Menu"
      />

      <div className="page-container py-8 max-w-3xl mx-auto">
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section: Basic Info */}
            <FormSection
              icon={<PizzaIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
              iconBgClass="bg-primary-100 dark:bg-primary-900/30"
              title="Basic Information"
            >
              <div className="space-y-4">
                <Input
                  label="Pizza Name"
                  placeholder="e.g., Margherita Supreme"
                  leftIcon={<PizzaIcon className="w-5 h-5" />}
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      placeholder="Describe your pizza's unique flavors and toppings..."
                      rows={3}
                      className={`
                        w-full px-4 py-3 pl-10 rounded-xl resize-none
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
              </div>
            </FormSection>

            {/* Section: Pricing & Time */}
            <FormSection
              icon={<DollarSign className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />}
              iconBgClass="bg-secondary-100 dark:bg-secondary-900/30"
              title="Pricing & Time"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </FormSection>

            {/* Section: Category & Image */}
            <FormSection
              icon={<ImageIcon className="w-4 h-4 text-accent-600 dark:text-accent-400" />}
              iconBgClass="bg-accent-100 dark:bg-accent-900/30"
              title="Category & Image"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  error={errors.category?.message}
                  {...register('category')}
                />

                <Input
                  label="Image URL"
                  placeholder="https://..."
                  leftIcon={<ImageIcon className="w-5 h-5" />}
                  error={errors.imageUrl?.message}
                  {...register('imageUrl')}
                />
              </div>
            </FormSection>

            {/* Section: Ingredients */}
            <FormSection
              icon={<Tags className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              iconBgClass="bg-purple-100 dark:bg-purple-900/30"
              title="Ingredients"
              rightContent={
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {fields.length} added
                </span>
              }
            >
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
                        aria-label={`Remove ingredient ${index + 1}`}
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
            </FormSection>

            {/* Section: Special Options */}
            <FormSection
              icon={<Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              iconBgClass="bg-amber-100 dark:bg-amber-900/30"
              title="Special Options"
              noBorder
            >
              <div className="flex flex-wrap gap-4">
                <ToggleOption
                  label="Vegetarian"
                  icon={<Leaf className="w-5 h-5" />}
                  isActive={isVegetarian}
                  register={register}
                  name="isVegetarian"
                />

                <ToggleOption
                  label="Spicy"
                  icon={<Flame className="w-5 h-5" />}
                  isActive={isSpicy}
                  register={register}
                  name="isSpicy"
                />
              </div>
            </FormSection>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="ghost" onClick={() => navigate('/menu')}>
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
    </div>
  );
};

export default AddPizza;
