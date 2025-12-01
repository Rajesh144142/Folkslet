import { SET_THEME, TOGGLE_THEME } from '../actionTypes';

const getInitialMode = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = window.localStorage.getItem('folkslet-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState = { mode: getInitialMode() };

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME: {
      const mode = action.payload === 'dark' ? 'dark' : 'light';
      return { ...state, mode };
    }
    case TOGGLE_THEME:
      return { ...state, mode: state.mode === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
};

export default themeReducer;

