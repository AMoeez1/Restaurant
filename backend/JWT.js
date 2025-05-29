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
    console.log("Access Token:", accessToken); // Add this line to debug


  if (!accessToken) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const validToken = verify(accessToken, "jwtsecretplzchange");
        console.log("Valid Token:", validToken); // Add this line to debug

    if (validToken) {
      req.user = validToken;
      req.authenticated = true;
      return next();
    }
  } catch (err) {
        console.log("Token Verification Error:", err.message); // Log any errors during token verification
    return res.status(400).json({ message: err });
  }
};

module.exports = { createToken, validateToken };
