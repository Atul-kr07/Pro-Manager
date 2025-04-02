const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const { authenticateUser } = require("../middleware/auth");

router.use(authenticateUser);

// Get all tasks for the current user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ]
    }).populate("project");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, projectId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!project && !projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Use either project or projectId
    const projectIdToUse = project || projectId;

    // Check if project exists and user has access
    const projectDoc = await Project.findById(projectIdToUse);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!projectDoc.hasAccess(req.user._id)) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    // Create new task with minimal required fields
    const task = new Task({
      title: title.trim(),
      project: projectIdToUse,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || req.user._id,
      status: status || "To Do",
      priority: priority || "Medium",
      progress: 0,
      estimatedHours: req.body.estimatedHours ? parseFloat(req.body.estimatedHours) : 0,
      actualHours: 0,
      tags: [],
      attachments: [],
      comments: [],
      subtasks: []
    });

    // Add optional fields only if they exist
    if (description) task.description = description.trim();
    if (dueDate) task.dueDate = dueDate;

    const newTask = await task.save();
    
    // Update project's tasks array
    projectDoc.tasks.push(newTask._id);
    await projectDoc.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ 
      message: "Failed to create task", 
      error: err.message,
      details: err.errors // Include validation errors if any
    });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to the project
    if (!task.project.hasAccess(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update fields
    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.description !== undefined) task.description = req.body.description.trim();
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ message: "Failed to update task", error: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has access to the project
    if (!task.project.hasAccess(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove task from project's tasks array
    task.project.tasks = task.project.tasks.filter(t => t.toString() !== task._id.toString());
    await task.project.save();

    // Delete the task
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});

module.exports = router;