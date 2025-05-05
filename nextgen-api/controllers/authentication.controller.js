const transport = require("../middlewares/sendMail");
const { signupSchema, signinSchema, acceptCodeSchema } = require("../middlewares/validator");
const User = require("../models/user.model");
const { doHash, compareHash, hmacProcess } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const { getVerificationEmailTemplate } = require("../utils/template");

exports.signup = async (req, res) => {
  const { email, password, fullname } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);
  try {
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: false, // (optional) gather all errors
      stripUnknown: true, // (optional) remove unexpected keys
    });
    console.log("Validation Result:", value);
    console.log("Validation Error:", error);
    if (error) {
      return res.status(401).json({ success: false, message: error.message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Địa chỉ email đã được sử dụng" });
    }

    const hashedPassword = await doHash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullname,
    });
    const savedUser = await newUser.save();
    savedUser.password = undefined; // Remove password from the response
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: savedUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Data:", req.body);
  console.log("Email:", email);
  console.log("Password:", password);
  try {
    const { error, value } = signinSchema.validate(req.body, {
      abortEarly: false, // (optional) gather all errors
      stripUnknown: true, // (optional) remove unexpected keys
    });
    console.log("Validation Result:", value);
    if (error) {
      return res.status(401).json({ success: false, message: "Thông tin không hợp lệ" });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    console.log("Existing User:", existingUser);
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Địa chỉ email không tồn tại" });
    }

    const result = await compareHash(password, existingUser.password);

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không chính xác" });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        isVerified: existingUser.isVerified,
        isAdmin: existingUser.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production" ? true : false,
        secure: process.env.NODE_ENV === "production" ? true : false,
      })
      .json({
        success: true,
        token,
        message: "Đăng nhập thành công",
      });
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signout = async (req, res) => {
  try {
    res
      .clearCookie("Authorization")
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during signout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy địa chỉ email" });
    }
    if (existingUser.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã được xác thực" });
    }
    const verificationCode = Math.floor(Math.random() * 1000000).toString();
    let infor = await transport.sendMail({
      from: process.env.EMAIL,
      to: existingUser.email,
      subject: "Xác Minh Email Của Bạn - NextGen",
      html: getVerificationEmailTemplate(verificationCode),
    });

    if (infor.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(
        verificationCode,
        process.env.HMAC_VERIFICATION_CODE_SECKET
      );

      existingUser.verificationCode = hashedCodeValue;
      existingUser.verificationCodeValidation = Date.now(); // 10 minutes
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
      });
    }
    return res.status(400).json({ message: "Code sent failed" });
  } catch (error) {
    console.error("Error during sendVerificationCode:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const {email, providedCode} = req.body;
  try{
    const { error, value } = acceptCodeSchema.validate(req.body, {
      abortEarly: false, // (optional) gather all errors
      stripUnknown: true, // (optional) remove unexpected keys
    });
    if (error) {
      return res.status(401).json({ success: false, message: "Mã xác thực không hợp lệ" });
    }
    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select("+verificationCode +verificationCodeValidation");
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Địa chỉ email không tồn tại" });
    }
    if (existingUser.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã được xác thực" });
    }

    if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){

      return res.status(400).json({ success: false, message: "Mã xác thực không chính xác" });
    }

    if(Date.now() - existingUser.verificationCodeValidation > 10 * 60 * 1000){
      return res.status(400).json({ success: false, message: "Mã xác thực đã hết hạn" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECKET
    );
    if (hashedCodeValue === existingUser.verificationCode) {
      existingUser.isVerified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "Xác thực tài khoản thành công, vui lòng đăng nhập lại",
      });
    }
    return res
      .status(400)
      .json({ success: false, message: "Mã xác thực không chính xác" });
  }catch (error) {
    console.error("Error during verifyVerificationCode:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

