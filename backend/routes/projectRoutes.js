const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { authenticateUser } = require("../middleware/auth"); // Authentication middleware

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Get all projects for the current user
router.get("/", async (req, res) => {
  try {
    console.log("Fetching projects for user:", req.user._id);
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'team.user': req.user._id }
      ]
    });
    console.log(`Found ${projects.length} projects`);
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
});

// Create a project
router.post("/", async (req, res) => {
  const { title, status, description, priority, dueDate } = req.body;
  console.log("Creating new project:", { title, status, description, priority, dueDate });

  // Basic validation
  if (!title) {
    return res.status(400).json({ message: "Project title is required" });
  }

  // Validate status
  const validStatuses = ["Not Started", "In Progress", "Completed", "On Hold"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: "Invalid status", 
      validStatuses 
    });
  }

  // Validate priority
  const validPriorities = ["Low", "Medium", "High"];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ 
      message: "Invalid priority", 
      validPriorities 
    });
  }

  const project = new Project({
    title: title.trim(),
    description: description ? description.trim() : "",
    status: status || "Not Started",
    priority: priority || "Medium",
    dueDate: dueDate || null,
    owner: req.user._id
  });

  try {
    const newProject = await project.save();
    console.log("Project created successfully:", newProject);
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({ message: "Failed to create project", error: err.message });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has access to the project
    if (!project.hasAccess(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update fields only if provided in the request
    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (dueDate !== undefined) project.dueDate = dueDate;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(400).json({ message: "Failed to update project", error: err.message });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    console.log("Received DELETE request for project ID:", req.params.id);

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log("Project not found in DB");
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is the owner of the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project owner can delete the project" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
});

module.exports = router;