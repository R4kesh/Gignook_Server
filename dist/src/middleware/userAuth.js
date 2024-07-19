"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const authenticateUserJwt = (req, res, next) => {
    const token = req.cookies.access_token || req.headers["authorization"];
    const actualToken = token && token.startsWith("Bearer ") ? token.slice(7) : token;
    if (!actualToken) {
        console.log("No token provided");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(actualToken, process.env.SECRET);
        if (decoded.role !== "user") {
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
exports.default = authenticateUserJwt;
