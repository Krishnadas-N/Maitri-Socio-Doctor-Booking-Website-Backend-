
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { MailInterface } from '../src/models/otp-Model';
dotenv.config();

export default class MailService{
    private static instance:MailService;
    private transporter: nodemailer.Transporter | undefined;
    
    private constructor() {}

    static getInstance(){
        if(!MailService.instance){
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }

    //Create Connection For Local;
    async createLocalConnection(){
        const account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host:account.smtp.host,
            port:account.smtp.port,
            secure:account.smtp.secure,
            auth:{
                user:account.user,
                pass:account.pass,
            },
        });
    }

    async createConnection(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendMail(
        requestId:string | number | string[],
        options:MailInterface
    ){
        if (!this.transporter) {
            throw new Error('Mail transporter not initialized');
        }
        const info = await this.transporter.sendMail({
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
    }


    async verifyConnection() {
        if (!this.transporter) {
            throw new Error('Mail transporter not initialized');
        }

        try {
            await this.transporter.verify();
            console.log('Mail connection verified successfully');
        } catch (error) {
            console.error('Error verifying mail connection:', error);
            throw error; 
        }
    }
}