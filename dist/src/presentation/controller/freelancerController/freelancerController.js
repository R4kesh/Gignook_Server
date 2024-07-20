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
exports.freelancerController = void 0;
const userModel_1 = __importDefault(require("../../../infrastructure/models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = __importDefault(require("../../../infrastructure/models/post"));
const freelancerWork_1 = __importDefault(require("../../../infrastructure/models/freelancerWork"));
const feedback_1 = __importDefault(require("../../../infrastructure/models/feedback"));
const payment_1 = __importDefault(require("../../../infrastructure/models/payment"));
const orders_1 = __importDefault(require("../../../infrastructure/models/orders"));
class freelancerController {
    constructor(freelancerusecase) {
        this.freelancerusecase = freelancerusecase;
    }
    kycDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.displayName || !data.language1 || !data.skill1 || !data.education1 || !data.phoneNumber) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please fill up all the required fields.',
                    });
                }
                const result = yield this.freelancerusecase.kycDetails(data);
                if (result) {
                    return res.status(201).json({ success: true, message: 'Personal details addded successfully' });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Failed' });
                }
            }
            catch (error) {
            }
        });
    }
    profileImageUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageUrl, userId } = req.body;
            try {
                const uploadUrl = yield this.freelancerusecase.profileImageUpload(userId, imageUrl);
                if (uploadUrl) {
                    return res.status(201).json({ success: true, message: 'Picture upload successfully', uploadUrl });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'picture upload Failed' });
                }
            }
            catch (error) {
                console.error('Error in profile upload:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    fileUpload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const datas = yield this.freelancerusecase.fileUpload(req.files, id);
                if (datas) {
                    return res.status(201).json({ success: true, message: 'document upload successfullt', datas });
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'document upload Failed' });
                }
            }
            catch (error) {
                return res.status(403).json({ success: false, message: 'Internal server error', error: error });
            }
        });
    }
    profileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const result = yield this.freelancerusecase.findFreelancer(userId);
                if (result) {
                    return res.status(200).json({ success: true, message: 'Freelancer found', result });
                }
                else {
                    return res.status(500).json({ success: false, message: 'Error ' });
                }
            }
            catch (error) {
                console.error('Freelancer data couldnt find', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    profileUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userId = req.params.id;
                const result = yield this.freelancerusecase.updateProfile(userId, data);
                if (result) {
                    return res.status(200).json({ success: true, message: 'Freelancer found', result });
                }
                else {
                    return res.status(500).json({ success: false, message: 'Error in updating' });
                }
            }
            catch (error) {
                console.error('Freelancer data couldnt updated', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    workImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body.data;
            try {
                const userId = req.params.id;
                console.log('id', userId);
                console.log('red', req.body);
                console.log('dz', data);
            }
            catch (error) {
                console.error('Error in work upload:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    listPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_1.default.find().sort({ created: -1 }).populate('userId', 'firstname profilePicture');
                if (posts) {
                    return res.status(200).json({ posts });
                }
                else {
                    return res.status(500).json({ message: 'Error fetching posts' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching posts', error });
            }
        });
    }
    postInterest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const { userid } = req.body;
                const result = yield this.freelancerusecase.postInterest(userid, postId);
                // io.emit('like',{postId,userid})
                if (result) {
                    return res.status(200).json({ message: `User ${result.isInterested ? 'removed interest' : 'shown interest'}`, result });
                }
                else {
                    return res.status(500).json({ message: 'Error in interest' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching posts', error });
            }
        });
    }
    savePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const { userid } = req.body;
                const result = yield this.freelancerusecase.savePost(userid, postId);
                if (result) {
                    return res.status(200).json({ message: `Post ${result.userIndex > -1 ? 'unsaved' : 'saved'}`, result });
                }
                else {
                    return res.status(500).json({ message: 'Error in interest' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching posts', error });
            }
        });
    }
    savedPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                console.log('save', userId);
                const user = yield userModel_1.default.findById(userId).populate('savedPosts').exec();
                console.log('uz', user);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({ savedPosts: user.savedPosts });
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching posts', error });
            }
        });
    }
    unSavePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, postId } = req.params;
                yield userModel_1.default.findByIdAndUpdate(id, { $pull: { savedPosts: postId } }, { new: true });
                yield post_1.default.findByIdAndUpdate(postId, {
                    $pull: { savedBy: id },
                });
                return res.json({ msg: 'Post unsaved successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error in unSave posts', error });
            }
        });
    }
    postWork(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const datas = yield this.freelancerusecase.workUpload(req.files, id);
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
    postWorkDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const postData = req.body;
                const datas = yield this.freelancerusecase.postWorkDatas(postId, postData);
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
    workList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const works = yield freelancerWork_1.default.find({ userId: req.params.userId });
                res.status(200).json(works);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    workDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.freelancerusecase.workDetails(id);
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'document upload Failed' });
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    freelancerDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.freelancerusecase.freelancerDetails(userId);
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot finde the freelancer details' });
                }
            }
            catch (error) {
            }
        });
    }
    freelancerWorks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.freelancerusecase.freelancerWorks(userId);
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot finde the freelancer details' });
                }
            }
            catch (error) {
            }
        });
    }
    feedbackList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const feedback = yield feedback_1.default.find({ freelancerId: userId }).populate('workId').populate('userId');
                console.log('feed', feedback);
                if (feedback) {
                    return res.status(200).json(feedback);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot finde the feedback' });
                }
            }
            catch (error) {
            }
        });
    }
    workFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workId = req.params.id;
                const feedback = yield feedback_1.default.find({ workId: workId })
                    .populate('workId')
                    .populate('userId')
                    .sort({ date: -1 });
                if (feedback) {
                    return res.status(200).json(feedback);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot finde the feedback' });
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
                const payment = yield payment_1.default.find({ freelancer: Id }).populate('userId').populate('workId');
                if (payment) {
                    return res.status(200).json(payment);
                }
                else {
                    return res.status(400).json({ success: false, messsage: 'Cannot finde the payments' });
                }
            }
            catch (error) {
            }
        });
    }
    orderCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const freelancerId = req.params.id;
            try {
                const completedOrdersCount = yield orders_1.default.countDocuments({
                    freelancer: new mongoose_1.default.Types.ObjectId(freelancerId),
                    status: 'completed',
                });
                const pendingOrdersCount = yield orders_1.default.countDocuments({
                    freelancer: new mongoose_1.default.Types.ObjectId(freelancerId),
                    status: 'pending',
                });
                const totalPayments = yield orders_1.default.aggregate([
                    { $match: { freelancer: new mongoose_1.default.Types.ObjectId(freelancerId), status: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                    { $project: { _id: 0, total: 1 } },
                ]);
                res.json({
                    completedOrdersCount,
                    pendingOrdersCount,
                    totalPayments: totalPayments.length > 0 ? totalPayments[0].total : 0,
                });
            }
            catch (error) {
            }
        });
    }
    graphTotal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancerId = req.params.id;
                const dailyOrdersCount = yield orders_1.default.aggregate([
                    { $match: { freelancer: new mongoose_1.default.Types.ObjectId(freelancerId) } },
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]);
                const monthlyOrdersCount = yield orders_1.default.aggregate([
                    { $match: { freelancer: new mongoose_1.default.Types.ObjectId(freelancerId) } },
                    {
                        $group: {
                            _id: { $month: '$date' },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]);
                console.log('daily', dailyOrdersCount, 'mont', monthlyOrdersCount);
                return res.json({
                    dailyOrdersCount,
                    monthlyOrdersCount,
                });
            }
            catch (error) {
                console.log('error in fetching order', error);
            }
        });
    }
    freelancerOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const freelancerId = req.params.id;
                const orders = yield orders_1.default.find({ freelancer: new mongoose_1.default.Types.ObjectId(freelancerId) })
                    .populate('userId', 'firstname email ')
                    .populate('workId', 'title');
                res.json(orders);
            }
            catch (error) {
                console.log('error in order fetch', error);
            }
        });
    }
    orderStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('satt');
                const orderId = req.params.id;
                const updatedOrder = yield orders_1.default.findByIdAndUpdate(orderId, { status: 'completed' }, { new: true });
                if (!updatedOrder) {
                    return res.status(404).json({ error: 'Order not found' });
                }
                return res.json(updatedOrder);
            }
            catch (error) {
                console.log('error in updating status', error);
            }
        });
    }
}
exports.freelancerController = freelancerController;
