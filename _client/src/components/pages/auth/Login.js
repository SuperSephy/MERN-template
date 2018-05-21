import React, {Component} from "react";

// Connect Redux to the component
import {connect} from "react-redux";

// Support Libraries
import PropTypes from "prop-types"; // Runtime type checking for React props and similar objects.

// Actions
import {loginUser} from "../../../actions/authActions";

// Custom Libs
import {log} from "../../../lib/logr";
import TextFieldInput from "../../elements/common/TextFieldInput";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    // Bind listeners
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      log("Login.js:", "User already logged in - redirecting to dashboard");
      this.props.history.push("/dashboard");
    }
  }

  // Lifecycle Method - runs when component receives new properties
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>

              <p className="lead text-center">Sign in to your DevConnector account</p>

              <form onSubmit={this.onSubmit}>
                <TextFieldInput
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <TextFieldInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
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
Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired
};

// Send State to Component
const mapStateToProps = state => ({
  errors: state.errors,

  // Puts auth state (from root reducer reducers/index.js) in property called auth
  // accessible as this.props.auth
  auth: state.auth
});

export default connect(mapStateToProps, {loginUser})(Login);
