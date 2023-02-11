import pino from 'pino';
import { pick } from 'ramda';
import { AuthToken, SignInCredentials } from 'src/@types/next-auth';
// import { IDR } from 'src/_clients';
// import { VERIFY_HOME_USER_MUTATION } from 'src/_requests/graphql/IDR/mutations/verifyHomeUser';

// import { REFRESH_MUTATION } from 'src/_requests/graphql/cognito/mutations/signUp';

const NEXTAUTH_DEBUG_MODE = String(process.env.NEXTAUTH_DEBUG) === 'true';

const logger = pino({
  name: 'NEXTAUTH',
  enabled: NEXTAUTH_DEBUG_MODE,
  prettyPrint: { translateTime: 'SYS:standard', ignore: 'pid,hostname,time' },
});

const nextAuthToken = {
  prepare: function (rawToken: Record<string, any>): AuthToken {
    const token: AuthToken = pick(
      ['access_token', 'refresh_token', 'token_type', 'user', 'scope', 'expires_in'],
      rawToken
    ) as AuthToken;
    token.expires_in = Date.now() + token.expires_in * 1000;
    return token;
  },
  create: async function (credentials: SignInCredentials, userAgent?: any): Promise<AuthToken> {
    logger.info(userAgent, '[USER AGENT]');
    try {
      logger.info({ ...credentials, password: '*******' }, '[CREATE_TOKEN][PARAMS]');

      const { phone, code } = credentials;
      // const {
      //   userMutations: {
      //     verifyHomeUser: {
      //       listDto: {
      //         items: [responseData],
      //       },
      //     },
      //   },
      // } = await IDR.request(VERIFY_HOME_USER_MUTATION, {
      //   data: {
      //     dto: {
      //       phoneNumber: phone,
      //       code,
      //     },
      //   },
      // });
      // FIXME:
      const responseData = { error: 'hi' };

      logger.info(responseData, '[CREATE_TOKEN][RESPONSE]');

      if (responseData?.error) {
        throw new Error(responseData?.error);
      }

      return this.prepare(responseData);
    } catch (error) {
      logger.error((error as any)?.message, '[CREATE_TOKEN][ERROR]');
      throw error;
    }
  },
  //   validate: async function (token: AuthToken): Promise<boolean> {
  //     try {
  //       logger.info({ token }, '[VALIDATE_TOKEN][PARAMS]');

  //       const response = await fetch(INTROSPECT_ACCESS_URL, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //         body: new URLSearchParams({
  //           client_id: 'commerceApi',
  //           client_secret: CLIENT_SECRET,
  //           token: token.access_token,
  //         }),
  //       });

  //       const responseData = await response.json();
  //       logger.info(responseData, '[VALIDATE_TOKEN][RESPONSE]');

  //       if (!response.ok || responseData?.error) {
  //         throw new Error(responseData?.error_description || responseData?.error);
  //       }

  //       const isValid: boolean = responseData?.active === true && responseData.client_id === CLIENT_ID;

  //       logger.info(`${isValid}`, '[VALIDATE_TOKEN][IS_VALID]');

  //       return isValid;
  //     } catch (error) {
  //       logger.error(error?.message, '[VALIDATE_TOKEN][ERROR]');
  //       return false;
  //     }
  //   },
  //   refresh: async function (prevToken: AuthToken): Promise<AuthToken> {
  //     try {
  //       logger.info({ prevToken }, '[REFRESH_TOKEN][PARAMS]');

  //       const response = await fetch(ACCESS_TOKEN_URL, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //         body: new URLSearchParams({
  //           client_id: CLIENT_ID,
  //           client_secret: CLIENT_SECRET,
  //           grant_type: 'refresh_token',
  //           refresh_token: prevToken.refresh_token,
  //         }),
  //       });

  //       const responseData = await response.json();
  //       logger.info(responseData, '[REFRESH_TOKEN][RESPONSE]');

  //       if (!(response?.ok && responseData?.access_token && responseData?.refresh_token) || responseData?.error) {
  //         throw new Error(responseData?.error_description || responseData?.error);
  //       }

  //       const newToken = this.prepare({ ...prevToken, ...responseData });
  //       logger.info(newToken, '[REFRESH_TOKEN][NEW_TOKEN]');

  //       return newToken;
  //     } catch (error) {
  //       logger.error(error?.message, '[REFRESH_TOKEN][ERROR]');
  //       return null;
  //     }
  //   },
  //   revoke: async function (token: AuthToken): Promise<void> {
  //     try {
  //       await fetch(REVOKE_ACCESS_TOKEN_URL, {
  //         method: 'POST',
  //         headers: { Authorization: token.access_token },
  //       });

  //       await fetch(REVOKE_REFRESH_TOKEN_URL, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //         body: new URLSearchParams({
  //           client_id: CLIENT_ID,
  //           client_secret: CLIENT_SECRET,
  //           token_type_hint: 'refresh_token',
  //           token: token.refresh_token,
  //         }),
  //       });
  //     } catch (error) {
  //       logger.error(error?.message, '[REVOKE_TOKEN]');
  //     }
  //   },
};

export default nextAuthToken;
