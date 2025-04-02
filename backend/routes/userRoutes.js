const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../middleware/auth");

// Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// GET /users/me - Get current user
router.get("/me", authenticateUser, async (req, res) => {
  try {
    console.log("Fetching user data for ID:", req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User data fetched successfully");
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// POST /users/login
router.post("/login", async (req, res) => {
  console.log("\n=== Login Attempt ===");
  console.log("Login request received for email:", req.body.email);
  
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      console.log("Login failed: Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Normalize email
    const normalizedEmail = String(email).toLowerCase().trim();
    console.log("Looking for user with email:", normalizedEmail);

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log("Login failed: No user found with email:", normalizedEmail);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("User found:", {
      id: user._id,
      email: user.email,
      username: user.username
    });

    // Compare password
    try {
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        console.log("Login failed: Password does not match");
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate token
      const token = jwt.sign(
        { 
          id: user._id,
          email: user.email,
          username: user.username 
        }, 
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log("Login successful for user:", user.email);

      const responseData = {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          location: user.location,
          role: user.role,
          createdAt: user.createdAt
        }
      };

      return res.status(200).json(responseData);
    } catch (bcryptError) {
      console.error("Password comparison error:", bcryptError);
      return res.status(500).json({ error: "Error verifying password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
});

// POST /users/register
router.post("/register", async (req, res) => {
  console.log("\n=== Registration Attempt ===");
  console.log("Register request received for email:", req.body.email);
  
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      console.log("Registration failed: Missing required fields");
      return res.status(400).json({ 
        error: "Username, email, and password are required" 
      });
    }

    // Validate password length
    if (String(password).trim().length < 6) {
      console.log("Registration failed: Password too short");
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }

    // Normalize email and username
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedUsername = String(username).trim();
    
    console.log("Checking for existing user with email:", normalizedEmail);

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log("Registration failed: Email already exists");
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create new user
    const user = new User({ 
      username: normalizedUsername,
      email: normalizedEmail,
      password: String(password).trim()
    });

    // Save user (password will be hashed by the pre-save middleware)
    await user.save();
    console.log("User registered successfully:", { 
      id: user._id, 
      email: user.email,
      username: user.username
    });

    res.status(201).json({ 
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Invalid input data",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /users/forgot-password
router.post("/forgot-password", async (req, res) => {
  console.log("Forgot password request received:", { email: req.body.email });
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ 
        message: "If this email exists, a reset link has been sent." 
      });
    }

    // Generate a reset token
    const resetToken = require("crypto").randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Implement email sending with nodemailer
    console.log(`Reset token generated for ${email}`);
    res.json({ 
      message: "If this email exists, a reset link has been sent." 
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process forgot password request" });
  }
});

// PUT /users/profile - Update user profile
router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const { phone, location } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields only if provided
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(400).json({ error: "Failed to update profile" });
  }
});

module.exports = router;