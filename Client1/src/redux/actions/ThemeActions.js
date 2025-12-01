import { SET_THEME, TOGGLE_THEME } from '../actionTypes';

export const setTheme = (mode) => ({
  type: SET_THEME,
  payload: mode,
});

export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

