const mongoose = require("mongoose");
const Project = require("./models/Project");
const Task = require("./models/Task");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/my-project-tool")
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    await Project.deleteMany({});
    await Task.deleteMany({});
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);
    await User.insertMany([
      { username: "admin", email: "admin@example.com", password: hashedPassword },
    ]);

    await Project.insertMany([
      { name: "Project Alpha", status: "In Progress", createdAt: new Date() },
      { name: "Project Beta", status: "Completed", createdAt: new Date() },
      { name: "Project Gamma", status: "Pending", createdAt: new Date() },
    ]);

    await Task.insertMany([
      { name: "Task A", priority: "High", dueDate: new Date("2025-02-25"), status: "TODO" },
      { name: "Task B", priority: "Medium", dueDate: new Date("2025-02-28"), status: "TODO" },
      { name: "Task C", priority: "Low", dueDate: new Date("2025-03-01"), status: "INPROGRESS" },
    ]);

    console.log("Seeding completed");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    mongoose.connection.close();
  });