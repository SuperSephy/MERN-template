import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Actions
import { getProfiles } from "../../../actions/profileActions";

// Resources
import ProfilesItem from "./ProfilesItem";
import Spinner from "../../elements/common/Spinner";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length) {
        profileItems = profiles.map(profile => (
          <ProfilesItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>

              <p className="lead text-center">Browse and connect with developers</p>

              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
