import React from "react";
import { Route, Redirect } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * Checks if the user is logged in
 *  - if so shows the requested route
 *  - if not, redirects to login
 */
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
