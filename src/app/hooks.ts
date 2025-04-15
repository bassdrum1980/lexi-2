import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Provides typed useDispatch and useSelector hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
