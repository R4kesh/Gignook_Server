"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const express_1 = require("express");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const post_1 = __importDefault(require("../models/post"));
const payment_1 = __importDefault(require("../models/payment"));
const feedback_1 = __importDefault(require("../models/feedback"));
const orders_1 = __importDefault(require("../models/orders"));
dotenv_1.default.config();
class userRepository {
    SignupUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, email, password } = userData;
                const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
                const emailToken = crypto_1.default.randomBytes(64).toString('hex');
                const newUser = new userModel_1.default({ firstname, lastname, email, password: hashedPassword, emailToken, });
                yield newUser.save();
                let BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`;
                const verificationLink = `${BASE_URL}/verify?token=${emailToken}`;
                const emailTemplatePath = path_1.default.join(__dirname, '../../../public/verifyEmail/emailVerify.html');
                const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf-8');
                const emailContent = emailTemplate.replace(/{firstname}/g, firstname).replace(/{verificationLink}/g, verificationLink);
                const transporter = nodemailer_1.default.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });
                const mailOptions = {
                    from: "GigNook",
                    to: email,
                    subject: 'Email Verification',
                    html: emailContent,
                };
                yield transporter.sendMail(mailOptions);
                console.log('Email sent:');
                return true;
            }
            catch (error) {
                console.error('Error sending email:', error);
                return false;
            }
        });
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield userModel_1.default.findOne({ email });
            if (existingUser) {
                return existingUser;
            }
            else {
                return false;
            }
        });
    }
    verifyUser(token, acceptHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ emailToken: token });
                if (user) {
                    user.emailToken = null;
                    user.isVerified = true;
                    user.save();
                    const isHtmlRequest = acceptHeader.includes("text/html");
                    if (isHtmlRequest) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return express_1.response.status(404).json({ success: false, message: "Email verification failed. Invalid token." });
                }
            }
            catch (error) {
                console.error(error);
                return express_1.response.status(500).json({ success: false, message: "Internal server error." });
            }
        });
    }
    googleUser(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, email } = details;
                const newUser = new userModel_1.default({ firstname, lastname, email, isVerified: true });
                yield newUser.save();
                return true;
            }
            catch (error) {
            }
        });
    }
    elsegoogleUser(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = details.email;
                const user = yield userModel_1.default.findOne({ email: email });
                if (user) {
                    user.emailToken = null;
                    user.isVerified = true;
                    user.save();
                }
                return true;
            }
            catch (error) {
            }
        });
    }
    forgetPasswordSendEmail(email, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: "Otp generate",
                    to: email,
                    subject: "Forgot password Email Verification",
                    text: `your otp code is:${verificationCode}`
                };
                transporter.sendMail(mailOptions, (error, info) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        return false;
                    }
                    else {
                        return verificationCode;
                    }
                }));
                return verificationCode;
            }
            catch (error) {
            }
        });
    }
    resetPassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ email }, { password: hashedPassword });
                if (user) {
                    return true;
                }
                else {
                    false;
                }
            }
            catch (error) {
            }
        });
    }
    updateFile(files, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileLocations = files.map(file => file.location);
                const flattenedLocations = fileLocations.flat();
                let post = yield post_1.default.findOne({ userId: new mongoose_1.default.Types.ObjectId(id) });
                if (post) {
                    post = new post_1.default({
                        userId: new mongoose_1.default.Types.ObjectId(id),
                        images: flattenedLocations
                    });
                }
                else {
                    post = new post_1.default({
                        userId: new mongoose_1.default.Types.ObjectId(id),
                        images: flattenedLocations
                    });
                }
                const savedPost = yield post.save();
                if (savedPost) {
                    return savedPost;
                }
                else {
                    false;
                }
            }
            catch (error) {
                console.log('error in repository update file', error);
            }
        });
    }
    postDatas(id, postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPost = yield post_1.default.findByIdAndUpdate(postId, postData, { new: true });
                if (updatedPost) {
                    return updatedPost;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    gigPayment(amount, title, image, workId, userId, Fname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPayment = new payment_1.default({
                    userId: userId,
                    workId: workId,
                    amount: amount,
                    title: title,
                    image: image,
                    freelancer: Fname
                });
                const result = yield newPayment.save();
                console.log('Payment saved successfully:', result);
                const newOrder = new orders_1.default({
                    userId: userId,
                    workId: workId,
                    amount: amount,
                    title: title,
                    freelancer: Fname
                });
                const orderresult = yield newOrder.save();
                if (result && orderresult) {
                    return true;
                }
                else {
                    false;
                }
            }
            catch (error) {
                console.log('error in repo', error);
            }
        });
    }
    feedback(workId, freelancerId, userId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFeedback = new feedback_1.default({
                    workId,
                    freelancerId,
                    userId,
                    rating,
                    feedback,
                });
                const result = yield newFeedback.save();
                const feedbacks = yield feedback_1.default.aggregate([
                    { $match: { freelancerId: new mongoose_1.default.Types.ObjectId(freelancerId) } },
                    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
                ]);
                const avgRating = feedbacks.length > 0 ? feedbacks[0].avgRating : 0;
                const updatedFreelancer = yield userModel_1.default.findByIdAndUpdate(freelancerId, { rating: avgRating }, { new: true });
                if (result && updatedFreelancer) {
                    return result;
                }
                else {
                    false;
                }
            }
            catch (error) {
            }
        });
    }
}
exports.userRepository = userRepository;
