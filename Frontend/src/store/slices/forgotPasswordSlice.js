import {createSlice} from '@reduxjs/toolkit';

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    email: '',
    isLoading: false,
    message: '',
    error: '',
    serverError: '',
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setServerError(state, action) {
      state.serverError = action.payload;
    },
  },
});

export const {setEmail, setIsLoading, setMessage, setError, setServerError} =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
