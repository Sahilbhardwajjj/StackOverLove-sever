// Admin Authorization for all GET,POST,PATCH,DELETE requests
export const adminAuth = (req, res, next) => {
  const token = "xyz123";
  const isAuthorized = token === "xyz";

  if (!isAuthorized) {
    res.status(401).send("User is not Auth");
  } else {
    next();
  }
};
