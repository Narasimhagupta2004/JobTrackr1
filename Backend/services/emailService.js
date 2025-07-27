const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, retries = 3) {
    const mailOptions = {
      from: `"JobTrackr Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}: ${info.messageId}`);
        return info;
      } catch (error) {
        console.error(`Email attempt ${attempt} failed:`, error.message);
        if (attempt === retries) {
          throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    const subject = 'Welcome to JobTrackr!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Welcome to JobTrackr! 🎉</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Hello <strong>${userName}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Welcome to JobTrackr! 🎉<br>
          You can now start tracking your job applications, set reminders, and manage your career journey with ease.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Regards,<br>
          <strong>The JobTrackr Team</strong>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordResetOTP(userEmail, otp) {
    const subject = 'JobTrackr Password Reset Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Your JobTrackr verification code is:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          This code is valid for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          If you didn't request a password reset, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }
}

module.exports = new EmailService();