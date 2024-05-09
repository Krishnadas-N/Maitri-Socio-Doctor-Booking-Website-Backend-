"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crypto_1 = require("crypto");
const secret = process.env.TokenHelper || 'default_secret';
function generateToken(data) {
    const payload = typeof data === 'object' ? data : { data };
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
    return token;
}
exports.generateToken = generateToken;
function verifyToken(token) {
    try {
        const decodedData = jsonwebtoken_1.default.verify(token, secret);
        return decodedData;
    }
    catch (error) {
        return null;
    }
}
exports.verifyToken = verifyToken;
function generateRandomToken(length = 32) {
    const token = (0, crypto_1.randomBytes)(length).toString('hex');
    return token;
}
exports.generateRandomToken = generateRandomToken;
