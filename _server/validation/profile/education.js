const Validator = require("validator");
const isEmpty = require("../_isEmpty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  // Validator requires strings
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) errors.school = "School name is required";
  if (Validator.isEmpty(data.degree)) errors.degree = "Degree type field is required";
  if (Validator.isEmpty(data.fieldOfStudy)) errors.fieldOfStudy = "Field of study is required";
  if (Validator.isEmpty(data.from)) errors.from = "From date field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
