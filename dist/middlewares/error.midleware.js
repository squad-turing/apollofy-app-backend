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
Object.defineProperty(exports, "__esModule", { value: true });
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const errorHandler = (error, req, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof express_oauth2_jwt_bearer_1.InsufficientScopeError) {
        const message = "Permission denied";
        response.status(error.status).json({ message });
        return;
    }
    if (error instanceof express_oauth2_jwt_bearer_1.InvalidTokenError) {
        const message = "Bad credentials";
        response.status(error.status).json({ message });
        return;
    }
    if (error instanceof express_oauth2_jwt_bearer_1.UnauthorizedError) {
        const message = "Requires authentication";
        response.status(error.status).json({ message });
        return;
    }
    const status = 500;
    const message = "Internal Server Error";
    response.status(status).json({ message });
});
exports.default = errorHandler;
