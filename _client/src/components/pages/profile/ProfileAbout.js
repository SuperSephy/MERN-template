import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "../../../validation/_isEmpty";

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;
    const firstName = profile.user.name.trim().split(" ")[0];
    const skills = profile.skills.map((skill, key) => (
      <div className="p-3" key={key}>
        <i className="fa fa-check" /> {skill}
      </div>
    ));

    return isEmpty(profile.bio) && isEmpty(profile.skills) ? null : (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            {isEmpty(profile.bio) ? null : (
              <div>
                <h3 className="text-center text-info">{firstName}'s Bio</h3>
                <p className="lead">{profile.bio}</p>
              </div>
            )}

            {isEmpty(profile.bio) || isEmpty(profile.skills) ? null : <hr />}

            {isEmpty(skills) ? null : (
              <div>
                <h3 className="text-center text-info">Skill Set</h3>

                <div className="row">
                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                    {skills}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
