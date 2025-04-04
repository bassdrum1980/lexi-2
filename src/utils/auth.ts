import { jwtDecode } from 'jwt-decode';

export const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token;
};

export const setTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem('token');
};

export const isTokenExpired = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    if (exp === undefined) return true;
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getTokenExpirationTimeMs = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    if (exp === undefined) return 0;
    return exp * 1000 - Date.now();
  } catch {
    return 0;
  }
};

export const validateToken = (token: string | null) => {
  return token && !isTokenExpired(token) ? token : null;
};
