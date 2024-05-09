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
exports.dataUri = exports.multerConfig = void 0;
// multerConfig.ts
const multer_1 = __importDefault(require("multer"));
const datauri_1 = __importDefault(require("datauri"));
const customError_1 = require("../utils/customError");
// Function to configure Multer for file uploads
const multerConfig = (singleFile = false, fileName) => {
    const storage = multer_1.default.memoryStorage();
    let upload;
    if (singleFile) {
        upload = (0, multer_1.default)({
            storage,
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
                    cb(null, true);
                }
                else {
                    cb(new Error('Only images and PDFs are allowed'));
                }
            },
        }).single(fileName); // Accept a single file with field name 'certification'
    }
    else {
        upload = (0, multer_1.default)({
            storage,
            limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
                    cb(null, true);
                }
                else {
                    cb(new Error('Only images and PDFs are allowed'));
                }
            },
        }).array(fileName, 5); // Accept multiple files with field name 'certifications' and limit to 5 files
    }
    return upload;
};
exports.multerConfig = multerConfig;
const dataUri = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new customError_1.CustomError('No file uploaded', 400);
        }
        const dataURI = yield (0, datauri_1.default)(req.file.filename, (err, content) => {
            if (err) {
                throw new Error('Error creating data URI:' || err.message);
            }
            return content; // Return the created data URI from within the callback
        });
        return dataURI;
    }
    catch (error) {
        // Handle any errors during data URI creation
        console.error('Error creating data URI:', error);
        throw error; // Re-throw the error for appropriate handling at a higher level
    }
});
exports.dataUri = dataUri;
