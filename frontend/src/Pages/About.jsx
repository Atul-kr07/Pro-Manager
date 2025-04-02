import React from 'react';
import { 
  FaRocket, 
  FaLightbulb, 
  FaCode, 
  FaUsers, 
  FaChartBar,
  FaHeart,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  const mission = {
    title: "Our Mission",
    description: "To empower individuals and teams with a powerful, intuitive project management solution that streamlines workflows and drives productivity.",
    icon: <FaRocket />
  };

  const vision = {
    title: "Our Vision",
    description: "To become the go-to project management platform that transforms how people organize and execute their work.",
    icon: <FaLightbulb />
  };

  const values = [
    {
      title: "Innovation",
      description: "Constantly evolving and improving to meet the changing needs of our users.",
      icon: <FaCode />
    },
    {
      title: "User-Centric",
      description: "Putting our users first and creating solutions that make their work easier.",
      icon: <FaUsers />
    },
    {
      title: "Data-Driven",
      description: "Making decisions based on real data and user feedback.",
      icon: <FaChartBar />
    },
    {
      title: "Passion",
      description: "Dedicated to creating the best project management experience.",
      icon: <FaHeart />
    }
  ];

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Pro Manager</h1>
        <p>A modern project management solution designed to help you succeed</p>
      </div>

      <div className="about-content">
        {/* Mission & Vision Section */}
        <section className="mission-vision-section">
          <div className="mission-card">
            <div className="mission-icon">{mission.icon}</div>
            <h2>{mission.title}</h2>
            <p>{mission.description}</p>
          </div>
          <div className="vision-card">
            <div className="vision-icon">{vision.icon}</div>
            <h2>{vision.title}</h2>
            <p>{vision.description}</p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="developer-section">
          <h2>Meet the Developer</h2>
          <div className="developer-card">
            <div className="developer-info">
              <h3>Atul Kumar</h3>
              <p>Full Stack Developer</p>
              <div className="developer-links">
                <a href="https://github.com/iiiatulll007" target="_blank" rel="noopener noreferrer" className="github-link">
                  <FaGithub /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/kunal-kumar-iiiatulll007/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                  <FaLinkedin /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;