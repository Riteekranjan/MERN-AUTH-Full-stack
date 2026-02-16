import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

const generateToken = (userId) => {
  const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();
     

    const token = generateToken(user._id.toString());
    // const token = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //  Email should not break signup
    
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to MERN AUTH",
        text: `Hello ${name},

Welcome to MERN AUTH! 🎉
Your account has been created successfully.

– MERN AUTH Team`};

      await transporter.sendMail(mailOptions);
      return res.json({ success: true , message: "Registration successful, OTP sent to email"});

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.json({success: false, message: "email and password are required"})
    }
        try {
            const user = await userModel.findOne({ email });
            if(!user) {
                return res.json({success: false, message: 'invalid email'});
            }
            const ismatch = await bcrypt.compare(password, user.password);
            if(!ismatch) {
                return res.json({success: false, message: 'invalid password'});
            }
            const token = generateToken(user._id.toString());
            res.cookie('token', token, {
                   httpOnly: true,
                   secure: true,   
                   sameSite: 'none',   // Required for cross-domain
                   maxAge: 7 * 24 * 60 * 60 * 1000,
              });
            return res.json({success: true});

        }
            catch (error) {
                res.json({success: false, message: error.message});
            }
        }
    

   export const logout=async(req,res)=>{
      
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure : true,
            sameSite:'none'
        });
        return res.json({success:true, message:"Logout successful"});
    }
    catch(error){
         res.json=({success:false,message: error.message});

    }
   }


   /// send verification otp to user email and verify

   export const sendVerificationOtp = async (req, res) => {
          try {
              const  userId  = req.userId;
              const user = await userModel.findById(userId);
              if(user.isAccountVerified){
                return res.json({success: false, message: "account already verified"});
              }
              const otp = String(Math.floor(100000 + Math.random() * 900000));
              user.verifyOtp = otp;
              user.verifyOtpExpiryAt = Date.now() + 24*60*60*1000;
              await user.save();
              const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Account Verification OTP",
                text: `Your OTP for account verification is ${otp}. It is valid for 10 minutes.`
              };
              await transporter.sendMail(mailOptions);
              return res.json({success: true, message: "OTP sent to email"});
     }
              catch(error) {  
                    res.json({success: false, message: error.message}); 
              }
            }
   
    export const verifyEmail = async (req, res) => {
              const userId = req.userId;   
              const { otp } = req.body;
              if(!userId || !otp) {
                  return res.json({success: false, message: "missing details"});
              } 
              try {
                  const user = await userModel.findById(userId);
                  if(!user) {
                      return res.json({success: false, message: "user not found"});
                  }
                  if(user.verifyOtp === '' || user.verifyOtp !== otp) {
                      return res.json({success: false, message: "invalid otp"});
                  } 
                  if(user.verifyOtpExpiryAt < Date.now()) {
                      return res.json({success: false, message: "otp expired"});
                  }
                  user.isAccountVerified = true;
                  user.verifyOtp = '';
                  user.verifyOtpExpiryAt = 0;
                  await user.save();
                  
                  return res.json({success: true, message: "account verified successfully"});

              }
              catch(error) {
                  return res.json({success: false, message: error.message});
              }
            }


  //  export const isAccountVerified = async (req, res) => {
  //        try{
  //            const { userId } = req.body;
  //            const user = await userModel.findById(userId);
  //             if(user.isAccountVerified) {
  //                 return res.json({success: false, message: "account already verified"});
  //             }
  //            const otp = String(Math.floor(100000 + Math.random() * 900000));

  //             user.verifyOtp = otp;
  //             user.verifyOtpExpiryat = Date.now() + 10*60*1000;
  //             await user.save();

  //             const mailOptions = {
  //               from: process.env.SENDER_EMAIL,
  //               to: user.email,
  //               subject: "Account Verification OTP",
  //               text: `Your OTP for account verification is ${otp}. It is valid for 10 minutes.`
  //             };
  //             await transporter.sendMail(mailOptions);
  //             return res.json({success: true, message: "OTP sent to email"});
  //        }
  //        catch(error){
  //             res.json({success:false, message: error.message});

  //        }
  //  }
//  export const verifyAccount = async (req, res) => { 
                
//                     const { userId, otp } = req.body;
//                     const user = await userModel.findById(userId);
//                     if(!userId || !otp) {
//                         return res.json({success: false, message: "userId and otp are required"});
//                     }
//                     if(user.isAccountVerified) {
//                     return res.json({success: false, message: "account already verified"});
//                     }

//                     try {
//                       const user = await userModel.findById(userId);
//                       if(!user){
//                           return res.json({success: false, message: "user not found"});
//                       }
//                       if(user.verifyOtp ===' ' || user.verifyOtp !==otp) {
//                           return res.json({success: false, message: "invalid otp"});
//                       }
//                       if(user.verifyOtpExpiryat < Date.now()) {
//                           return res.json({success: false, message: "otp expired"});
//                       }

//                 const mailOptions = {
//                 from: process.env.SENDER_EMAIL,
//                 to: user.email,
//                 subject: "Account Verification OTP",
//                 text: ` account verification is ${gmail}. It is valid for 10 minutes.`
//               };
//               await transporter.sendMail(mailOptions);
//               return res.json({success: true, message: "OTP sent to email"});
//      }

//                     catch(error) {
//                         return res.json({success: false, message: error.message});
//                     }
//    }

   
export const  isAuthenticated = async (req, res) => {   
     try {
      return res.json({success: true});
     }catch(error) {    
      return res.json({success: false, message: error.message});
     }
}


export const sendResetOtp  = async (req, res) => {
  const { email } = req.body;
  if(!email) {
    return res.json({success: false, message: "email is required"});
  }
  try {
    const user = await userModel.findOne({ email });
    if(!user) {
      return res.json({success: false, message: "user not found"});
    }
     const otp = String(Math.floor(100000 + Math.random() * 900000));
             user.resetOtp = otp;
              user.verifyOtp = otp;
              user.resetOtpExpiryat = Date.now() + 24*60*60*1000;
              await user.save();
              const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Reset Password OTP",
                text: `reset password otp is ${otp}. It is valid for 10 minutes.`
              };
              await transporter.sendMail(mailOptions);
              return res.json({success: true, message: "OTP sent to email"});
}
catch(error) {    
  return res.json({success: false, message: error.message});
}
}


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if(!email || !otp || !newPassword) {
    return res.json({success: false, message: "all fields are required"});
  }
  try {
    const user = await userModel.findOne({ email });
    if(!user) {
      return res.json({success: false, message: "user not found"});
    }
    if( user.resetOtp === "" || user.resetOtp !== String(otp)) {
      return res.json({success: false, message: "invalid Otp"});
    } 
    if(user.resetOtpExpiryat < Date.now()) {
      return res.json({success: false, message: "otp expired"});
    } 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiryat = 0;
    await user.save();
    return res.json({success: true, message: "password reset successful"});
  } 
    catch(error) {    
      return res.json({success: false, message: error.message});
    }
  }