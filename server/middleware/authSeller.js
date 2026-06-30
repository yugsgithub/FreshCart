import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies.token; // ✅ match the cookie name set during login

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      next(); // ✅ only call once, and only if authorized
    } else {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authSeller;
