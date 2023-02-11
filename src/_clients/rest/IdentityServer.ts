import axios from 'axios';

const defaultOptions = {
  baseURL: process.env.NEXTAUTH_CREDENTIAL_IDS_URL,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json',
  },
};

const IdentityServer = axios.create(defaultOptions);

IdentityServer.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || {
        message: 'خطایی در ارتباط با سرور رخ داد',
      }
    )
);

export default IdentityServer;
