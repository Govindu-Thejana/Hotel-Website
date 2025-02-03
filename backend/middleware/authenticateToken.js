import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key"; // Use an environment variable in production

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Token is missing or malformed" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.id; // Attach user ID to the request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" });
        }
        res.status(403).json({ message: "Forbidden: Unable to authenticate" });
    }
};

export default authenticateToken;
