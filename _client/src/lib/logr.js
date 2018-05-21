// =================================
// Basic Logging Middleware ========
// =================================

const isLocal = window.location.hostname === "localhost";
const isInternal = /IMS_internal=Yes/.test(document.cookie);
let allowSend = false;

export const log = function() {
  allowSend && console.log.apply(null, arguments);
};

export const info = function() {
  allowSend && console.info.apply(null, arguments);
};

export const trace = function() {
  allowSend && console.trace.apply(null, arguments);
};

export const table = function() {
  allowSend && console.table.apply(null, arguments);
};

export const error = function() {
  allowSend && console.error.apply(null, arguments);
};

if (isLocal) {
  allowSend = true;
  log("logr.js:", "Local env detected - allowing logging");
} else if (isInternal) {
  allowSend = true;
  log("logr.js:", "Internal user detected - allowing logging");
}
