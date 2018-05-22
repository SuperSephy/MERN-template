import axios from "axios"; // HTTP request module

// Import Types to define, control, and limit available cases
import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());

  axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear Loading
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
