import {createSlice} from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: '',
    errors: {
      email: null,
      password: null,
    },
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setErrors(state, action) {
      state.errors = {...state.errors, ...action.payload};
    },
  },
});

export const {setEmail, setPassword, setErrors} = loginSlice.actions;

export default loginSlice.reducer;
