import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';

const store = configureStore({
  reducer: {
    login: loginReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export default store;
