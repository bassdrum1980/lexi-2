import axios from 'axios';

const authInstance = axios.create({
  baseURL: `${import.meta.env.SERVER_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

/**
 * Sign in a user.
 *
 * @param {Object} params - Sign-in parameters.
 * @param {string} params.email - User's email.
 * @param {string} params.password - User's password.
 *
 * @returns {Promise<{ token: string; user: object }>} Response data containing token and user info.
 * @throws {Error} If the credentials are invalid or the user is not found.
 */

export interface SignInParams {
  email: string;
  password: string;
}

export const postSignIn = async ({ email, password }: SignInParams) => {
  try {
    const response = await authInstance.post('/signin', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage = error.response.data?.error;

      const errorMap: Record<string, string> = {
        'Invalid Credentials':
          'Invalid Credentials. The email or password you entered is incorrect. Please try again.',
        'User Not Found':
          'The email you entered is not registered. Please try again.',
      };

      if (errorMessage && errorMap[errorMessage]) {
        throw new Error(errorMap[errorMessage]);
      }
    }

    throw new Error(
      "We're sorry, but there was an issue with the server. Please try again later."
    );
  }
};
