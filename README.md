# Pro Manager

A modern, responsive project management system built with React and Node.js, featuring a clean and intuitive interface for managing projects and tasks efficiently.

## 🚀 Features

- 📊 **Interactive Dashboard** - Gain insights into project progress with real-time data visualization.
- 👥 **Secure User Authentication** - Protect user accounts with JWT-based authentication and encrypted passwords.
- 📱 **Fully Responsive Design** - Optimized for mobile, tablet, and desktop devices.
- 🌃 **Dark/Light Mode Support** - Automatically adapts to system preferences.
- 📋 **Project & Task Management** - Create, edit, assign, and track tasks with ease.
- 📈 **Visual Progress Tracking** - Monitor project milestones with interactive charts.
- 👤 **Comprehensive User Profiles** - Manage account settings, avatars, and preferences.
- 🎨 **Modern UI & Animations** - Intuitive interface with a seamless user experience.
- 🔍 **Advanced Search & Filtering** - Find tasks and projects quickly using powerful search capabilities.
- 📅 **Task Scheduling & Deadline Management** - Set due dates, reminders, and priorities.

---

## 🛠 Tech Stack

### Frontend
- **React.js** with Vite
- **React Router v6** for navigation
- **Styled Components** for styling
- **Chart.js** for data visualization
- **React Icons** for UI elements
- **Context API** for state management
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB**
- **JWT** for secure authentication
- **Express Middleware** for request handling
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests

---

## 🛠 Getting Started

### ✅ Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** package manager

### 👅 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/project-management-system.git
   cd project-management-system
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

5. **Start the Development Servers**
   - **Frontend:**
     ```bash
     cd frontend
     npm run dev
     ```
   - **Backend:**
     ```bash
     cd backend
     npm start
     ```

6. **Access the Application**
   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:5000

---

## 📂 Project Structure

```
project-management-system/
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── styles/         # Global styles and themes
│   │   ├── api.js          # API configuration
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   └── package.json
├── backend/
│   ├── middleware/        # Custom middleware functions
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── server.js         # Server entry point
│   ├── seed.js           # Database seeding script
│   └── package.json
└── README.md
```

---

## 🔑 Key Features in Detail

### 📊 Dashboard
- Real-time project statistics
- Interactive charts and graphs
- Task completion metrics
- Recent activity feed

### 📋 Project Management
- Create and manage multiple projects
- Set project priorities and deadlines
- Track project progress with milestones
- Project timeline visualization

### ✅ Task Management
- Create, edit, and delete tasks
- Assign tasks to team members
- Set task priorities and deadlines
- Track task status (To Do, In Progress, Completed)
- Task filtering and sorting

### 🎨 User Interface
- Clean and modern design
- Fully responsive layout for all devices
- Intuitive navigation with smooth transitions
- Dark/Light theme support

### 🔒 Security & Authentication
- Secure user authentication (JWT-based)
- Protected API endpoints
- Password hashing with bcrypt
- Session handling for secure access

---

## 🤝 Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature` or `fix/your-bug`).
3. Commit your changes and push the branch.
4. Open a pull request.

---

## 🛠 Support & Troubleshooting

### Common Issues & Solutions
- **Database Connection Issues**: Ensure MongoDB is running and the connection string in `.env` is correct.
- **Authentication Problems**: Verify `JWT_SECRET` is correctly set in the environment variables.
- **Frontend Build Issues**: Try clearing `node_modules` and `package-lock.json`, then running `npm install` again.
- **API Connection Errors**: Ensure the backend server is running and the frontend is pointing to the correct API URL.

---

## 📚 Acknowledgments

- **React.js** team for the amazing frontend framework
- **MongoDB** team for the robust database solution
- **Vite** team for the fast and efficient development environment

---


## 📩 Contact

For questions or suggestions, feel free to open an issue or reach out via email at **your@email.com**.

Happy Coding! 🚀

