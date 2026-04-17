import twilio from 'twilio';
import nodemailer from 'nodemailer';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'dummy_twilio_sid' 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || 'dummy_sendgrid_key',
  },
});

export const NotificationService = {
  async sendSMS(to: string, body: string) {
    if (!twilioClient) {
      console.log(`[SMS MOCK] To: ${to} | Message: ${body}`);
      return;
    }
    
    try {
      await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      console.log(`[SMS REAL] Sent to ${to}`);
    } catch (err: any) {
      console.error(`[SMS ERROR] Failed to send to ${to}: ${err.message}`);
    }
  },

  async sendEmail(to: string, subject: string, text: string) {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'dummy_sendgrid_key') {
      console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject} | Body: ${text}`);
      return;
    }

    try {
      await transporter.sendMail({
        from: `"${process.env.ALERT_FROM_EMAIL || 'Debt Intelligence'}" <${process.env.ALERT_FROM_EMAIL || 'alerts@debthelper.com'}>`,
        to,
        subject,
        text,
      });
      console.log(`[EMAIL REAL] Sent to ${to}`);
    } catch (err: any) {
      console.error(`[EMAIL ERROR] Failed to send to ${to}: ${err.message}`);
    }
  }
};
