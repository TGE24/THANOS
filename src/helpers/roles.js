import AccessControl from "accesscontrol";
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("student")
    .readOwn("profile")
    .updateOwn("profile");

  ac.grant("supervisor")
    .extend("student")
    .readAny("profile");

  ac.grant("coordinator")
    .extend("student")
    .extend("supervisor")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
