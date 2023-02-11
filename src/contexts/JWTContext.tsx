import axiosApi from 'axios';
import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { getUserQuery } from 'src/_requests/graphql/profile/users/queries/getUser';
// @types
import { ActionMap, AuthUser, JWTAuthState, JWTContextType } from '../@types/auth';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: JWTAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: JWTAuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  const initialize = async () => {
    try {
      const accessToken = window.localStorage.getItem('accessToken');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = await getUserQuery();

        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = async (username: string, password: string) => {
    // const { token: accessToken, refreshToken } = await signInMutation(username, password);
    // const option = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-amz-json-1.1',
    //     'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    //   },
    //   body: JSON.stringify({
    //     AuthParameters: {
    //       USERNAME: username,
    //       PASSWORD: password,
    //     },
    //     AuthFlow: 'USER_PASSWORD_AUTH',
    //     ClientId: '3f5pab69mto473lfm2c09ivc7k',
    //     options: {
    //       language: 'json',
    //     },
    //   }),
    // };
    // const { data } = await axiosApi.post('https://cognito-idp.us-east-1.amazonaws.com', option.body, {
    //   headers: option.headers,
    // });
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('client_id', 'gol_client');
    urlencoded.append('grant_type', 'password');
    urlencoded.append('client_secret', 'b56eaf7d-0f44-48fe-80cc-367aae6aeff3');
    urlencoded.append('username', username);
    urlencoded.append('password', password);
    urlencoded.append('scope', 'offline_access openid profile');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };

    const data = await fetch('https://devids.aws.gardenoflove.co/connect/token?lang=en-US', requestOptions)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .catch((error) => console.log('error', error));
    setSession(data.access_token);

    const user: any = await getUserQuery();

    dispatch({
      type: Types.Login,
      payload: {
        user,
      },
    });
    return { fullName: user?.fullName, id: user?.id };
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        initialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
