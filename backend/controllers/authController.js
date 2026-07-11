const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, age } = req.body;

    if (!name || !email || !password || !phone || !address || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      address,
      age,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("Signup Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error during signup",
    });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error during login",
    });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user.toSafeObject
        ? req.user.toSafeObject()
        : req.user,
    });
  } catch (err) {
    console.error("Get Me Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Unable to fetch profile",
    });
  }
};

// @route PUT /api/auth/me
const updateMe = async (req, res) => {
  try {
    const { name, phone, address, age, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined && name.trim()) {
      user.name = name.trim();
    }

    if (phone !== undefined && phone.trim()) {
      user.phone = phone.trim();
    }

    if (address !== undefined && address.trim()) {
      user.address = address.trim();
    }

    if (age !== undefined && age !== "") {
      user.age = Number(age);
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Unable to update profile",
    });
  }
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
      Security ke liye same response diya ja raha hai,
      chahe email database me ho ya na ho.
    */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Random reset token generate karna
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Database me plain token nahi, hashed token store hoga
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token 1 hour ke liye valid rahega
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    // validateBeforeSave false se existing required fields issue nahi denge
    await user.save({
      validateBeforeSave: false,
    });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Reset Password</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, sans-serif;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            "
          >
            <div
              style="
                background-color: #16a34a;
                color: #ffffff;
                padding: 24px;
                text-align: center;
              "
            >
              <h1 style="margin: 0; font-size: 28px;">
                A to Z Grocery
              </h1>

              <p style="margin: 8px 0 0;">
                Password Reset Request
              </p>
            </div>

            <div style="padding: 30px;">
              <h2
                style="
                  margin-top: 0;
                  color: #111827;
                "
              >
                Reset your password
              </h2>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello ${user.name || "User"},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                We received a request to reset the password for your
                A to Z Grocery account.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="${resetUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display: inline-block;
                    background-color: #16a34a;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p
                style="
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                This password reset link will expire in
                <strong>1 hour</strong>.
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                If you did not request a password reset, you can safely
                ignore this email.
              </p>

              <div
                style="
                  margin-top: 24px;
                  padding: 14px;
                  background-color: #f0fdf4;
                  border-left: 4px solid #16a34a;
                  word-break: break-all;
                  color: #374151;
                  font-size: 13px;
                "
              >
                If the button does not work, open this link:
                <br />
                ${resetUrl}
              </div>
            </div>

            <div
              style="
                background-color: #111827;
                color: #ffffff;
                padding: 18px;
                text-align: center;
                font-size: 14px;
              "
            >
              Thank you for using A to Z Grocery.
            </div>
          </div>
        </body>
      </html>
    `;

    const emailSent = await sendEmail({
      to: user.email,
      subject: "Reset Your A to Z Grocery Password",
      text: `Reset your password using this link: ${resetUrl}. This link expires in 1 hour.`,
      html: emailHtml,
    });

    if (!emailSent) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({
        success: false,
        message:
          "Password reset email could not be sent. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);

    return res.status(500).json({
      success: false,
      message:
        err.message || "Unable to process password reset request",
    });
  }
};

// @route POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired",
      });
    }

    /*
      User.js ka pre-save middleware password ko
      automatically bcrypt se hash karega.
    */
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    const loginToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
      token: loginToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("Reset Password Error:", err);

    return res.status(500).json({
      success: false,
      message:
        err.message || "Unable to reset password",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
};
