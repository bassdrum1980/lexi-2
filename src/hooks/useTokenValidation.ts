import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { signOut, selectToken } from '../features/auth/authSlice';
import { getTokenExpirationTimeMs } from '../utils/auth';

const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (!token) return;

    const remainingTimeMs = getTokenExpirationTimeMs(token);
    if (remainingTimeMs <= 0) {
      dispatch(signOut());
    } else {
      timeoutId = setTimeout(() => {
        dispatch(signOut());
      }, remainingTimeMs);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, dispatch]);
};

export default useTokenValidation;
