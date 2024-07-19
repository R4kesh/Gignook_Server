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
exports.adminRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const post_1 = __importDefault(require("../models/post"));
const payment_1 = __importDefault(require("../models/payment"));
class adminRepository {
    listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.default.find();
                if (users) {
                    return users;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (user) {
                    return user;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    listFreelancer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userModel_1.default.find({
                    isFreelancer: false,
                    application: "Requested"
                });
                if (result) {
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
    freelancerApproval(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield userModel_1.default.findByIdAndUpdate(id, {
                isFreelancer: true,
                application: "Approved"
            }, { new: true });
            if (result) {
                return result;
            }
            else {
                false;
            }
        });
    }
    freelancerReject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield userModel_1.default.findByIdAndUpdate(id, {
                $unset: {
                    languages: "",
                    service: "",
                    skills: "",
                    education: "",
                    description: "",
                    displayName: "",
                    personalWebsite: "",
                    phoneNumber: "",
                    occupation: "",
                    document: "",
                },
                $set: {
                    application: "Rejected"
                }
            }, { new: true });
            if (result) {
                return result;
            }
            else {
                false;
            }
        });
    }
    listFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield userModel_1.default.find({ application: "Approved" });
            if (result) {
                return result;
            }
            else {
                return false;
            }
        });
    }
    postList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield post_1.default.find().populate('userId', 'firstname email');
                if (posts) {
                    return posts;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    paymentList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield payment_1.default.find()
                    .populate('userId')
                    .populate('workId')
                    .populate('freelancer')
                    .sort({ date: -1 });
                if (result) {
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error retrieving payments:', error);
                throw error;
            }
        });
    }
}
exports.adminRepository = adminRepository;
