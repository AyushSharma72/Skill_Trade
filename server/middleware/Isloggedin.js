const jwt = require("jsonwebtoken");

async function Isloggedin(req, resp, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return resp
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return resp.status(401).json({ message: "Invalid Token" });
  }
}

module.exports = Isloggedin;
