module.exports.givePermissions = (req, res, next) => {
  if (!req.session) {
    return res.status(401).json("you have to login. ");
  }

  if (!req.session.user.permissions.includes("admin")) {
    return res.status(406).json("You dont have permission!");
  }
  next();
};
