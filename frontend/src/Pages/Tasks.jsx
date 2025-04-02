// src/Pages/Tasks.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { getTasks, createTask, updateTask, deleteTask, getProjects } from "../api";
import "../styles/Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    projectId: "",
    dueDate: "",
    estimatedHours: "0",
    progress: 0
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.projectId) {
      setError("Title and project are required fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        setError("User not authenticated");
        return;
      }

      const taskData = {
        title: newTask.title.trim(),
        project: newTask.projectId,
        status: newTask.status || "To Do",
        priority: newTask.priority || "Medium",
        createdBy: user._id,
        assignedTo: user._id
      };

      if (newTask.description?.trim()) {
        taskData.description = newTask.description.trim();
      }
      if (newTask.dueDate) {
        taskData.dueDate = newTask.dueDate;
      }
      if (newTask.estimatedHours) {
        taskData.estimatedHours = parseFloat(newTask.estimatedHours);
      }

      await createTask(taskData);
      await fetchTasks();
      setShowModal(false);
      setNewTask({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        projectId: "",
        dueDate: "",
        estimatedHours: "0",
        progress: 0
      });
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      const errorDetails = err.response?.data?.details || {};
      setError(`Failed to create task: ${errorMessage} ${Object.values(errorDetails).join(', ')}`);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      projectId: task.project._id,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      estimatedHours: task.estimatedHours?.toString() || "0",
      progress: task.progress || 0
    });
    setShowModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.projectId) {
      setError("Title and project are required fields");
      return;
    }

    try {
      const taskData = {
        title: newTask.title.trim(),
        project: newTask.projectId,
        status: newTask.status,
        priority: newTask.priority,
        description: newTask.description?.trim() || "",
        dueDate: newTask.dueDate || null,
        estimatedHours: newTask.estimatedHours ? parseFloat(newTask.estimatedHours) : 0
      };

      await updateTask(editingTask._id, taskData);
      await fetchTasks();
      setShowModal(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        projectId: "",
        dueDate: "",
        estimatedHours: "0",
        progress: 0
      });
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("Failed to update task: " + errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      projectId: "",
      dueDate: "",
      estimatedHours: "0",
      progress: 0
    });
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
        setError("Failed to delete task: " + err.message);
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesFilter = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`tasks-container ${localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="tasks-header">
          <h2>
            Tasks
            <span className="add-task-icon" onClick={() => setShowModal(true)}>+</span>
          </h2>
          <div className="tasks-controls">
            <div className="search-bar">
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>

        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-controls">
                  <button className="task-btn edit" onClick={() => handleEdit(task)}>
                    <FaEdit />
                  </button>
                  <button className="task-btn delete" onClick={() => handleDelete(task._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="task-description">
                {task.description || 'No description provided'}
              </p>
              <div className="task-meta">
                <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                  {task.status}
                </span>
                {task.dueDate && (
                  <div className="task-meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              No tasks found. Create your first task!
          </div>
          )}
          </div>

      {showModal && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="form-group">
                <label>Project *</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
              <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
              </div>
              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newTask.estimatedHours}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewTask({ 
                      ...newTask, 
                      estimatedHours: value === "" ? "0" : value,
                      progress: 0
                    });
                  }}
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="button-group">
                <button type="submit" className="submit-btn">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;