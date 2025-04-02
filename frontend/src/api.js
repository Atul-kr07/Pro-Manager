import axios from "axios";
import { setupCache } from 'axios-cache-interceptor';

// Create axios instance with cache
const api = setupCache(axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  }
}), {
  ttl: 15 * 60 * 1000, // Cache for 15 minutes
  methods: ['get'],
  cacheTakeover: false,
  debug: process.env.NODE_ENV === 'development'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for cache busting
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors with retry logic
    if (!error.response && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden:", error.response.data);
          break;
        case 404:
          console.error("Resource not found:", error.response.data);
          break;
        case 429:
          console.error("Too many requests:", error.response.data);
          break;
        case 500:
          console.error("Server error:", error.response.data);
          break;
        default:
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
      }
    } else {
      console.error("Network Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// API call functions with error handling
export const login = async (credentials) => {
  try {
    console.log("Attempting login with email:", credentials.email);
    const response = await api.post("/users/login", credentials);
    console.log("Login response:", response.data);
    
    if (!response.data?.token) {
      console.error("Login failed: No token in response");
      throw new Error("Invalid response from server");
    }
    return response;
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message === "Network Error") {
      throw new Error("Unable to connect to the server. Please check your internet connection.");
    } else {
      throw new Error(error.message || "Login failed. Please try again.");
    }
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const forgotPassword = async (emailData) => {
  try {
    const response = await api.post("/users/forgot-password", emailData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Password reset request failed");
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user data");
  }
};

export const getUserActivity = async () => {
  try {
    const response = await api.get("/users/activity");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user activity");
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch projects");
  }
};

export const createProject = async (project) => {
  try {
    const response = await api.post("/projects", project);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create project");
  }
};

export const updateProject = async (id, project) => {
  try {
    const response = await api.put(`/projects/${id}`, project);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update project");
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete project");
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const createTask = async (task) => {
  try {
    const response = await api.post("/tasks", task);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

export const updateTask = async (id, task) => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export default api;