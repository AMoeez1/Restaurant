const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user._id,
      email: user.email,
    },
    "jwtsecretplzchange",
    { expiresIn: "30d" }
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const validToken = verify(accessToken, "jwtsecretplzchange");
    if (validToken) {
      req.user = validToken;
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports = { createToken, validateToken };
