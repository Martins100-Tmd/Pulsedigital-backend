// install: npm i @sendgrid/mail
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";


dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const msg = {
    to: 'olaitanfabayo@gmail.com',
    from: 'martinssc30@gmail.com',
    subject: 'Hello from Render app',
    text: 'This works via HTTP API; no SMTP ports needed.',
};

sgMail.send(msg)
    .then(() => console.log('Email sent'))
    .catch(err => console.error('Send error', err));
