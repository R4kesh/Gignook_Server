"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
const errorHandler = (statusCode, message) => {
    return new CustomError(statusCode, message);
};
exports.errorHandler = errorHandler;
