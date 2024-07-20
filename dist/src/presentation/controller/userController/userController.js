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
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const freelancerWork_1 = __importDefault(require("../../../infrastructure/models/freelancerWork"));
const post_1 = __importDefault(require("../../../infrastructure/models/post"));
const payment_1 = __importDefault(require("../../../infrastructure/models/payment"));
const userModel_1 = __importDefault(require("../../../infrastructure/models/userModel"));
const jwtServices_1 = require("../../../services/jwtServices");
const jwtServices_2 = require("../../../services/jwtServices");
const conversation_1 = __importDefault(require("../../../infrastructure/models/conversation"));
const messages_1 = __importDefault(require("../../../infrastructure/models/messages"));
class userController {
    constructor(usecase) {
        this.userusecase = usecase;
    }
    signupPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                if (!userData.email || !userData.password || !userData.firstname || !userData.lastname) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please fill up all the required fields.',
                    });
                }
                const existingUser = yield this.userusecase.findUserExist(req.body.email);
                if (userData == null) {
                    return res.status(400).json({
                        success: false,
                        message: 'Fillup all the field',
                    });
                }
                if (existingUser) {
                    if (!existingUser.isVerified) {
                        return res.status(400).json({
                            success: false,
                            message: 'Email is already registered but not verified. Verification email has been sent.',
                        });
                    }
                    else {
                        return res.status(400).json({
                            success: false,
                            message: 'Email is already registered and verified.',
                        });
                    }
                }
                else {
                    const result = yield this.userusecase.userSignup(userData);
                    if (result) {
                        return res.status(201).json({ success: true, message: 'Signup successful. Verification email sent.' });
                    }
                    else {
                        return res.status(400).json({ success: false, messsage: 'signup fail.Email.sent' });
                    }
                }
            }
            catch (error) {
                res.status(500).json({ message: "internal server error" });
            }
        });
    }
    verifyEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acceptHeader = req.headers.accept || "";
                const { token } = req.query;
                if (!token)
                    return res.status(404).json("email not found ...");
                const user = yield this.userusecase.userVerify(token, acceptHeader);
                if (user) {
                    res.redirect(302, `${process.env.BASE_URL}/login`);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Email verification failed' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "internal server error" });
            }
        });
    }
    loginVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('controller');
                const { email, password } = req.body;
                const existingUser = yield this.userusecase.findUserExist(email);
                if (!existingUser) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid email or password.',
                    });
                }
                if (!(existingUser === null || existingUser === void 0 ? void 0 : existingUser.isVerified)) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email not verified. Please check your email for verification instructions.',
                    });
                }
                if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isBlocked) {
                    return res.status(401).json({
                        success: false,
                        message: 'You are blocked. Please contact support for assistance.',
                    });
                }
                const validPassword = bcryptjs_1.default.compareSync(password, existingUser.password);
                if (!validPassword) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid email or passwordz.',
                    });
                }
                const tokenCreation = (0, jwtServices_1.generateUserJWT)(existingUser._id);
                const refreshTokenCreation = (0, jwtServices_2.generateRefreshJWT)(existingUser._id);
                if (tokenCreation && refreshTokenCreation) {
                    return res
                        .cookie('token', tokenCreation, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        expires: new Date(Date.now() + 15 * 60 * 1000),
                        sameSite: 'strict',
                    })
                        .cookie('refresh_token', refreshTokenCreation, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                        sameSite: 'strict',
                    })
                        .status(200)
                        .json({ success: true, token: tokenCreation, refresh_token: refreshTokenCreation, existingUser });
                }
                else {
                    return res.json({ success: false });
                }
            }
            catch (error) {
                console.error('Error during login:', error.message);
                return res.status(500).json({
                    success: false,
                    message: 'Error during login',
                });
            }
        });
    }
    googleSign(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = yield req.body;
                const [firstname, lastname] = name.split(' ');
                const details = {
                    firstname, lastname, email
                };
                const user = yield this.userusecase.findUserExist(email);
                if (!user) {
                    const user = yield this.userusecase.googleDatabase(details);
                }
                else {
                    const user = yield this.userusecase.elsegoogleDatabase(details);
                }
                const token = (0, jwtServices_1.generateGoogleUserJWT)(user._id);
                return res
                    .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 1000,
                    sameSite: 'strict', })
                    .status(200).json({
                    success: true,
                    message: 'User authenticated successfully.',
                    token
                });
            }
            catch (error) {
            }
        });
    }
    forgetPasswordSendEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.userusecase.findUserExist(email);
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                const result = yield this.userusecase.forgetPasswordSendEmail(email);
                if (result) {
                    return res.status(200).json({
                        success: true,
                        message: 'Email sent successfully',
                        verificationCode: result
                    });
                }
                else {
                    return res.status(500).json({
                        success: false, message: 'Error sending email',
                    });
                }
            }
            catch (error) {
            }
        });
    }
    verifyForgetOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email, verificationCode } = req.body;
                if (!otp || !verificationCode) {
                    return res.status(400).json({ success: false, message: 'OTP and verification code are required' });
                }
                if (otp === verificationCode) {
                    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
                }
                else {
                    return res.status(400).json({ success: false, message: 'Invalid OTP' });
                }
            }
            catch (error) {
                console.error('Error in verifyForgotOtp:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    forgetResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hashSync(newPassword, 10);
                const result = yield this.userusecase.resetPassword(email, hashedPassword);
                if (result) {
                    return res.status(200).json({ success: true, message: 'Password reset successfully' });
                }
                else {
                    return res.status(500).json({ success: false, message: 'Error resetting password' });
                }
            }
            catch (error) {
                console.error('Error in verifyForgotOtp:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    freelancerOrNot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.userusecase.findUserExist(email);
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannott find the freelancer',
                    });
                }
                else {
                    return res.status(200).json({
                        success: true, data: user
                    });
                }
            }
            catch (error) {
                console.error('Error in verifyForgotOtp:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    listFreelancers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, category, sortOrder } = req.query;
                const result = yield this.userusecase.listFreelancers(search, category, sortOrder);
                if (!result) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannott find the freelancer',
                    });
                }
                else {
                    return res.status(200).json({
                        success: true, data: result
                    });
                }
            }
            catch (error) {
            }
        });
    }
    notBlocked(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield this.userusecase.findUserExist(id);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannott find the User',
                });
            }
            else {
                return res.status(200).json({
                    success: true, data: user
                });
            }
        });
    }
    postUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
            }
        });
    }
    postFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const datas = yield this.userusecase.fileUpload(req.files, id);
                if (datas) {
                    return res.status(201).json({ success: true, message: 'document upload successfullt', datas });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'document upload Failed' });
                }
            }
            catch (error) {
            }
        });
    }
    postDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, postId } = req.params;
                const postData = req.body;
                const datas = yield this.userusecase.postDatas(id, postId, postData);
                if (datas) {
                    return res.status(201).json({ success: true, message: 'document upload successfullt', datas });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'document upload Failed' });
                }
            }
            catch (error) {
            }
        });
    }
    listWorks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield freelancerWork_1.default.find({}).populate('userId');
                if (!result) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannot find the Works',
                    });
                }
                else {
                    return res.status(200).json({
                        success: true, data: result
                    });
                }
            }
            catch (error) {
            }
        });
    }
    gigPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('contrp', req.body);
                const { amount, title, image, workId, userId, Fname } = req.body;
                const session = yield this.userusecase.gigPayment(amount, title, image, workId, userId, Fname);
                if (session) {
                    return res.status(201).json({ success: true, message: 'payment done', session });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'payment  Failed' });
                }
            }
            catch (error) {
                console.log('error in controller', error);
            }
        });
    }
    feedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workId, freelancerId, userId, rating, feedback } = req.body;
                const result = yield this.userusecase.feedback(workId, freelancerId, userId, rating, feedback);
                if (result) {
                    return res.status(201).json({ success: true, message: 'feedback Updated', result });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'updation Failed' });
                }
            }
            catch (error) {
            }
        });
    }
    postList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield post_1.default.find({ userId: id }).populate('interestedUsers', 'firstname profilePicture') // Populate interestedUsers with name and profilePicture
                    .exec();
                if (result) {
                    return res.status(201).json({ success: true, message: 'list posts', result });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'List Postes Failed' });
                }
            }
            catch (error) {
            }
        });
    }
    paymentHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Id = req.params.id;
                const payment = yield payment_1.default.find({ userId: Id }).populate('freelancer').populate('workId');
                if (payment) {
                    return res.status(200).json(payment);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot find the payments' });
                }
            }
            catch (error) {
            }
        });
    }
    findUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Id = req.params.id;
                const result = yield userModel_1.default.findById(Id);
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot find the user' });
                }
            }
            catch (error) {
            }
        });
    }
    conversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const conversations = yield conversation_1.default.find({ members: { $in: [userId] } });
                const conversationUserData = Promise.all(conversations.map((conversation) => __awaiter(this, void 0, void 0, function* () {
                    const receiverId = conversation.members.find((member) => member !== userId);
                    const user = yield userModel_1.default.findById(receiverId);
                    return { user: { receiverId: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, firstname: user === null || user === void 0 ? void 0 : user.firstname }, conversationId: conversation._id };
                })));
                if (conversationUserData) {
                    return res.status(200).json(yield conversationUserData);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot find the user' });
                }
            }
            catch (error) {
            }
        });
    }
    users(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const users = yield userModel_1.default.find({ $and: [{ _id: { $ne: userId } }, { isFreelancer: true }
                    ]
                });
                const usersData = Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    return { user: { email: user.email, fullName: user.firstname, receiverId: user._id, profilePicture: user.profilePicture } };
                })));
                if (usersData) {
                    return res.status(200).json(yield usersData);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot find the user' });
                }
            }
            catch (error) {
            }
        });
    }
    messageConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkMessages = (conversationId) => __awaiter(this, void 0, void 0, function* () {
                    console.log(conversationId, 'conversationId');
                    const messages = yield messages_1.default.find({ conversationId });
                    const messageUserData = yield Promise.all(messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield userModel_1.default.findById(message.senderId);
                        return { user: { id: user === null || user === void 0 ? void 0 : user._id, email: user === null || user === void 0 ? void 0 : user.email, fullName: user === null || user === void 0 ? void 0 : user.firstname }, message: message.message };
                    })));
                    console.log('messada', messageUserData);
                    return res.status(200).json(messageUserData);
                });
                const conversationId = req.params.conversationId;
                console.log('CONID', conversationId);
                if (conversationId === 'new') {
                    const checkConversation = yield conversation_1.default.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
                    console.log('check', checkConversation);
                    if (checkConversation.length > 0) {
                        checkMessages(checkConversation[0]._id);
                    }
                    else {
                        return res.status(200).json([]);
                    }
                }
                else {
                    checkMessages(conversationId);
                }
            }
            catch (error) {
            }
        });
    }
    message(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('messageeee');
                console.log('body', req.body);
                const { conversationId, senderId, message, receiverId = '' } = req.body;
                if (!senderId || !message)
                    return res.status(400).send('Please fill all required fields');
                if (conversationId === 'new' && receiverId) {
                    const newCoversation = new conversation_1.default({ members: [senderId, receiverId] });
                    yield newCoversation.save();
                    const newMessage = new messages_1.default({ conversationId: newCoversation._id, senderId, message });
                    yield newMessage.save();
                    return res.status(200).send(newMessage);
                }
                else if (!conversationId && !receiverId) {
                    return res.status(400).send('Please fill all required fields');
                }
                const newMessage = new messages_1.default({ conversationId, senderId, message });
                yield newMessage.save();
                return res.status(200).send(newMessage);
            }
            catch (error) {
            }
        });
    }
}
exports.userController = userController;
