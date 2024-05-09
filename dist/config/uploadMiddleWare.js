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
exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        console.log(req.file, "this is the file");
        console.log(req.files);
        const cloudinaryUrls = [];
        if (req.file && req.files === undefined) {
            const file = req.file;
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'Maitri-Project',
            }, (err, result) => {
                if (err) {
                    console.error('Cloudinary upload error:', err);
                    return next(err);
                }
                if (!result) {
                    console.error('Cloudinary upload error: Result is undefined');
                    return next(new Error('Cloudinary upload result is undefined'));
                }
                cloudinaryUrls.push(result.secure_url);
                // All files processed, now get your images here
                req.body.cloudinaryUrls = cloudinaryUrls;
                next();
            });
            uploadStream.end(file.buffer);
        }
        else {
            const files = req.files;
            if (!files || files.length === 0) {
                return next(new Error('No files provided'));
            }
            for (const file of files) {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: 'auto',
                    folder: 'Maitri-Project',
                }, (err, result) => {
                    if (err) {
                        console.error('Cloudinary upload error:', err);
                        return next(err);
                    }
                    if (!result) {
                        console.error('Cloudinary upload error: Result is undefined');
                        return next(new Error('Cloudinary upload result is undefined'));
                    }
                    cloudinaryUrls.push(result.secure_url);
                    if (cloudinaryUrls.length === files.length) {
                        //All files processed now get your images here
                        req.body.cloudinaryUrls = cloudinaryUrls;
                        next();
                    }
                });
                uploadStream.end(file.buffer);
            }
        }
    }
    catch (error) {
        console.error('Error in uploadToCloudinary middleware:', error);
        next(error);
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
