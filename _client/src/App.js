// React Base Libraries
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux Base Libraries
import { Provider } from "react-redux"; // Store that will hold the state
import store from "./store"; // Imports Store => Reducers

// Authentication handling
import jwt_decode from "jwt-decode";
import setAuthToken from "./lib/setAuthToken";
import { clearCurrentProfile } from "./actions/profileActions";
import { setCurrentUser, logOutUser } from "./actions/authActions";

// Bring in Components
import Navbar from "./components/elements/Navbar";
import Footer from "./components/elements/Footer";
import Landing from "./components/elements/Landing";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/pages/NotFound";

// Bring in Pages
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Profile from "./components/pages/profile/Profile";
import Profiles from "./components/pages/profile/Profiles";

import CreateProfile from "./components/pages/profile/CreateProfile";
import EditProfile from "./components/pages/profile/EditProfile";
import AddEducation from "./components/pages/profile/AddEducation";
import AddExperience from "./components/pages/profile/AddExperience";

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
                {/* Public Routes  */}
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:handle" component={Profile} />

                {/* Private Routes need to be wrapped in - CUSTOM COMPONENT */}
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
                <PrivateRoute exact path="/add-education" component={AddEducation} />
              </Switch>

              {/* Error Handling */}
              <Route exact path="/notFound" component={NotFound} />
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
