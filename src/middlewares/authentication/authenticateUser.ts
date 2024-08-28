const passport = require("passport");
export const authenticateLocal = passport.authenticate("local", {
  successRedirect: "/table",
  failureRedirect: "/login",
  failureFlash: true,
});
