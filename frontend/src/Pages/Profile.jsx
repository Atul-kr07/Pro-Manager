import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import { getUser, updateUser } from '../api';
import '../styles/Profile.css';

const Profile = ({ $isOpen }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUser();
      const user = response.data;
      
      if (!user) {
        throw new Error('No user data found');
      }

      const formattedUserData = {
        name: user.username || 'User',
        email: user.email || 'user@example.com',
        role: user.role || 'User',
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        phone: user.phone || 'Not provided',
        location: user.location || 'Not specified',
        status: 'Active'
      };

      setUserData(formattedUserData);
      setEditedData(formattedUserData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to fetch user data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccessMessage('');

      // Create a formatted version of the edited data
      const formattedData = {
        phone: editedData.phone || userData.phone,
        location: editedData.location || userData.location
      };

      // Update user profile in the database
      const response = await updateUser(formattedData);
      
      if (!response.data) {
        throw new Error('Failed to update profile');
      }

      // Update local state with the response data
      const updatedUser = response.data;
      const updatedUserData = {
        ...userData,
        phone: updatedUser.phone || userData.phone,
        location: updatedUser.location || userData.location
      };

      setUserData(updatedUserData);
      setEditedData(updatedUserData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setError(null);
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <FaSpinner className="loading-spinner" /> Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <button onClick={fetchUserData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-error">
        <p>No user data available</p>
        <button onClick={fetchUserData} className="retry-button">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`profile-container ${!$isOpen ? 'sidebar-collapsed' : ''}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <h1>{userData.name}</h1>
        <p className="role">{userData.role}</p>
        <div className="profile-status">
          <span className={`status-badge ${userData.status.toLowerCase()}`}>
            {userData.status}
          </span>
        </div>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="info-grid">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div className="info-content">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email || ''}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div className="info-content">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-content">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editedData.location || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div className="info-content">
                    <label>Join Date</label>
                    <p>{userData.joinDate}</p>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  <FaSave /> Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-content">
                  <label>Email</label>
                  <p>{userData.email}</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="info-content">
                  <label>Phone</label>
                  <p>{userData.phone}</p>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <label>Location</label>
                  <p>{userData.location}</p>
                </div>
              </div>
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div className="info-content">
                  <label>Join Date</label>
                  <p>{userData.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 