import { User } from './user';

export interface Auth {
  accessToken: string;
  refreshToken: string;
  user: User;
}
