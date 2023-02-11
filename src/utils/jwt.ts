import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
//
import {
  Cognito,
  Locality,
  Post,
  Profile,
  Upload,
  Chat,
  PostBehavior,
  Connection,
  Search,
  History,
} from 'src/_clients';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

const setSession = (accessToken: string | null, refreshToken?: string | null) => {
  // console.log(accessToken);
  // console.log(refreshToken);

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    Post.setHeader('authorization', `Bearer ${accessToken}`);
    Upload.setHeader('authorization', `Bearer ${accessToken}`);
    Cognito.setHeader('authorization', `Bearer ${accessToken}`);
    Profile.setHeader('authorization', `Bearer ${accessToken}`);
    Locality.setHeader('authorization', `Bearer ${accessToken}`);
    Chat.setHeader('authorization', `Bearer ${accessToken}`);
    PostBehavior.setHeader('authorization', `Bearer ${accessToken}`);
    Connection.setHeader('authorization', `Bearer ${accessToken}`);
    Search.setHeader('authorization', `Bearer ${accessToken}`);
    History.setHeader('authorization', `Bearer ${accessToken}`);

    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    Post.setHeader('authorization', '');
    Upload.setHeader('authorization', '');
    Cognito.setHeader('authorization', '');
    Profile.setHeader('authorization', '');
    Locality.setHeader('authorization', '');
    Chat.setHeader('authorization', '');
    PostBehavior.setHeader('authorization', '');
    Connection.setHeader('authorization', '');
    Search.setHeader('authorization', '');
    History.setHeader('authorization', '');
  }
};

export { isValidToken, setSession, verify, sign };
