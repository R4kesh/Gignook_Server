"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminJwt = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const authenticateAdminJwt = (req, res, next) => {
    const token = req.headers.authorization || req.query.token || req.cookies.token;
    console.log("Token received:", token);
    const actualToken = token && token.startsWith("Bearer ") ? token.slice(7) : token;
    if (!actualToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Actual token:", actualToken);
    try {
        const decoded = jsonwebtoken_1.default.verify(actualToken, process.env.ADMIN_SECRET);
        console.log("Decoded token:", decoded);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};
exports.authenticateAdminJwt = authenticateAdminJwt;
