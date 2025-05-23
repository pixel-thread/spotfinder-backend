import nodemailer from 'nodemailer';
import { EmailError } from '@/utils/errors/EmailError';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * Send an email using Gmail SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email plain text
 */

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmailOTP({ to, subject, text, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new EmailError('Failed to send email', 500, error);
  }
}
