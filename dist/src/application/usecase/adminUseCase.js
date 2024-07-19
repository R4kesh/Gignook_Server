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
exports.adminUseCase = void 0;
const post_1 = __importDefault(require("../../infrastructure/models/post"));
class adminUseCase {
    constructor(repository) {
        this.adminrepository = repository;
    }
    listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = this.adminrepository.listUsers();
                if (users) {
                    return users;
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
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.adminrepository.findUser(userId);
                if (user) {
                    return user;
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
    listFreelancer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminrepository.listFreelancer();
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
    freelancerApproval(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminrepository.freelancerApproval(id);
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
    freelancerReject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminrepository.freelancerReject(id);
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
    listFreelancers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminrepository.listFreelancers();
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
    postList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminrepository.postList();
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
    findPost(postid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postid);
                if (post) {
                    return post;
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
                const result = yield this.adminrepository.paymentList();
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
exports.adminUseCase = adminUseCase;
