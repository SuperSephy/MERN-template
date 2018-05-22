import React, {Component} from "react";

// Connect Redux to the component
import {connect} from "react-redux";

// Support Libraries
import PropTypes from "prop-types"; // Runtime type checking for React props and similar objects.

// Actions
import {getCurrentProfile} from "../../../actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    return (
      <div>
        <h1> Dashboard </h1>
      </div>
    );
  }
}

export default connect(null, {getCurrentProfile})(Dashboard);
