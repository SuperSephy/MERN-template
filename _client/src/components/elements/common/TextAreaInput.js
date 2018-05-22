import React from "react";
import classnames from "classnames"; // Let's us make conditional HTML class names
import PropTypes from "prop-types";

/**
 * Basic Form Group Input
 *
 * Sample Usage:
 * <TextAreaGroup
 *    name="sample"
 *    placeholder="Sample Text"
 *    value={this.state.sample}
 *    onChange={this.onChange}
 *    error={errors.sample}
 *  />
 */

const TextAreaGroup = ({ name, placeholder, value, error, info, onChange }) => {
  return (
    <div className="form-group">
      <textarea
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextAreaGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string
};

export default TextAreaGroup;
