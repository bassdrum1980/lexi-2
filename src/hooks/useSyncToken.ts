import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setToken } from '../features/auth/authSlice';

const useSyncToken = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Sync token with local storage across tabs
    const syncToken = (event: StorageEvent) => {
      if (event.key === 'token') {
        dispatch(setToken(event.newValue));
      }
    };

    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [dispatch]);
};

export default useSyncToken;
