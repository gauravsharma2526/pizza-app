import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed useDispatch hook for the application
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook for the application
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
