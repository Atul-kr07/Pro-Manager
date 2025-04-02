import React, { useState } from 'react';
import { 
  FaQuestionCircle, 
  FaEnvelope, 
  FaPhone, 
  FaClock, 
  FaChartLine,
  FaTasks,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import '../styles/Help.css';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I navigate through the application?",
      answer: "The application has a sidebar navigation menu that provides access to different sections: Dashboard, Projects, Tasks, Reports, and Support. The sidebar can be collapsed for more screen space. The top navbar shows your profile, notifications, and quick actions."
    },
    {
      question: "What can I do on the Dashboard?",
      answer: "The Dashboard provides an overview of your projects and tasks. You can view project statistics, task progress, upcoming deadlines, and recent activities. The dashboard includes charts and metrics to help you track overall progress."
    },
    {
      question: "How do I manage projects?",
      answer: "In the Projects section, you can create new projects, view existing ones, and manage project details. Each project has its own page where you can set deadlines, track progress, and manage project-specific tasks."
    },
    {
      question: "How do I create and manage tasks?",
      answer: "Tasks can be created within projects or from the Tasks section. You can set priorities, add descriptions, and track progress. The task board view allows you to drag and drop tasks between different status columns."
    },
    {
      question: "What features are available in the Reports section?",
      answer: "The Reports section provides detailed analytics including project status, task completion rates, and time-based trends. You can filter reports by time range (week, month, year) and export data in various formats for further analysis."
    },
    {
      question: "How do I manage my profile?",
      answer: "Click on view profile button in the sidebar to access your profile menu. Here you can view your information, update settings, and manage your account preferences."
    },
    
  ];

  const features = [
    {
      icon: <FaChartLine />,
      title: "Project Analytics",
      description: "Track project progress with detailed analytics and insights",
      color: "#4CAF50"
    },
    {
      icon: <FaTasks />,
      title: "Task Management",
      description: "Organize and track tasks with an intuitive interface",
      color: "#FF9800"
    },
    {
      icon: <FaCheckCircle />,
      title: "Progress Tracking",
      description: "Monitor project milestones and achievements",
      color: "#9C27B0"
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get assistance when needed</p>
      </div>

      <div className="help-content">
        <section className="contact-section">
          <h2>Contact Support</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <FaEnvelope />
              <div className="contact-info">
                <h3>Email Support</h3>
                <p>Email: <a href="mailto:iiiatulll007@gmail.com">support@pro-manager.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone />
              <div className="contact-info">
                <h3>Phone Support</h3>
                <p>+91 9798535039 </p>
              </div>
            </div>
            <div className="contact-item">
              <FaClock />
              <div className="contact-info">
                <h3>Support Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="stats-section">
          <h2>Key Features</h2>
          <div className="stats-grid">
            {features.map((feature, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="stat-content">
                  <h3>{feature.title}</h3>
                  <p className="stat-value">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <FaQuestionCircle className="faq-icon" />
                  <span>{faq.question}</span>
                  {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <div className={`faq-answer ${openFaq === index ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help; 