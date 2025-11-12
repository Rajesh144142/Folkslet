import { login as loginRequest, signUp as signUpRequest } from '../../api/authApi';
import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, LOG_OUT } from '../actionTypes';

export const logIn = (formData) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await loginRequest(formData);
    dispatch({ type: AUTH_SUCCESS, data });
    return data;
  } catch (error) {
    dispatch({ type: AUTH_FAIL, error: error.message });
    throw error;
  }
};

export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: AUTH_START });
  try {
    const { data } = await signUpRequest(formData);
    dispatch({ type: AUTH_SUCCESS, data });
    return data;
  } catch (error) {
    dispatch({ type: AUTH_FAIL, error: error.message });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
};
