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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freelancerUseCase = void 0;
class freelancerUseCase {
    constructor(repository) {
        this.freelancerrepository = repository;
    }
    kycDetails(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { displayName, description, occupation, personalWebsite, phoneNumber, Print, articleVideo, webDevelopment, animation } = datas, rest = __rest(datas, ["displayName", "description", "occupation", "personalWebsite", "phoneNumber", "Print", "articleVideo", "webDevelopment", "animation"]);
                const languages = [];
                if (rest.language1)
                    languages.push(rest.language1);
                if (rest.language2)
                    languages.push(rest.language2);
                const skills = [];
                if (rest.skill1)
                    skills.push(rest.skill1);
                if (rest.skill2)
                    skills.push(rest.skill2);
                const education = [];
                if (rest.Education1)
                    education.push(rest.Education1);
                if (rest.education1)
                    education.push(rest.education1);
                const services = [];
                if (Print === 'on')
                    services.push('Print');
                if (articleVideo === 'on')
                    services.push('Article/Video');
                if (webDevelopment === 'on')
                    services.push('Web Development');
                if (animation === 'on')
                    services.push('Animation');
                const data = {
                    displayName,
                    description,
                    occupation,
                    personalWebsite,
                    phoneNumber,
                    languages,
                    skills,
                    education,
                    services,
                    email: rest.email
                };
                const newFreelancer = yield this.freelancerrepository.freelancerData(data);
                if (newFreelancer) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    profileImageUpload(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.profileImageUpload(userId, imageUrl);
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
    findFreelancer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.freelancerrepository.findFreelancer(userId);
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
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield this.freelancerrepository.updateProfile(userId, data);
                if (update) {
                    return update;
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
    fileUpload(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.updateFile(file, id);
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
    postInterest(userid, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.postInterest(userid, postId);
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
    savePost(userid, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.savePost(userid, postId);
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
    workUpload(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('usecase');
                const result = yield this.freelancerrepository.workUpload(file, id);
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
    postWorkDatas(postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.postWorkDatas(postId, postData);
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
    workDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.workDetails(id);
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
    freelancerDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.freelancerDetails(id);
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
    freelancerWorks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.freelancerrepository.freelancerWorks(id);
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
}
exports.freelancerUseCase = freelancerUseCase;
