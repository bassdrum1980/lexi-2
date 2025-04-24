import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchURL } from '../routes';

// Depending on the current route, the theme changes
// by adding a theme-specific class to the body element
export const useTheme = () => {
  // Get the current pathname and strip of leading '/',
  let { pathname } = useLocation();
  pathname = pathname.replace(/^\/+/g, '');
  const themeClass = pathname.startsWith(searchURL)
    ? 'theme-search'
    : 'theme-default';

  useEffect(() => {
    document.body.classList.add(themeClass);
    return () => {
      document.body.classList.remove(themeClass);
    };
  }, [themeClass]);
};
