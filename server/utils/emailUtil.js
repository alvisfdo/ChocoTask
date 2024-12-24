import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const sendEmail = async (options) => {
    try {
        // Create an OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.EMAIL_CLIENT_ID,
            process.env.EMAIL_CLIENT_SECRET,
            process.env.EMAIL_REDIRECT_URL
        );
        // Set the refresh token
        oauth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });

        const accessToken = await oauth2Client.getAccessToken();

        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL_USERNAME,
              clientId: process.env.EMAIL_CLIENT_ID,
              clientSecret: process.env.EMAIL_CLIENT_SECRET,
              refreshToken: process.env.EMAIL_REFRESH_TOKEN,
              accessToken: accessToken,
            },
          });

       // Define email options
        const mailOptions = {
            from: `CHOCOTASK @ ${process.env.EMAIL_FROM}`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.htmlMessage,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
