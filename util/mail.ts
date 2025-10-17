import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("Missing email credentials in environment variables");
}

export const sendMail = async (token: string, email: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

  try {
    await transporter.sendMail({
      from: `"Opportunity Pulse Digital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome!",
      text: `
Welcome to Opportunity Pulse Digital!

Please verify your email address to activate your account.

Click the link below (or copy and paste it into your browser):

${verifyUrl}

If you didn’t create an account, please ignore this email.

Thanks,
The Opportunity Pulse Team
            `,

      html: `
        
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Opportunity Pulse Digital 🎉</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up! Please verify your email address to activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
        <hr>
        <p style="font-size: 12px; color: #777;">
          If you didn’t create an account, you can safely ignore this email.
        </p>
      </div>`,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Error sending mail to user");
  }
};
