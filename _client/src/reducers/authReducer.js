import isEmpty from "../validation/_isEmpty";

// Import type variable
import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

// Dispatches data to the reducer
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload), // Boolean for whether user is authenticated or not
        user: action.payload // User object
      };
    default:
      return state;
  }
}
