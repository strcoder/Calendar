/* eslint-disable no-param-reassign */

const reducer = (state: any, payload: any) => {
  switch (payload.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: payload.theme,
      };
    case 'LOGIN_REQUEST':
      return {
        ...state,
        user: payload.user,
      };
    case 'LOGOUT_REQUEST': {
      delete state.user;
      return state;
    }
    case 'SET_USER': {
      return {
        ...state,
        user: payload.user,
      };
    }
    case 'SET_ERROR': return state;
    default: return state;
  }
};

export default reducer;
