"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGoogleUserJWT = exports.generateRefreshJWT = exports.adminGenerateJWT = exports.generateUserJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateUserJWT = (userid, role = "user") => {
    return jsonwebtoken_1.default.sign({ id: userid, role }, process.env.SECRET, {
        expiresIn: "2h",
    });
};
exports.generateUserJWT = generateUserJWT;
const adminGenerateJWT = (adminEmail, role = "admin") => {
    return jsonwebtoken_1.default.sign({ email: adminEmail, role }, process.env.ADMIN_SECRET, {
        expiresIn: "4h",
    });
};
exports.adminGenerateJWT = adminGenerateJWT;
const generateRefreshJWT = (userid, role = "user") => {
    return jsonwebtoken_1.default.sign({ id: userid, role }, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshJWT = generateRefreshJWT;
const generateGoogleUserJWT = (userid, role = "user") => {
    return jsonwebtoken_1.default.sign({ id: userid, role }, process.env.SECRET, {
        expiresIn: "2h",
    });
};
exports.generateGoogleUserJWT = generateGoogleUserJWT;
