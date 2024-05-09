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
const reponseHandler_1 = require("./utils/reponseHandler");
const userRouter_1 = __importDefault(require("./presentation/routers/userRouter"));
const morgan_1 = __importDefault(require("morgan"));
const customError_1 = require("./utils/customError");
const otpRouter_1 = __importDefault(require("./presentation/routers/otpRouter"));
const specRouter_1 = __importDefault(require("./presentation/routers/specRouter"));
const doctorRouter_1 = __importDefault(require("./presentation/routers/doctorRouter"));
const postRouter_1 = __importDefault(require("./presentation/routers/postRouter"));
const passport_1 = __importDefault(require("passport"));
const adminRouter_1 = require("./presentation/routers/adminRouter");
const passport_2 = __importDefault(require("./config/passport"));
const rolePermissionRouter_1 = require("./presentation/routers/rolePermissionRouter");
const webSocket_1 = require("./presentation/webSocket/webSocket");
const http_1 = __importDefault(require("http"));
const socketService_1 = require("./presentation/webSocket/socketService");
const chatRouter_1 = __importDefault(require("./presentation/routers/chatRouter"));
// import "../config/passport";
// const passport = require('passport');
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error(error));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = webSocket_1.Websocket.getInstance(server);
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.disable("x-powered-by");
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use((0, morgan_1.default)('combined'));
(0, passport_2.default)(passport_1.default);
app.use('/api/users', userRouter_1.default);
app.use('/api/otp', otpRouter_1.default);
app.use('/api/spec', specRouter_1.default);
app.use('/api/doctors', doctorRouter_1.default);
app.use('/api/posts', postRouter_1.default);
app.use('/api/admin', adminRouter_1.adminRouter);
app.use('/api/role', rolePermissionRouter_1.roleRouter);
app.use('/api/chat', chatRouter_1.default);
/* GET Google Authentication API. */
(0, socketService_1.initializeSocketConnection)(io);
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {  scope: ["email", "profile"] })
// );
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/", session: false }),
//   (req, res) => {
//     const token = (req.user as any).token; // Assuming user object contains token
//     res.redirect(`http://localhost:3000?token=${token}`);
//   }
// );
app.use((err, req, res, next) => {
    console.log("Error Handler Comes In");
    if (err instanceof customError_1.CustomError) {
        console.log("Custom Error:");
        console.error(err);
        return (0, reponseHandler_1.sendErrorResponse)(res, err.message, err.status);
    }
    else {
        console.error("Unhandled error:", err);
        return (0, reponseHandler_1.sendErrorResponse)(res, err.message || "Internal Server Error", 500);
    }
});
server.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
