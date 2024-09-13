const initialState = {
  email: '',
  password: '',
  errors: {
    email: null,
    password: null,
  },
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default loginReducer;
