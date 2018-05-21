import axios from "axios"; // HTTP request module

// Bring in JWT Token functions
import setAuthToken from "../lib/setAuthToken";
import jwt_decode from "jwt-decode";

// Import Types to define, control, and limit available cases
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

const TOKEN_NAME = "imsToken";

// Register User
export const registerUser = (userData, history) => dispatch => {
  // Direct call method (Bypasses Redux)
  axios
    .put("/api/auth/user", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/auth/user", userData)
    .then(res => {
      console.log("Response", res.data);

      // Save to local storage
      const { token } = res.data;

      // Set token to local storage
      localStorage.setItem(TOKEN_NAME, token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.log("Error", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set Logged In User
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log User Out
export const logOutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem(TOKEN_NAME);

  // Remove Auth header for future requests
  setAuthToken(false);

  // Set current user to {} which will also set isAuthenticated to false
  // Managed by authReducer.js
  dispatch(setCurrentUser({}));
};
