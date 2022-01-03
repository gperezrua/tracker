import { SET_EMAIL, SET_PASSWORD, RESET_FORM } from './LoginTypes';

const LoginReducer = (state, action) => {
    switch (action.type) {
      case SET_EMAIL:
        return {
          ...state,
          user: {
            ...state.user,
            email: action.value,
          },
        };
      case SET_PASSWORD:
        return {
          ...state,
          user: {
            ...state.user,
            password: action.value,
          },
        };
      case RESET_FORM:
        return {
          ...state,
          user: {
            email: '',
            password: '',
          },
        };
      default:
        return {
          ...state,
        };
    }
  };
  
  export default LoginReducer;