import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // const { enqueueSnackbar } = useSnackbar();
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    const errMsg = action.payload.message.replace('GraphQL.ExecutionError: ', '');
    const indexOfErr = errMsg.indexOf(':');
    toast(errMsg.slice(0, indexOfErr), { type: 'error' });
  }

  return next(action);
};
