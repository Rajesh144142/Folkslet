import * as PostsApi from "../api/PostsRequests";

export const getTimelinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await PostsApi.getTimelinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};
export const commentInthePost = (id, data) => async (dispatch) => {
  dispatch({ type: "COMMENT_POST", data: { id, comments: data } });
  try {
    const response = await PostsApi.commentInthePost(id, data);
    dispatch({ type: "COMMENT_POST_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({ type: "COMMENT_POST_FAIL" });
  }
};
