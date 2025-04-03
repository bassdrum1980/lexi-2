import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string) => {
  if (!token) return true; // No token = expired
  try {
    const { exp } = jwtDecode(token);
    if (exp === undefined) return true; // No expiration time = treat as expired
    return exp * 1000 < Date.now(); // Expiry time is in seconds (Unix origin), convert to ms
  } catch (error) {
    console.error('Token decoding error:', error);
    return true; // Invalid token = treat as expired
  }
};
