"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ReponseHandler_1 = require("../utils/ReponseHandler");
const userRouter_1 = __importDefault(require("./presentation1/routers/userRouter"));
const morgan_1 = __importDefault(require("morgan"));
const CustomError_1 = require("../utils/CustomError");
// const passport = require('passport');
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error(error));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.disable("x-powered-by");
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use('/api/users', userRouter_1.default);
app.use((err, req, res, next) => {
    console.log("Error Handler Comes In");
    if (err instanceof CustomError_1.CustomError) {
        console.log("Custom Error:");
        console.error(err);
        return (0, ReponseHandler_1.sendErrorResponse)(res, err.message, err.status);
    }
    else {
        console.error("Unhandled error:", err);
        return (0, ReponseHandler_1.sendErrorResponse)(res, err.message || "Internal Server Error", 500);
    }
});
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
