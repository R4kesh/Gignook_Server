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
exports.userUseCase = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../../infrastructure/models/userModel"));
const stripe_1 = __importDefault(require("stripe"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
});
class userUseCase {
    constructor(repository) {
        this.userrepository = repository;
    }
    userSignup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userrepository.SignupUser(userData);
                if (newUser) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return { success: false, data: error.message };
            }
        });
    }
    findUserExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userrepository.findUser(email);
                if (newUser) {
                    return newUser;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return { success: false, data: error.message };
            }
        });
    }
    userVerify(token, acceptHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userrepository.verifyUser(token, acceptHeader);
                if (verifyUser) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return { success: false, data: error.message };
            }
        });
    }
    googleDatabase(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userrepository.googleUser(details);
                if (verifyUser) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    elsegoogleDatabase(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userrepository.elsegoogleUser(details);
                if (verifyUser) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    forgetPasswordSendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verificationCode = Math.floor(1000 + Math.random() * 9000);
                const sentEmail = this.userrepository.forgetPasswordSendEmail(email, verificationCode);
                if (sentEmail) {
                    return sentEmail;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    resetPassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sentEmail = yield this.userrepository.resetPassword(email, hashedPassword);
                if (sentEmail) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    listFreelancers(search, category, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filter = {
                    isFreelancer: true,
                    isBlocked: false
                };
                if (search) {
                    filter.$or = [
                        { firstname: { $regex: search, $options: 'i' } },
                        { lastname: { $regex: search, $options: 'i' } }
                    ];
                }
                if (category) {
                    filter.service = category;
                }
                let sort = {};
                if (sortOrder === 'lowToHigh') {
                    sort.rating = 1;
                }
                else if (sortOrder === 'highToLow') {
                    sort.rating = -1;
                }
                const result = yield userModel_1.default.find(filter).sort(sort);
                if (result) {
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    fileUpload(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userrepository.updateFile(file, id);
                if (result) {
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return { success: false, data: error.message };
            }
        });
    }
    postDatas(id, postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userrepository.postDatas(id, postId, postData);
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
    gigPayment(amount, title, image, workId, userId, Fname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield stripe.products.create({
                    name: title,
                    images: image
                });
                const price = yield stripe.prices.create({
                    product: product.id,
                    unit_amount: Math.round(amount * 100),
                    currency: 'inr'
                });
                const session = yield stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price: price.id,
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${process.env.BASE_URL}/work/payment/success`,
                    cancel_url: `${process.env.BASE_URL}/work/payment/failure`,
                });
                const result = yield this.userrepository.gigPayment(amount, title, image, workId, userId, Fname);
                if (result) {
                    if (session) {
                        return session;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (session) {
                        return session;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                console.log('error in usecase', error);
            }
        });
    }
    feedback(workId, freelancerId, userId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userrepository.feedback(workId, freelancerId, userId, rating, feedback);
                if (result) {
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
}
exports.userUseCase = userUseCase;
