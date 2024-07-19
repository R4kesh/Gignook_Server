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
exports.freelancerRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const post_1 = __importDefault(require("../models/post"));
const mongoose_1 = __importDefault(require("mongoose"));
const freelancerWork_1 = __importDefault(require("../models/freelancerWork"));
class freelancerRepository {
    freelancerData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { displayName, description, occupation, personalWebsite, phoneNumber, languages, skills, education, services, email } = data;
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return false;
                }
                user.displayName = displayName || user.displayName;
                user.description = description || user.description;
                user.occupation = occupation || user.occupation;
                user.personalWebsite = personalWebsite || user.personalWebsite;
                user.phoneNumber = phoneNumber || user.phoneNumber;
                user.languages = languages || user.languages;
                user.skills = skills || user.skills;
                user.education = education || user.education;
                user.service = services || user.service;
                user.application = 'Requested';
                yield user.save();
                return user;
            }
            catch (error) {
                console.log('error in repository freelancer data', error);
            }
        });
    }
    profileImageUpload(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadUrl = yield userModel_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        profilePicture: imageUrl
                    }
                }, { new: true });
                if (uploadUrl) {
                    return uploadUrl;
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
                const existingUser = yield userModel_1.default.findOne({ userId });
                if (existingUser) {
                    return existingUser;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('error in repository find freelancer', error);
            }
        });
    }
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedFreelancer = yield userModel_1.default.findByIdAndUpdate(userId, data, { new: true });
                if (updatedFreelancer) {
                    return updatedFreelancer;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('error in repository update profile', error);
            }
        });
    }
    updateFile(files, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileLocations = files.map(file => file.location);
                const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, { $push: { document: { $each: fileLocations } } }, { new: true, useFindAndModify: false });
                if (updatedUser) {
                    return updatedUser;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('error in repository update file', error);
            }
        });
    }
    postInterest(userid, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                if (!post) {
                    return false;
                }
                const isInterested = post.interestedUsers.indexOf(userid);
                if (isInterested > -1) {
                    post.interestedUsers.splice(isInterested, 1);
                }
                else {
                    post.interestedUsers.push(userid);
                }
                yield post.save();
                return post;
            }
            catch (error) {
                console.log('error in repository update file', error);
            }
        });
    }
    savePost(userid, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield post_1.default.findById(postId);
                const user = yield userModel_1.default.findById(userid);
                if (!user) {
                    return false;
                }
                const userIndexes = user.savedPosts.indexOf(postId);
                if (userIndexes > -1) {
                    user.savedPosts.splice(userIndexes, 1);
                }
                else {
                    user.savedPosts.push(postId);
                }
                yield user.save();
                if (!post) {
                    return false;
                }
                const userIndex = post.savedBy.indexOf(userid);
                if (userIndex > -1) {
                    post.savedBy.splice(userIndex, 1);
                }
                else {
                    post.savedBy.push(userid);
                }
                yield post.save();
                return post;
            }
            catch (error) {
                console.log('error in repository update file', error);
            }
        });
    }
    workUpload(files, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileLocations = files.map(file => file.location);
                const flattenedLocations = fileLocations.flat();
                let post = yield freelancerWork_1.default.findOne({ userId: new mongoose_1.default.Types.ObjectId(id) });
                if (post) {
                    post = new freelancerWork_1.default({
                        userId: new mongoose_1.default.Types.ObjectId(id),
                        images: flattenedLocations
                    });
                }
                else {
                    post = new freelancerWork_1.default({
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
    postWorkDatas(postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield freelancerWork_1.default.findByIdAndUpdate(postId, postData, { new: true });
                if (updatedData) {
                    return updatedData;
                }
                else {
                    return false;
                }
            }
            catch (error) {
            }
        });
    }
    workDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield freelancerWork_1.default.findById(id).populate('userId');
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
    freelancerDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userModel_1.default.findById(id);
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
    freelancerWorks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield freelancerWork_1.default.find({ userId: id });
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
exports.freelancerRepository = freelancerRepository;
