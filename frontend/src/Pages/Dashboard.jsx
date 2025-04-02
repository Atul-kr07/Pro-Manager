import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import {
  FaPlus,
  FaSearch,
  FaSun,
  FaMoon,
  FaFilter,
  FaExclamationCircle,
  FaClock,
  FaCheck,
  FaProjectDiagram,
  FaTasks,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaChartBar,
  FaCalendarCheck,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaSpinner
} from "react-icons/fa";
import "../styles/Dashboard.css";
import { getUser, getProjects, getTasks } from "../api.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = ({ theme }) => {
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    totalProjects: 0,
    completionRate: 0
  });
  const [insights, setInsights] = useState({
    timeManagement: 0,
    priorityTasks: 0,
    timelinePerformance: 0
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({
    taskStatus: null,
    projectProgress: null,
    timelineTrend: null
  });

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }

      const response = await getUser();
      const fetchedUser = response.data;
      setUserData(fetchedUser);
      localStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (!localStorage.getItem("user")) {
        setError("Failed to fetch user data");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      return [];
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user data first
        await fetchUserData();
        
        // Fetch projects and tasks
        const fetchedProjects = await fetchProjects();
        const fetchedTasks = await fetchTasks();

        console.log('Fetched Projects:', fetchedProjects); // Debug log
        console.log('Fetched Tasks:', fetchedTasks); // Debug log

        // Set the states with the fetched data
        setProjects(fetchedProjects);
        setTasks(fetchedTasks);
        
        // Calculate real statistics using the fetched data
        const totalTasks = fetchedTasks.length;
        const completedTasks = fetchedTasks.filter(t => t.status === "Done" || t.status === "Completed").length;
        const activeProjects = fetchedProjects.filter(p => p.status === "In Progress").length;
        const totalProjects = fetchedProjects.length;
        
        // Calculate completion rate
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Calculate time management score
        const onTimeTasks = fetchedTasks.filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          const completedDate = t.completedAt ? new Date(t.completedAt) : null;
          return completedDate && completedDate <= dueDate;
        }).length;
        const timeManagement = totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0;

        // Set statistics
        setStats({
          totalTasks,
          completedTasks,
          activeProjects,
          totalProjects,
          completionRate
        });

        // Set insights
        setInsights({
          timeManagement,
          priorityTasks: fetchedTasks.filter(t => t.priority === "High" && t.status !== "Done").length,
          timelinePerformance: totalProjects > 0 ? 
            Math.round((fetchedProjects.filter(p => (p.progress || 0) >= 50).length / totalProjects) * 100) : 0
        });

        // Generate activity feed
        const recentActivities = [
          ...fetchedProjects.slice(0, 2).map(project => ({
            id: `project-${project._id || project.id}`,
            type: 'project',
            message: `Project "${project.name}" ${project.status === "Completed" ? "completed successfully" : "updated"}`,
            time: new Date(project.updatedAt || Date.now()).toLocaleString(),
            icon: <FaProjectDiagram />
          })),
          ...fetchedTasks.slice(0, 2).map(task => ({
            id: `task-${task._id || task.id}`,
            type: 'task',
            message: `Task "${task.title}" ${task.status === "Done" ? "completed" : "updated"}`,
            time: new Date(task.updatedAt || Date.now()).toLocaleString(),
            icon: <FaCheckCircle />
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time));

        setActivities(recentActivities);

        // Update chart data
        setChartData({
          taskStatus: {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [{
              data: [
                completedTasks,
                fetchedTasks.filter(t => t.status === "In Progress").length,
                fetchedTasks.filter(t => t.status === "Not Started").length
              ],
              backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
              borderWidth: 0
            }]
          },
          projectProgress: {
            labels: fetchedProjects.map(p => p.name || 'Unnamed Project'),
            datasets: [{
              label: 'Progress',
              data: fetchedProjects.map(p => p.progress || 0),
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
              borderWidth: 1
            }]
          },
          timelineTrend: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Tasks Completed',
              data: [
                fetchedTasks.filter(t => t.status === "Done").length,
                fetchedTasks.filter(t => t.status === "In Progress").length,
                fetchedTasks.filter(t => t.status === "Not Started").length,
                0
              ],
              borderColor: '#4CAF50',
              tension: 0.4,
              fill: true,
              backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }]
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      <div className="welcome-banner">
        <h1>Welcome, {userData?.name || "User"}!</h1>
        <p>Here's your project management overview for {new Date().toLocaleDateString()}</p>
      </div>

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="dashboard-controls">
          <div className="search-bar">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search tasks/projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FaFilter className="icon" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="metrics-section">
          <div className="metric-card">
            <div className="metric-icon">
              <FaTasks />
      </div>
            <div className="metric-details">
              <h3>Task Progress</h3>
              <div className="metric-value">{stats.completionRate}%</div>
              <div className="metric-trend">
                <FaChartLine /> {stats.completedTasks} of {stats.totalTasks} tasks completed
        </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.completionRate}%` }}
                />
        </div>
        </div>
      </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FaProjectDiagram />
            </div>
            <div className="metric-details">
              <h3>Active Projects</h3>
              <div className="metric-value">{stats.activeProjects}</div>
              <div className="metric-trend">
                <FaChartLine /> {Math.round((stats.activeProjects / stats.totalProjects) * 100)}% completion rate
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FaHourglassHalf />
            </div>
            <div className="metric-details">
              <h3>Time Management</h3>
              <div className="metric-value">{insights.timeManagement}%</div>
              <div className="metric-trend">
                <FaChartLine /> Tasks completed on time
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${insights.timeManagement}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>Task Status Distribution</h3>
            <div className="chart-container">
              {chartData.taskStatus && (
                <Doughnut 
                  data={chartData.taskStatus}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3>Project Progress</h3>
            <div className="chart-container">
              {chartData.projectProgress && (
                <Bar 
                  data={chartData.projectProgress}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              )}
                    </div>
                  </div>

          <div className="chart-card">
            <h3>Timeline Trend</h3>
            <div className="chart-container">
              {chartData.timelineTrend && (
                <Line 
                  data={chartData.timelineTrend}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="insights-section">
          <div className="insight-card">
            <h3>Project Timeline</h3>
            <div className="insight-content">
              <div className="insight-icon">
                <FaChartBar />
              </div>
              <div className="insight-details">
                <div className="insight-value">{insights.timelinePerformance}%</div>
                <div className="insight-label">Projects on track</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${insights.timelinePerformance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>Priority Tasks</h3>
            <div className="insight-content">
              <div className="insight-icon warning">
                <FaExclamationTriangle />
              </div>
              <div className="insight-details">
                <div className="insight-value">{insights.priorityTasks}</div>
                <div className="insight-label">High priority tasks pending</div>
                <div className="priority-indicator">
                  <FaSpinner className="spinning" />
                  <span>Requires attention</span>
                </div>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>Upcoming Deadlines</h3>
            <div className="insight-content">
              <div className="insight-icon">
                <FaCalendarCheck />
              </div>
              <div className="insight-details">
                <div className="insight-value">
                  {tasks.filter(t => {
                    if (!t.dueDate) return false;
                    const dueDate = new Date(t.dueDate);
                    const today = new Date();
                    const threeDaysFromNow = new Date();
                    threeDaysFromNow.setDate(today.getDate() + 3);
                    return dueDate >= today && dueDate <= threeDaysFromNow;
                  }).length}
                </div>
                <div className="insight-label">Tasks due in 3 days</div>
                <div className="deadline-indicator">
                  <FaClock />
                  <span>Time sensitive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-timeline">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;