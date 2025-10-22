import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM) {
  throw new Error("Missing SendGrid credentials in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (token: string, email: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM!, // must be verified in SendGrid
      name: "Opportunity Pulse Digital",
    },
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
      </div>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Email sent:", response[0].statusCode);
  } catch (err: any) {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
    throw new Error("Error sending mail to user");
  }
};
