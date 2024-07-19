"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    joinedate: {
        type: Date,
        default: Date.now
    },
    isFreelancer: {
        type: Boolean,
        default: false,
    },
    displayName: {
        type: String,
    },
    description: {
        type: String,
    },
    languages: {
        type: [String],
    },
    occupation: {
        type: String,
    },
    service: {
        type: [String],
    },
    skills: {
        type: [String],
    },
    education: {
        type: [String],
    },
    personalWebsite: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    rating: {
        type: Number,
        default: 1
    },
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    document: {
        type: [String]
    },
    application: {
        type: String,
    },
    work: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Work'
    },
    posts: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Post' }],
    savedPosts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }],
    payment: [{ type: mongoose_1.default.Types.ObjectId, ref: 'payment' }],
});
const User = mongoose_1.default.model('userCollection', userSchema);
exports.default = User;
