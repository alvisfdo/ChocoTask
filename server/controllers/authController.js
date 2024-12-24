// controllers/authController.js
import User from "../models/user.js";
import { sendEmail } from "../utils/emailUtil.js";
import { createJWT, isSuperUser } from "../utils/index.js";
import { v4 as uuidv4 } from 'uuid'
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body; // Destructuring the request body to get email and password..request coming from the frontend side and we here deprop the element comes with the request..
      const user = await User.findOne({ email }); // Finding a user with the given email
      
      if (!user) {
          return res.status(401).json({ status: false, message: "Invalid email or password." }); // Sending a response if the user is not found
      }

      if (!user?.isActive) {
          return res.status(400).json({ status: false, message: "User account has been deactivated, contact the administrator!" }); // Sending a response if the user's account is deactivated
      }

      const isMatch = await user.matchPassword(password); // Checking if the provided password from the frontend as a request matches the stored password

      if (user && isMatch) {
          createJWT(res, user._id); // Creating a JWT for the user if authentication(password matches) is successful
          user.password = undefined; // Removing the password from the user object before sending the response to the frontend..
          
          const isSuperUsr =await isSuperUser(email);
          if(isSuperUsr){
              const superUserProperty = {
                  ...user.toObject(), // Convert the Mongoose document to a plain object 
                  isSuperUser: true, // Add the new property 
              };
              // Send the user object with the new property to the front end 
              res.status(200).json(superUserProperty);
          }else{
              res.status(200).json(user); // Sending the authenticated user as a response
          }
          
      } else {
          return res.status(401).json({ status: false, message: "Invalid email or password." }); // Sending a response if authentication fails
      }
  } catch (error) {
      console.log(error); // Logging the error
      return res.status(400).json({ status: false, message: error.message }); // Sending a response if an error occurred
  }
};

export const logoutUser = async (req, res) => {
  try {
      res.cookie("token", "", {
          httpOnly: true,
          expires: new Date(0), // Setting the cookie to expire immediately, effectively logging the user out..Date(0) means right now right this time this cookie expired so user logout imediately
      });
      res.status(200).json({ message: "Logout successful" }); // Sending a response indicating logout was successful
  } catch (error) {
      console.log(error); // Logging the error
      return res.status(400).json({ status: false, message: error.message }); // Sending a response if an error occurred
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'No user found with this email' });
  }
  
  const token = uuidv4(); 
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyToken/${token}`;
  const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="color: #1a73e8;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br/>The ChocoTask Team</p>
    </div>
  `;

  try {
    sendEmail({ email: user.email, subject: 'Password Reset', message, htmlMessage });
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Email could not be sent' });
  }
};

export const verifyToken = async (req, res) => {
    try{
    const { token } = req.params; 

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
    
    if (!user) {
      res.redirect(`${process.env.FRONTEND_URL}/log-in?msg=invalid`)
    }

    // user.password = req.body.password;
    
    await user.save();
    res.redirect(`${process.env.FRONTEND_URL}/reset-password?token=${token}`);
    
  }catch(error){
    res.redirect(`${process.env.FRONTEND_URL}/log-in?msg=error`);
  }
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  // Verify the token (e.g., check if it exists in the database and is not expired)
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
  
  // Update the user's password in the database
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = password;
  user.resetToken = null; // Remove the reset token
  await user.save();

  res.status(200).json({ message: 'Password has been updated successfully' });
};
