import { UserInfo } from '../models';

export interface AuthState {
  userInfo: UserInfo;
  error: any;
}
