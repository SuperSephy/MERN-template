import React from "react";
import classnames from "classnames"; // Let's us make conditional HTML class names
import PropTypes from "prop-types";

/**
 * Basic Form Group Input
 *
 * Sample Usage:
 * <SelectListGroup
 *    name="sample"
 *    value={this.state.sample}
 *    onChange={this.onChange}
 *    error={errors.sample}
 *    options={ [{label: 'Label', value: 'label'}, {...}] }
 *  />
 */

const SelectListGroup = ({ name, value, options, error, info, onChange }) => {
  const selectOptions = options.map(option => (
    <option
      key={option.label || option.value}
      value={option.value || option.label}
      disabled={!!option.disabled}
    >
      {option.label}
    </option>
  ));

  return (
    <div className="form-group">
      <select
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        name={name}
        value={value}
        onChange={onChange}
      >
        {selectOptions}
      </select>

      {info && <small className="form-text text-muted">{info}</small>}

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  info: PropTypes.string,
  error: PropTypes.string
};

export default SelectListGroup;
