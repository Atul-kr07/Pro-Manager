import React, { useState, useEffect } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "../api";
import styled from "styled-components";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import '../styles/Layout.css';
import '../styles/Projects.css';

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  width: 100%;
`;

const ProjectCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
`;

const ProjectStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${props => {
    switch (props.status) {
      case 'Completed':
        return props.theme.colors.success + '20';
      case 'In Progress':
        return props.theme.colors.warning + '20';
      default:
        return props.theme.colors.danger + '20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed':
        return props.theme.colors.success;
      case 'In Progress':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.danger;
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  font-size: 0.9rem;

  &[type="date"] {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    padding-right: 2rem;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  padding-right: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    dueDate: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetchProjects();
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      console.log('Fetched projects:', response.data);
      setProjects(response.data);
      setError("");
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError("Failed to fetch projects: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await createProject(newProject);
      setProjects([...projects, response.data]);
      setShowModal(false);
      setNewProject({
        title: "",
        description: "",
        status: "Not Started",
        priority: "Medium",
        dueDate: ""
      });
    } catch (err) {
      setError("Failed to create project: " + err.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description || "",
      status: project.status,
      priority: project.priority,
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ""
    });
    setShowModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProject(editingProject._id, newProject);
      setProjects(projects.map(p => 
        p._id === editingProject._id ? response.data : p
      ));
      setShowModal(false);
      setEditingProject(null);
      setNewProject({
        title: "",
        description: "",
        status: "Not Started",
        priority: "Medium",
        dueDate: ""
      });
    } catch (err) {
      setError("Failed to update project: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        setError("Failed to delete project: " + err.message);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`projects-container ${theme}`}>
      <div className="container">
        <div className="projects-header">
          <h2>
            <i className="fas fa-project-diagram"></i>
            Projects
            <span 
              className="add-project-icon" 
              onClick={() => {
              setEditingProject(null);
              setNewProject({
                title: "",
                description: "",
                status: "Not Started",
                priority: "Medium",
                dueDate: ""
              });
              setShowModal(true);
              }}
            >+</span>
          </h2>
          <div className="projects-controls">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description || 'No description provided'}</p>
              <div className="project-meta">
                <div className="project-meta-item">
                  <i className="fas fa-calendar"></i>
                  <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>
                <div className="project-meta-item">
                  <i className="fas fa-users"></i>
                  <span>{project.teamSize || 1} members</span>
                </div>
              </div>
              <div className="project-controls">
                <button className="project-btn edit" onClick={() => handleEdit(project)}>
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button className="project-btn delete" onClick={() => handleDelete(project._id)}>
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal" onClick={() => {
          setShowModal(false);
          setEditingProject(null);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                  placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="button-group">
                <button type="submit" className="submit-btn">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;