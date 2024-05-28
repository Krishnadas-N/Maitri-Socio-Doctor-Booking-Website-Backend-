import dotenv from 'dotenv';
import { Pulse } from '@pulsecron/pulse'; 
import MailService from './node-mailer';
import appointmentStatusTemplate from '../templates/appointmentStatusUpdateTemplate';
import { Job, } from '@pulsecron/pulse';
dotenv.config();
export const pulse = new Pulse({
    db: { address: process.env.MONGODB_URL as string, collection: 'cronjob' },
    defaultConcurrency: 4,
    maxConcurrency: 4,
    processEvery: '10 seconds',
    resumeOnRestart: true
  });
  
  pulse.define('send email', async (job:Job, done:any) => {
    const mailService = MailService.getInstance();
    const { to, subject, text ,patientName, status, doctorName, date, slot} = job.attrs.data;
    const {html}  = appointmentStatusTemplate(patientName, status, doctorName, date, slot)

    try {
        await mailService.createConnection();
        await mailService.sendMail('X-Request-Id-Value',{ to, subject, text, html:html });
        console.log(`Email sent to ${to}`);
        done();
    } catch (error) {
      console.error(`Failed to send email to ${to}`, error);
      done(error);
    }
  }, { shouldSaveResult: true });


  pulse.on('success', (job:Job) => {
    console.log(`Job <${job.attrs.name}> succeeded`);
  });
  
  pulse.on('fail', (error:Error, job:Job) => {
    console.log(`Job <${job.attrs.name}> failed:`, error);
  });