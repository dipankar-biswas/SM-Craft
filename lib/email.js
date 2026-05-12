import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service error:", error);
    return false;
  }
}

// Send registration email
export async function sendRegistrationEmail(userEmail, userName) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: "Welcome to SlotsBytes! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SlotsBytes</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
            h1 {
              margin: 0;
              font-size: 28px;
            }
            .welcome-text {
              font-size: 18px;
              margin: 20px 0;
            }
            .credentials {
              background-color: #f0fdf4;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #10b981;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SlotsBytes! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName || "there"}!</h2>
              <p class="welcome-text">Thank you for registering with SlotsBytes. We're excited to have you on board!</p>
              
              <div class="credentials">
                <p><strong>📧 Email:</strong> ${userEmail}</p>
                <p><strong>✅ Status:</strong> Active</p>
              </div>
              
              <p>You can now access your dashboard and start exploring all the features we offer.</p>
              
              <center>
                <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                  Go to Dashboard →
                </a>
              </center>
              
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              
              <p>Best regards,<br>
              <strong>The SlotsBytes Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 SlotsBytes. All rights reserved.</p>
              <p>You received this email because you registered on our platform.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to SlotsBytes! 🎉
        
        Hello ${userName || "there"}!
        
        Thank you for registering with SlotsBytes. We're excited to have you on board!
        
        Email: ${userEmail}
        Status: Active
        
        You can now access your dashboard: ${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/dashboard
        
        Best regards,
        The SlotsBytes Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(userEmail, resetToken, userName) {
  const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${resetToken}`;
  
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: "Password Reset Request - SlotsBytes",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              margin: 20px 0;
              font-weight: bold;
            }
            .warning {
              background-color: #fef2f2;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #f59e0b;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hello ${userName || "User"},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              
              <div class="warning">
                <p><strong>⚠️ Important:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 12px;">
                ${resetUrl}
              </p>
              
              <p>Best regards,<br>
              <strong>The SlotsBytes Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 SlotsBytes. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello ${userName || "User"},
        
        We received a request to reset your password.
        
        Click this link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        The SlotsBytes Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
}