import { combineReducers } from "redux";

/**
 * Reducers
 *
 * Reducers specify HOW the application's state changes in response to actions sent to the store.
 * Actions only describe what happened, but don't describe how the application's state changes.
 */

// Import reducers
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";

// Combine Reducers
export default combineReducers({
  errors: errorReducer,
  auth: authReducer
});
