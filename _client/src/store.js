import { compose, createStore, applyMiddleware } from "redux";

// allows you to write action creators that return a function instead of an action
import thunk from "redux-thunk";

// Bring in reducers
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Initialize Redux Chrome Extension
  )
);

export default store;
