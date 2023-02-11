import { CallbacksOptions } from 'next-auth/core/types';
import { NextAuthOptions } from 'next-auth';

export interface AuthToken {
  user: any;
  scope: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export type JWTCallbackParamType = Parameters<CallbacksOptions['jwt']>[0] & {
  token: AuthToken;
};

export interface SignInCredentials {
  phone: string;
  code: string;
}

export type NextAuthParamOptions = NextAuthOptions | any | ((defaultOptions: NextAuthOptions) => NextAuthOptions | any);
