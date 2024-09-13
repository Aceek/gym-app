export const setEmail = email => ({
  type: 'SET_EMAIL',
  payload: email,
});

export const setPassword = password => ({
  type: 'SET_PASSWORD',
  payload: password,
});

export const setErrors = errors => ({
  type: 'SET_ERRORS',
  payload: errors,
});
