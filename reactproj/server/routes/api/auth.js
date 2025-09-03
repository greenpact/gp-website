import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import User from "../../models/User.js";
import Otp from "../../models/Otp.js";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Validate JWT_SECRET
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in your .env file!");
  process.exit(1);
}

if (!ADMIN_SECRET) {
  console.warn(
    "⚠️ ADMIN_SECRET is not defined. Admin creation route is not secured."
  );
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Request OTP
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  console.log(`[OTP Request] Received request for email: ${email}`);

  if (!email) {
    console.log("[OTP Request] Error: Email is required.");
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[OTP Request] Error: Email ${email} is already registered.`);
      return res.status(400).json({ message: "Email is already registered." });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`[OTP Request] Generated OTP: ${otp} for email: ${email}`);

    const otpRecord = await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true, expires: 300 }
    );
    console.log(
      `[OTP Request] OTP stored/updated in DB for ${email}. OTP record ID: ${otpRecord._id}`
    );

    const mailOptions = {
      from: `Greenpact Consulting <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Greenpact Consulting: Your Registration OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #107C41;">Welcome to Greenpact Consulting!</h2>
          <p>Thank you for starting your registration process with Greenpact Consulting.</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <h3 style="color: #FF8C00; font-size: 24px; text-align: center; padding: 15px; border: 2px dashed #FF8C00; display: inline-block; margin: 20px auto;">
            <strong>${otp}</strong>
          </h3>
          <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>The Greenpact Consulting Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("[OTP Request] Error sending OTP email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send OTP email. Please try again." });
      }
      console.log("[OTP Request] OTP Email sent successfully:", info.response);
      res.status(200).json({ message: "OTP sent to your email." });
    });
  } catch (err) {
    console.error("[OTP Request] Server-side error requesting OTP:", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
});

// Improved: Request OTP with async/await
router.post("/request-otp-async", async (req, res) => {
  const { email } = req.body;
  console.log(`[OTP Request Async] Received request for email: ${email}`);

  if (!email) {
    console.log("[OTP Request Async] Error: Email is required.");
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(
        `[OTP Request Async] Error: Email ${email} is already registered.`
      );
      return res.status(400).json({ message: "Email is already registered." });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(
      `[OTP Request Async] Generated OTP: ${otp} for email: ${email}`
    );

    const otpRecord = await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(
      `[OTP Request Async] OTP stored/updated in DB for ${email}. OTP record ID: ${otpRecord._id}`
    );

    const mailOptions = {
      from: `Greenpact Consulting <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Greenpact Consulting: Your Registration OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #107C41;">Welcome to Greenpact Consulting!</h2>
          <p>Thank you for starting your registration process with Greenpact Consulting.</p>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <h3 style="color: #FF8C00; font-size: 24px; text-align: center; padding: 15px; border: 2px dashed #FF8C00; display: inline-block; margin: 20px auto;">
            <strong>${otp}</strong>
          </h3>
          <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>The Greenpact Consulting Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("[OTP Request Async] OTP Email sent successfully.");
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("[OTP Request Async] Error:", err);
    res
      .status(500)
      .json({ message: "Failed to send OTP email. Please try again." });
  }
});

// Original: Register user
router.post("/register", async (req, res) => {
  const { username, name, email, password, otp } = req.body;
  console.log(
    `[Register] Attempting registration for email: ${email}, username: ${username}`
  );

  if (!username || !name || !email || !password || !otp) {
    console.log("[Register] Error: Missing required fields.");
    return res.status(400).json({
      message:
        "Please enter all required fields: username, name, email, password, and OTP.",
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    console.log(
      "[Register] Error: Password does not meet complexity requirements."
    );
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
    });
  }

  try {
    console.log(`[Register] Looking up OTP for email: ${email}, OTP: ${otp}`);
    const storedOtp = await Otp.findOne({ email, otp });

    if (!storedOtp) {
      console.log("[Register] Error: Invalid or expired OTP.");
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const otpCreationTime = new Date(storedOtp.createdAt).getTime();
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (currentTime - otpCreationTime > fiveMinutes) {
      console.log("[Register] Error: Expired OTP.");
      await Otp.deleteOne({ email });
      return res
        .status(400)
        .json({ message: "Expired OTP. Please request a new one." });
    }

    console.log("[Register] OTP found and valid.");
    await Otp.deleteOne({ email });
    console.log("[Register] OTP deleted from DB.");

    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log(
        `[Register] Error: User with username ${username} or email ${email} already exists.`
      );
      return res.status(400).json({
        message:
          existingUser.username === username
            ? "Username already exists."
            : "Email is already registered.",
      });
    }
    console.log(
      "[Register] No existing user found with provided username/email."
    );

    console.log("[Register] Creating new user...");
    const newUser = new User({
      username,
      name,
      email,
      password,
      role: "user",
    });

    await newUser.save();
    console.log("[Register] New user saved to DB. User ID:", newUser.id);

    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role,
      },
    };
    console.log("[Register] Generating JWT for new user.");

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("[Register] Error generating JWT:", err);
        throw err;
      }
      console.log("[Register] JWT generated successfully. Sending response.");
      res.status(201).json({
        message: "Registration successful! You are now logged in.",
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profilePicture: newUser.profilePicture,
        },
      });
    });
  } catch (err) {
    console.error(
      "[Register] Server-side registration error (catch block):",
      err
    );
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      console.log("[Register] Mongoose Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({
      message: "An unexpected server error occurred during registration.",
    });
  }
});

// Improved: Register user with standardized JWT payload
router.post("/register-improved", async (req, res) => {
  const { username, name, email, password, otp } = req.body;
  console.log(
    `[Register Improved] Attempting registration for email: ${email}, username: ${username}`
  );

  if (!username || !name || !email || !password || !otp) {
    console.log("[Register Improved] Error: Missing required fields.");
    return res.status(400).json({
      message:
        "Please enter all required fields: username, name, email, password, and OTP.",
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    console.log(
      "[Register Improved] Error: Password does not meet complexity requirements."
    );
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
    });
  }

  try {
    const storedOtp = await Otp.findOne({ email, otp });
    if (!storedOtp) {
      console.log("[Register Improved] Error: Invalid or expired OTP.");
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const otpCreationTime = new Date(storedOtp.createdAt).getTime();
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (currentTime - otpCreationTime > fiveMinutes) {
      console.log("[Register Improved] Error: Expired OTP.");
      await Otp.deleteOne({ email });
      return res
        .status(400)
        .json({ message: "Expired OTP. Please request a new one." });
    }

    await Otp.deleteOne({ email });
    console.log("[Register Improved] OTP deleted from DB.");

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log(
        `[Register Improved] Error: User with username ${username} or email ${email} already exists.`
      );
      return res.status(400).json({
        message:
          existingUser.username === username
            ? "Username already exists."
            : "Email is already registered.",
      });
    }

    const newUser = new User({
      username,
      name,
      email,
      password,
      role: "user",
    });

    await newUser.save();
    console.log(
      "[Register Improved] New user saved to DB. User ID:",
      newUser._id
    );

    const payload = {
      id: newUser._id,
      role: newUser.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    console.log("[Register Improved] JWT generated successfully.");

    res.status(201).json({
      message: "Registration successful! You are now logged in.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    console.error("[Register Improved] Error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
});

// Create an admin user - FOR DEVELOPMENT ONLY
router.post("/create-admin", async (req, res) => {
  const { username, name, email, password, secret } = req.body;
  if (!username || !name || !email || !password || !secret) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ message: "Invalid secret key." });
  }

  try {
    let existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const newUser = new User({
      username,
      name,
      email,
      password,
      role: "admin",
    });
    await newUser.save();
    console.log("[Create Admin] New admin user created:", newUser._id);

    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        message: "Admin user created successfully!",
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    });
  } catch (err) {
    console.error("[Create Admin] Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Original: Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`[Login] Attempting login for username: ${username}`);

  if (!username || !password) {
    console.log("[Login] Error: Missing username or password.");
    return res
      .status(400)
      .json({ message: "Please enter both username and password." });
  }

  try {
    console.log(`[Login] Looking up user: ${username}`);
    const user = await User.findOne({ username });

    if (!user) {
      console.log("[Login] Error: User not found.");
      return res.status(401).json({ message: "Invalid username or password." });
    }
    console.log("[Login] User found.");

    console.log("[Login] Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("[Login] Error: Password mismatch.");
      return res.status(401).json({ message: "Invalid username or password." });
    }
    console.log("[Login] Password matched.");

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    console.log("[Login] Generating JWT for user.");

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("[Login] Error generating JWT:", err);
        throw err;
      }
      console.log("[Login] JWT generated successfully. Sending response.");
      res.json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    });
  } catch (err) {
    console.error("[Login] Server-side login error (catch block):", err);
    res
      .status(500)
      .json({ message: "An unexpected server error occurred during login." });
  }
});

// Improved: Login user with standardized JWT payload
router.post("/login-improved", async (req, res) => {
  const { username, password } = req.body;
  console.log(`[Login Improved] Attempting login for username: ${username}`);

  if (!username || !password) {
    console.log("[Login Improved] Error: Missing username or password.");
    return res
      .status(400)
      .json({ message: "Please enter both username and password." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("[Login Improved] Error: User not found.");
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[Login Improved] Error: Password mismatch.");
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    console.log("[Login Improved] JWT generated successfully.");

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("[Login Improved] Error:", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
});

// Original: Get current user
router.get("/user/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Improved: Get current user with standardized error response
router.get("/user/me-improved", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("[User/Me Improved] Error: User not found.");
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("[User/Me Improved] Error:", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
});

export default router;
