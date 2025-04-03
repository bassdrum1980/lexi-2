import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, signOut } from '../features/auth/authSlice';

const useSyncToken = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const syncToken = (event: StorageEvent) => {
      if (event.key === 'token') {
        if (event.newValue) {
          dispatch(setToken(event.newValue));
        } else {
          dispatch(signOut());
        }
      }
    };

    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [dispatch]);
};

export default useSyncToken;
