// Import Types to define, control, and limit available cases
import { GET_ERRORS } from "../actions/types";

// Errors object
const initialState = {};

// Dispatches data to the reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;

    default:
      return state;
  }
}
