const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true,
    default: 'Not provided'
  },
  location: {
    type: String,
    trim: true,
    default: 'Not specified'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Ensure both passwords are strings and trimmed
    const cleanCandidate = String(candidatePassword).trim();
    const cleanStored = String(this.password).trim();
    
    console.log("Comparing passwords:", {
      candidateLength: cleanCandidate.length,
      storedLength: cleanStored.length
    });
    
    // Compare passwords
    const isMatch = await bcrypt.compare(cleanCandidate, cleanStored);
    console.log("Password match result:", isMatch);
    
    return isMatch;
  } catch (error) {
    console.error("Password comparison error:", error);
    throw error;
  }
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Ensure password is a string and trimmed
    this.password = String(this.password).trim();
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Password hashing error:", error);
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);