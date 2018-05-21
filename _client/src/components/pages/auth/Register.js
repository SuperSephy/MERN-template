import React, {Component} from "react";
import {withRouter} from "react-router-dom";

// Connect Redux to the component
import {connect} from "react-redux";

// Support Libraries
import PropTypes from "prop-types"; // Runtime type checking for React props and similar objects.

// Actions
import {registerUser} from "../../../actions/authActions";

// Custom Libs
import TextFieldInput from "../../elements/common/TextFieldInput";
import {log} from "../../../lib/logr";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    // Bind listeners
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      log("Register.js:", "User already logged in - redirecting to dashboard");
      this.props.history.push("/dashboard");
    }
  }

  // Lifecycle Method - runs when component receives new properties
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) this.setState({errors: nextProps.errors});
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    // Uses the Register action      Pass router to action
    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>

              <p className="lead text-center">Create your DevConnector account</p>

              <form onSubmit={this.onSubmit} noValidate>
                <TextFieldInput
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldInput
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />

                <TextFieldInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldInput
                  name="password2"
                  type="password"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Enforce type casting, requirements, etc
// ComponentName.propTypes
Register.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired
};

// Send State to Component
const mapStateToProps = state => ({
  errors: state.errors,

  // Puts auth state (from root reducer reducers/index.js) in property called auth
  // accessible as this.props.auth
  auth: state.auth
});

//             Connect Redux            Map Actions
export default connect(mapStateToProps, {registerUser})(withRouter(Register));
