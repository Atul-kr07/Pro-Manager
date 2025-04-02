const jwt = require("jsonwebtoken");
const User = require('../models/User');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6";

// Middleware to authenticate user using JWT
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// Middleware to check if user has access to a project
const authorizeProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const Project = require('../models/Project');
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.hasAccess(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add project and user role to request
    req.project = project;
    req.userProjectRole = project.getUserRole(req.user._id);
    next();
  } catch (error) {
    console.error('Project authorization error:', error);
    res.status(500).json({ error: 'Error checking project access' });
  }
};

// Middleware to check if user has access to a task
const authorizeTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId || req.body.taskId;
    const Task = require('../models/Task');
    
    const task = await Task.findById(taskId).populate('project');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!task.project.hasAccess(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add task and project role to request
    req.task = task;
    req.userProjectRole = task.project.getUserRole(req.user._id);
    next();
  } catch (error) {
    console.error('Task authorization error:', error);
    res.status(500).json({ error: 'Error checking task access' });
  }
};

// Middleware to check if user is an admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware to check project role permissions
const requireProjectRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.userProjectRole) {
      return res.status(403).json({ error: 'No project role found' });
    }

    if (req.userProjectRole === 'owner') {
      return next(); // Project owner can do everything
    }

    if (!requiredRoles.includes(req.userProjectRole)) {
      return res.status(403).json({ error: 'Insufficient project permissions' });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeProject,
  authorizeTask,
  requireAdmin,
  requireProjectRole
};