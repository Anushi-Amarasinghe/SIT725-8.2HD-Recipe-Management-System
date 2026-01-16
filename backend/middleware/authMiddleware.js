
const jwt = require("jsonwebtoken");
const { sendError, ErrorCodes } = require("../utils/errorHandler");

<<<<<<< HEAD
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, "Not authorized - No token provided");
  }
=======
module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
>>>>>>> origin/shehan

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.userId = decoded.id; // attach user id to request
    req.userRole = decoded.role; // attach user role to request
    next();
  } catch (err) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, "Not authorized - Invalid or expired token");
  }
}
=======
>>>>>>> origin/shehan

 
    req.userId = decoded.id;

  
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
