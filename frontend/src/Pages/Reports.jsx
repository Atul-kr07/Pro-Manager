import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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
import { FaSearch, FaFilter, FaCalendarAlt, FaChartLine, FaListAlt, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { getProjects, getTasks } from "../api";
import "../styles/Reports.css";
import "../styles/Layout.css";

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

const Reports = ({ theme }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("week");
  const [projectData, setProjectData] = useState({ labels: [], datasets: [] });
  const [taskData, setTaskData] = useState({ labels: [], datasets: [] });
  const [summaryData, setSummaryData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState({ labels: [], datasets: [] });
  const [taskTrendData, setTaskTrendData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const [projectsResponse, tasksResponse] = await Promise.all([getProjects(), getTasks()]);
      const projects = projectsResponse.data;
      const tasks = tasksResponse.data;

      console.log("Raw Tasks Data:", tasks);

      // Project status counts
      const projectStatusCount = {};
      projects.forEach((p) => {
        projectStatusCount[p.status] = (projectStatusCount[p.status] || 0) + 1;
      });

      // Task status/priority counts
      const taskPriorityCount = {};
      const taskStatusCount = {
        'To Do': 0,
        'In Progress': 0,
        'In Review': 0,
        'Done': 0
      };

      tasks.forEach((t) => {
        taskPriorityCount[t.priority] = (taskPriorityCount[t.priority] || 0) + 1;
        const status = t.status || 'To Do';
          taskStatusCount[status] = (taskStatusCount[status] || 0) + 1;
      });

      console.log("Task Status Count:", taskStatusCount);

      // Calculate task completion trend
      const trendData = calculateTaskTrend(tasks, timeRange);

      // Enhanced summary statistics
      setSummaryData([
        {
          title: "Total Projects",
          value: projects.length,
          icon: <FaListAlt />,
          color: "#007bff"
        },
        {
          title: "Completed Projects",
          value: projectStatusCount["Completed"] || 0,
          icon: <FaCheckCircle />,
          color: "#28a745"
        },
        {
          title: "Active Tasks",
          value: tasks.filter((t) => t.status !== "Done").length,
          icon: <FaClock />,
          color: "#ffc107"
        },
        {
          title: "Overdue Tasks",
          value: tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "Done").length,
          icon: <FaExclamationCircle />,
          color: "#dc3545"
        },
        {
          title: "Task Completion Rate",
          value: `${calculateCompletionRate(tasks)}%`,
          icon: <FaChartLine />,
          color: "#17a2b8"
        }
      ]);

      // Update chart data with enhanced styling
      setProjectData({
        labels: ["Completed", "In Progress", "Not Started"],
        datasets: [
          {
            label: "Projects",
            data: [
              projectStatusCount["Completed"] || 0,
              projectStatusCount["In Progress"] || 0,
              projectStatusCount["Not Started"] || 0,
            ],
            backgroundColor: theme === "dark" 
              ? ["rgba(40, 167, 69, 0.8)", "rgba(255, 193, 7, 0.8)", "rgba(220, 53, 69, 0.8)"]
              : ["rgba(40, 167, 69, 0.6)", "rgba(255, 193, 7, 0.6)", "rgba(220, 53, 69, 0.6)"],
            borderColor: theme === "dark" ? "#444" : "#fff",
            borderWidth: 1,
          },
        ],
      });

      setTaskData({
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: [
              taskPriorityCount["High"] || 0,
              taskPriorityCount["Medium"] || 0,
              taskPriorityCount["Low"] || 0,
            ],
            backgroundColor: theme === "dark"
              ? ["rgba(220, 53, 69, 0.8)", "rgba(255, 193, 7, 0.8)", "rgba(40, 167, 69, 0.8)"]
              : ["rgba(220, 53, 69, 0.6)", "rgba(255, 193, 7, 0.6)", "rgba(40, 167, 69, 0.6)"],
            borderColor: theme === "dark" ? "#444" : "#fff",
            borderWidth: 1,
          },
        ],
      });

      setTaskStatusData({
        labels: ["To Do", "In Progress", "In Review", "Done"],
        datasets: [
          {
            label: "Tasks",
            data: [
              taskStatusCount["To Do"],
              taskStatusCount["In Progress"],
              taskStatusCount["In Review"],
              taskStatusCount["Done"]
            ],
            backgroundColor: theme === "dark"
              ? [
                  "rgba(220, 53, 69, 0.8)",
                  "rgba(255, 193, 7, 0.8)",
                  "rgba(23, 162, 184, 0.8)",
                  "rgba(40, 167, 69, 0.8)"
                ]
              : [
                  "rgba(220, 53, 69, 0.6)",
                  "rgba(255, 193, 7, 0.6)",
                  "rgba(23, 162, 184, 0.6)",
                  "rgba(40, 167, 69, 0.6)"
                ],
            borderColor: theme === "dark" ? "#444" : "#fff",
            borderWidth: 1,
          },
        ],
      });

      setTaskTrendData(trendData);

    } catch (err) {
      setError("Failed to fetch report data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTaskTrend = (tasks, range) => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 12
    };

    let labels = [];
    let completedTasks = [];
    let newTasks = [];

    if (range === "week" || range === "month") {
      for (let i = periods[range] - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        const completed = tasks.filter(task => {
          const completedDate = task.completedAt ? new Date(task.completedAt) : null;
          return completedDate && 
            completedDate.toDateString() === date.toDateString() &&
            task.status === "Done";
        }).length;

        const created = tasks.filter(task => {
          const createdDate = new Date(task.createdAt);
          return createdDate.toDateString() === date.toDateString();
        }).length;

        completedTasks.push(completed);
        newTasks.push(created);
      }
    } else {
      // Year view - group by months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));

        const completed = tasks.filter(task => {
          const completedDate = task.completedAt ? new Date(task.completedAt) : null;
          return completedDate && 
            completedDate.getMonth() === date.getMonth() &&
            completedDate.getFullYear() === date.getFullYear() &&
            task.status === "Done";
        }).length;

        const created = tasks.filter(task => {
          const createdDate = new Date(task.createdAt);
          return createdDate.getMonth() === date.getMonth() &&
            createdDate.getFullYear() === date.getFullYear();
        }).length;

        completedTasks.push(completed);
        newTasks.push(created);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Completed Tasks",
          data: completedTasks,
          borderColor: theme === "dark" ? "rgba(40, 167, 69, 0.8)" : "rgba(40, 167, 69, 0.6)",
          backgroundColor: "transparent",
          tension: 0.4
        },
        {
          label: "New Tasks",
          data: newTasks,
          borderColor: theme === "dark" ? "rgba(0, 123, 255, 0.8)" : "rgba(0, 123, 255, 0.6)",
          backgroundColor: "transparent",
          tension: 0.4
        }
      ]
    };
  };

  const calculateCompletionRate = (tasks) => {
    const completedTasks = tasks.filter(t => t.status === "Done").length;
    return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const filteredSummary = summaryData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (filter !== "All" && item.title.toLowerCase().includes(filter.toLowerCase()))
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: theme === "dark" ? "#fff" : "#333" }
      },
      title: {
        display: true,
        color: theme === "dark" ? "#fff" : "#333"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        },
        ticks: {
          color: theme === "dark" ? "#fff" : "#333"
        }
      },
      x: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        },
        ticks: {
          color: theme === "dark" ? "#fff" : "#333"
        }
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="reports-container">
      <div className="container">
          <div className="reports-header">
            <h2>Reports</h2>
            <div className="reports-controls">
              <div className="search-bar">
              <FaSearch />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="filter-dropdown">
              <FaFilter />
                <select value={filter} onChange={handleFilter}>
                  <option value="All">All</option>
                  <option value="Projects">Projects</option>
                  <option value="Tasks">Tasks</option>
                </select>
              </div>
            <div className="time-range-dropdown">
              <FaCalendarAlt />
              <select value={timeRange} onChange={handleTimeRangeChange}>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>

        <div className="reports-content">
          <div className="summary-section">
            <h3>Summary</h3>
            <div className="summary-cards">
              {filteredSummary.map((item, index) => (
                <div className="summary-card" key={index} style={{ borderLeft: `4px solid ${item.color}` }}>
                  <div className="summary-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="summary-details">
                    <h4>{item.title}</h4>
                    <p className="summary-value">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-section">
            <h3>Task Progress Trend</h3>
            <Line data={taskTrendData} options={chartOptions} />
          </div>

            <div className="report-section">
              <h3>Project Status Overview</h3>
            <Bar data={projectData} options={chartOptions} />
            </div>

            <div className="report-section">
              <h3>Task Priority Distribution</h3>
                <Pie
                  data={taskData}
                  options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: "right"
                  }
                }
              }}
            />
            </div>

            <div className="report-section">
              <h3>Task Status Overview</h3>
            <Bar data={taskStatusData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;