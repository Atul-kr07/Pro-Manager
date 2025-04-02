const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ owner: 1, title: 1 });
projectSchema.index({ 'team.user': 1 });

// Method to check if a user has access to this project
projectSchema.methods.hasAccess = function(userId) {
  if (this.owner.equals(userId)) return true;
  return this.team.some(member => member.user.equals(userId));
};

// Method to get user's role in the project
projectSchema.methods.getUserRole = function(userId) {
  if (this.owner.equals(userId)) return 'owner';
  const teamMember = this.team.find(member => member.user.equals(userId));
  return teamMember ? teamMember.role : null;
};

module.exports = mongoose.model("Project", projectSchema);