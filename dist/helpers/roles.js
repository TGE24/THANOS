"use strict";

var _accesscontrol = _interopRequireDefault(require("accesscontrol"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ac = new _accesscontrol["default"]();

exports.roles = function () {
  ac.grant("student").readOwn("profile").updateOwn("profile");
  ac.grant("supervisor").extend("student").readAny("profile");
  ac.grant("coordinator").extend("student").extend("supervisor").updateAny("profile").deleteAny("profile");
  return ac;
}();