import React from "react";
import classnames from "classnames"; // Let's us make conditional HTML class names
import PropTypes from "prop-types";

/**
 * Basic Form Group Input
 *
 * Sample Usage:
 * <TextFieldGroup
 *    name="sample"
 *    type="text"
 *    placeholder="Sample Text"
 *    value={this.state.sample}
 *    onChange={this.onChange}
 *    error={errors.sample}
 *  />
 */

const TextFieldGroup = ({
  name,
  label,
  type,
  value,
  placeholder,
  icon,
  error,
  info,
  onChange,
  disabled
}) => {
  const textInput = (
    <input
      type={type}
      className={classnames("form-control form-control-lg", {
        "is-invalid": error
      })}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );

  return icon ? (
    <div className="form-group">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className={icon} />
          </span>
        </div>

        {textInput}

        {info && <small className="form-text text-muted">{info}</small>}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  ) : (
    <div className="form-group">
      {textInput}

      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
