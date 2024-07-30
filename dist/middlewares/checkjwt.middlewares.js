"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwtMiddleware = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const config_1 = __importDefault(require("../config/config"));
console.log("audience", config_1.default.auth0.audience, "issuer", config_1.default.auth0.issuer);
exports.checkJwtMiddleware = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: config_1.default.auth0.audience,
    issuerBaseURL: config_1.default.auth0.issuer,
    tokenSigningAlg: "RS256",
});
