import { EmailOrPhoneNumberEnum, UserTypeEnum } from './sections/serverTypes';

export interface JWT_Token {
  id_token?: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
  fullname: string;
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | Record<string, any>;

type SignUpValuesType = {
  userType: UserTypeEnum | '';
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  verificationCode: string;
  signUpBy: 'email' | 'phoneNumber';
};

type ForgotPasswordValues = {
  username: string;
  verificationCode: string;
  usernameType: EmailOrPhoneNumberEnum;
};

export type JWTAuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
};

export type AuthState = {
  signUpValues: SignUpValuesType;
  forgotPasswordValues: ForgotPasswordValues;
  // isAuthenticated: boolean;
  // isInitialized: boolean;
  // user: AuthUser;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'jwt';
  login: (email: string, password: string) => Promise<{ fullName: string; id: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export type SignUpBasicInfoPaylodType = Pick<SignUpValuesType, 'username' | 'password'>;
export type SignUpByPayloadType = Pick<SignUpValuesType, 'signUpBy'>;

export type NormalUserInfoPayloadType = Pick<SignUpValuesType, 'firstName' | 'lastName'>;
export type NGOCompanyUserInfoPayloadType = Pick<SignUpValuesType, 'fullName'>;
export type SignUpUserTypePaylodType = Pick<SignUpValuesType, 'userType'>;
export type SignUpVerficationPayloadType = Pick<SignUpValuesType, 'verificationCode'>;
export type ForgetPasswordPayloadType = Pick<ForgotPasswordValues, 'username' | 'usernameType'>;
export type ForgetPasswordpVerficationPayloadType = Pick<ForgotPasswordValues, 'verificationCode'>;
