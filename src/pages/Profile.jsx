import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCog, FaHistory, FaHeart } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Sample user data (will be replaced with actual user data)
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    preferences: {
      lifestyle: 'Early Bird',
      schedule: 'Student',
      foodPreference: 'Non-vegetarian',
      smoking: 'Non-smoker',
      drinking: 'Occasional'
    },
    savedPGs: [
      {
        id: 1,
        name: 'GCET Boys Hostel',
        location: 'Vidhyanagar, Anand',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <motion.div 
          className="user-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={userData.avatar} alt={userData.name} className="profile-avatar" />
          <h1>{userData.name}</h1>
        </motion.div>
      </div>

      <div className="profile-content">
        <div className="profile-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaCog /> Preferences
          </button>
          <button 
            className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <FaHeart /> Saved PGs
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> History
          </button>
        </div>

        <div className="profile-details">
          {activeTab === 'profile' && (
            <motion.div 
              className="details-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Personal Information</h2>
              <div className="info-group">
                <label>Full Name</label>
                <div className="info-field">
                  <FaUser className="field-icon" />
                  <input type="text" value={userData.name} readOnly />
                </div>
              </div>
              <div className="info-group">
                <label>Email</label>
                <div className="info-field">
                  <FaEnvelope className="field-icon" />
                  <input type="email" value={userData.email} readOnly />
                </div>
              </div>
              <div className="info-group">
                <label>Phone</label>
                <div className="info-field">
                  <FaPhone className="field-icon" />
                  <input type="tel" value={userData.phone} readOnly />
                </div>
              </div>
              <button className="edit-btn">Edit Profile</button>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div 
              className="details-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Your Preferences</h2>
              <div className="preferences-list">
                {Object.entries(userData.preferences).map(([key, value]) => (
                  <div key={key} className="preference-item">
                    <span className="preference-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="preference-value">{value}</span>
                  </div>
                ))}
              </div>
              <button className="edit-btn">Update Preferences</button>
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div 
              className="details-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Saved PGs</h2>
              <div className="saved-pgs">
                {userData.savedPGs.map(pg => (
                  <div key={pg.id} className="saved-pg-card">
                    <img src={pg.image} alt={pg.name} />
                    <div className="saved-pg-info">
                      <h3>{pg.name}</h3>
                      <p>{pg.location}</p>
                    </div>
                    <button className="view-btn">View Details</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              className="details-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Browsing History</h2>
              <p className="empty-state">No recent activity</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
