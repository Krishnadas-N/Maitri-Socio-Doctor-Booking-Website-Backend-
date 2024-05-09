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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailService {
    constructor() { }
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    //Create Connection For Local;
    createLocalConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield nodemailer_1.default.createTestAccount();
            this.transporter = nodemailer_1.default.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
        });
    }
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_TLS === 'yes' ? true : false,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
        });
    }
    sendMail(requestId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transporter) {
                throw new Error('Mail transporter not initialized');
            }
            const info = yield this.transporter.sendMail({
                from: `"Maitiri-Consultation" ${process.env.SMTP_SENDER || options.from}`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            console.log(`${requestId} - Mail sent successfully!!`);
            console.log(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
            return info;
        });
    }
    verifyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transporter) {
                throw new Error('Mail transporter not initialized');
            }
            try {
                yield this.transporter.verify();
                console.log('Mail connection verified successfully');
            }
            catch (error) {
                console.error('Error verifying mail connection:', error);
                throw error;
            }
        });
    }
}
exports.default = MailService;
