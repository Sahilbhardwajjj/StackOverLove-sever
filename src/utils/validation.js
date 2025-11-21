const validator = require("validator");

const validateSignUpData = (req) => {
  const { username, firstName, email, password } = req.body;

  if (!username) {
    throw new Error("Enter a username");
  } else if (username.length > 30 || username.length < 3) {
    throw new Error("Username must be 3-30 characters");
  } else if (!firstName) {
    throw new Error("Enter a name");
  } else if (firstName.length > 25 || firstName.length < 3) {
    throw new Error("First name must be 3-25 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "role",
    "gender",
    "bio",
    "skills",
    "age",
    "photoUrl",
  ];

  const isAllowed = Object.keys(req.body).every((k) =>
    allowedUpdates.includes(k)
  );

  return isAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
