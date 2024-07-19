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
exports.adminController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwtServices_1 = require("../../../services/jwtServices");
const userModel_1 = __importDefault(require("../../../infrastructure/models/userModel"));
const payment_1 = __importDefault(require("../../../infrastructure/models/payment"));
dotenv_1.default.config();
class adminController {
    constructor(usecase) {
        this.adminusecase = usecase;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let adminEmail = process.env.ADEMAIL;
                let adminPassword = process.env.ADPASSWORD;
                if (adminEmail !== email || adminPassword !== password) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid email or password.',
                    });
                }
                const token = (0, jwtServices_1.adminGenerateJWT)(adminEmail);
                console.log('Token:', token);
                console.log('Email:', adminEmail);
                return res
                    .status(200)
                    .json({ success: true, token });
            }
            catch (error) {
                console.error('Error during login:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error during login',
                });
            }
        });
    }
    userList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminusecase.listUsers();
                if (users) {
                    return res.json({ users });
                }
                else {
                    return res.json({ message: 'Internal server error' });
                }
            }
            catch (error) {
            }
        });
    }
    usersAction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, action } = req.params;
            try {
                const user = yield this.adminusecase.findUser(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.isBlocked = action === 'block';
                yield user.save();
                return res.json({ message: `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`, user });
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancerList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancer = yield this.adminusecase.listFreelancer();
                if (freelancer) {
                    return res.json({ freelancer });
                }
                else {
                    return res.json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancerDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { freelancerId } = req.params;
            try {
                const freelancer = yield this.adminusecase.findUser(freelancerId);
                if (freelancer) {
                    return res.json({ freelancer });
                }
                else {
                    return res.json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancerApproval(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.adminusecase.freelancerApproval(id);
                if (!result) {
                    return res.status(404).json({ message: 'Freelancer not found' });
                }
                else {
                    res.json({ message: 'User approved', result });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancerReject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.adminusecase.freelancerReject(id);
                if (!result) {
                    return res.status(404).json({ message: 'Freelancer not found' });
                }
                else {
                    res.json({ message: 'User rejected', result });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancersList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancers = yield this.adminusecase.listFreelancers();
                if (freelancers) {
                    return res.json({ freelancers });
                }
                else {
                    return res.json({ message: 'Internal server error' });
                }
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    freelancersAction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, action } = req.params;
            try {
                const freelancer = yield this.adminusecase.findUser(userId);
                if (!freelancer) {
                    return res.status(404).json({ message: 'Freelancer not found' });
                }
                freelancer.isFreelancer = action === 'block';
                yield freelancer.save();
                return res.json({ message: `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`, freelancer });
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    postList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.adminusecase.postList();
                return res.status(200).json({ posts });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    postListUnlist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postid, action } = req.params;
                const post = yield this.adminusecase.findPost(postid);
                if (!post) {
                    return res.status(404).json({ message: 'post not found' });
                }
                else {
                    post.isListed = action === 'list';
                    yield post.save();
                    return res.json({ message: `Post ${action === 'list' ? 'listed' : 'unlisted'} successfully`, post });
                }
            }
            catch (error) {
            }
        });
    }
    paymentList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.adminusecase.paymentList();
                if (payment) {
                    return res.json({ payment });
                }
                else {
                    return res.json({ message: 'Internal server error' });
                }
            }
            catch (error) {
            }
        });
    }
    countDocument(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userCount = yield userModel_1.default.countDocuments({ isVerified: true });
                const freelancerCount = yield userModel_1.default.countDocuments({ isFreelancer: true });
                const totalPayments = yield payment_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                ]);
                console.log('user', userCount);
                console.log('free', freelancerCount);
                console.log('pay', totalPayments);
                res.json({
                    userCount,
                    freelancerCount,
                    totalPayments: ((_a = totalPayments[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
                });
            }
            catch (error) {
            }
        });
    }
    totalPayments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('opayme');
                const dailyPayments = yield payment_1.default.aggregate([
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            totalAmount: { $sum: "$amount" }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                console.log('da', dailyPayments);
                const monthlyPayments = yield payment_1.default.aggregate([
                    { $group: { _id: { $month: "$date" }, totalAmount: { $sum: "$amount" } } },
                    { $sort: { _id: 1 } }
                ]);
                console.log('ma', monthlyPayments);
                return res.json({
                    dailyPayments,
                    monthlyPayments
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch payment totals' });
            }
        });
    }
}
exports.adminController = adminController;
