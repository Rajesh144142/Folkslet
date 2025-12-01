import * as UserApi from '../../features/home/api/UserRequests';
import { UPDATING_START, UPDATING_SUCCESS, UPDATING_FAIL } from '../actionTypes';

export const updateUser = (id, formData) => async (dispatch) => {
  dispatch({ type: UPDATING_START });
  try {
    const data = await UserApi.updateUser(id, formData);
    dispatch({ type: UPDATING_SUCCESS, data });
    return data;
  } catch (error) {
    dispatch({ type: UPDATING_FAIL, error: error.message });
    throw error;
  }
};

export const followUser = (id, data) => async (dispatch) => {
  await UserApi.followUser(id, data);
};

export const unfollowUser = (id, data) => async (dispatch) => {
  await UserApi.unfollowUser(id, data);
};
