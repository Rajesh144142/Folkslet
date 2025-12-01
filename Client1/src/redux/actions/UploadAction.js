import * as UploadApi from '../../features/home/api/UploadRequest';
import { UPLOAD_START, UPLOAD_SUCCESS, UPLOAD_FAIL } from '../actionTypes';

export const uploadImage = (data) => async () => {
  try {
    const response = await UploadApi.uploadImage(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPost = (data) => async (dispatch) => {
  dispatch({ type: UPLOAD_START });
  try {
    const response = await UploadApi.uploadPost(data);
    dispatch({ type: UPLOAD_SUCCESS, data: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: UPLOAD_FAIL, error: error.message });
    throw error;
  }
};