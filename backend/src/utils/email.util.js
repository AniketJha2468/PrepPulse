const nodemailer = require('nodemailer');

const env = require('../config/env');

let cachedTransporter = null;

/**
 * Lazily builds and caches a Nodemailer transporter using SMTP credentials
 * supplied entirely through environment variables. No credentials are
 * hardcoded; this module is transport-ready but requires real SMTP_HOST /
 * SMTP_USER / SMTP_PASSWORD values to be configured in the environment
 * before it can actually deliver mail.
 * @returns {import('nodemailer').Transporter}
 */
const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: Number(env.SMTP_PORT) === 465,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        }
      : undefined,
  });

  return cachedTransporter;
};

/**
 * Sends an email using the configured SMTP transporter.
 * @param {Object} options
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} options.html - HTML body content.
 * @param {string} [options.text] - Plain-text fallback body content.
 * @returns {Promise<Object>} The Nodemailer send result.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });
};

/**
 * Sends a password reset email containing a time-limited reset link.
 * @param {Object} options
 * @param {string} options.to - Recipient email address.
 * @param {string} options.fullName - Recipient's full name for personalization.
 * @param {string} options.resetUrl - Fully-qualified password reset link.
 * @param {number} options.expiresInMinutes - Minutes until the link expires.
 * @returns {Promise<Object>} The Nodemailer send result.
 */
const sendPasswordResetEmail = async ({ to, fullName, resetUrl, expiresInMinutes }) => {
  const subject = 'Reset your PrepPulse password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${fullName},</p>
      <p>We received a request to reset your PrepPulse password. Click the button below to choose a new password. This link expires in ${expiresInMinutes} minutes.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a>
      </p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>— The PrepPulse Team</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};

module.exports = {
  getTransporter,
  sendEmail,
  sendPasswordResetEmail,
};
