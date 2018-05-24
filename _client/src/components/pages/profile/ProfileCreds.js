import React, { Component } from "react";

// Support libs
import Moment from "react-moment";

class ProfileCreds extends Component {
  render() {
    const { education, experience } = this.props;

    const expItems = experience.map(exp => (
      <li className="list-group-item" key={exp._id}>
        <h4>{exp.company}</h4>
        <p>
          <Moment format=" MMM YYYY">{exp.from}</Moment> -
          {exp.to === null ? " Current" : <Moment format=" MMM YYYY">{exp.to}</Moment>}
        </p>

        <p>
          <strong>Position:</strong> {exp.title}
        </p>

        {exp.location ? (
          <p>
            <strong>Location:</strong> {exp.location}
          </p>
        ) : null}

        {exp.description ? (
          <p>
            <strong>Description:</strong> {exp.description}
          </p>
        ) : null}
      </li>
    ));

    const eduItems = education.map(edu => (
      <li className="list-group-item" key={edu._id}>
        <h4>{edu.school}</h4>
        <p>
          <Moment format=" MMM YYYY">{edu.from}</Moment> -
          {edu.to === null ? " Current" : <Moment format=" MMM YYYY">{edu.to}</Moment>}
        </p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field Of Study: </strong>
          {edu.fieldOfStudy}
        </p>

        {edu.description ? (
          <p>
            <strong>Description:</strong> {edu.description}
          </p>
        ) : null}
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          {expItems.length ? (
            <ul className="list-group">{expItems}</ul>
          ) : (
            <p className="text-center">No experience listed</p>
          )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          {eduItems.length ? (
            <ul className="list-group">{eduItems}</ul>
          ) : (
            <p className="text-center">No education listed</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
