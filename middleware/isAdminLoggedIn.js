// Middleware to see if admin is logged in

const isAdminLoggedIn = (req, res, next) => {
  if (global.currentAdmin) {
    req.admin = global.currentAdmin;
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Access denied: User lacks administrative privileges.",
      status: 401,
    });
  }
};

export default isAdminLoggedIn;
