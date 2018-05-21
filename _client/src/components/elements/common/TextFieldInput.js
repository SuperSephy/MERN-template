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
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
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
  info: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
