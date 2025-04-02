import type { User } from './user';

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}
