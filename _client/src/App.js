// React Base Libraries
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux Base Libraries
import { Provider } from "react-redux"; // Store that will hold the state
import store from "./store"; // Imports Store => Reducers

// Authentication handling
import jwt_decode from "jwt-decode";
import setAuthToken from "./lib/setAuthToken";
import { setCurrentUser, logOutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

// Bring in Components
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/elements/Navbar";
import Footer from "./components/elements/Footer";
import Landing from "./components/elements/Landing";

// Bring in Pages
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";
import Dashboard from "./components/pages/dashboard/Dashboard";

// Bring in Resources
import "./App.css";

// Check for token (persists logged in status between pages)
if (localStorage.imsToken) {
  // Set auth token header auth
  setAuthToken(localStorage.imsToken);

  // Decode token adn get user info and expiration
  const decodedUser = jwt_decode(localStorage.imsToken);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decodedUser));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decodedUser.exp < currentTime) {
    store.dispatch(logOutUser());

    // Clear current profile
    store.dispatch(clearCurrentProfile());

    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

            <Route exact path="/" component={Landing} />

            <div className="container">
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />

                {/* Private Routes need to be wrapped in */}
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
