import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserAlt, FaMapMarkerAlt, FaBriefcase, FaClock, FaSmoking, FaGlassCheers } from 'react-icons/fa';
import '../styles/FindRoommate.css';

const FindRoommate = () => {
  const [preferences, setPreferences] = useState({
    lifestyle: '',
    schedule: '',
    smoking: '',
    drinking: '',
    foodPreference: '',
    budget: ''
  });

  // Sample roommate data (will be replaced with API data)
  const roommates = [
    {
      id: 1,
      name: "Ayush",
      age: 23,
      occupation: "Software Engineer",
      location: "Vidhyanagar, Anand",
      compatibility: 95,
      lifestyle: "Early Bird",
      interests: ["Technology", "Music", "Reading"],
      preferences: {
        smoking: "Non-smoker",
        drinking: "Occasional",
        food: "Non-vegetarian",
      },
      budget: "15000-20000",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Esha Prajapati",
      age: 24,
      occupation: "UX Designer",
      location: "Vidhyanagar, Anand",
      compatibility: 88,
      lifestyle: "Night Owl",
      interests: ["Art", "Travel", "Photography"],
      preferences: {
        smoking: "Non-smoker",
        drinking: "Never",
        food: "Vegetarian",
      },
      budget: "12000-18000",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="find-roommate-container">
      <div className="preference-section">
        <motion.div 
          className="preference-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Set Your Preferences</h2>
          <p className="subtitle">Help us find your ideal roommate match</p>
          
          <div className="preferences-grid">
            <div className="preference-group">
              <label>Lifestyle</label>
              <select name="lifestyle" value={preferences.lifestyle} onChange={handlePreferenceChange}>
                <option value="">Select Lifestyle</option>
                <option value="early_bird">Early Bird</option>
                <option value="night_owl">Night Owl</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="preference-group">
              <label>Schedule</label>
              <select name="schedule" value={preferences.schedule} onChange={handlePreferenceChange}>
                <option value="">Select Schedule</option>
                <option value="student">Student</option>
                <option value="working">Working Professional</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            <div className="preference-group">
              <label>Smoking Preference</label>
              <select name="smoking" value={preferences.smoking} onChange={handlePreferenceChange}>
                <option value="">Select Preference</option>
                <option value="yes">Smoker</option>
                <option value="no">Non-smoker</option>
                <option value="occasional">Occasional</option>
              </select>
            </div>

            <div className="preference-group">
              <label>Drinking Preference</label>
              <select name="drinking" value={preferences.drinking} onChange={handlePreferenceChange}>
                <option value="">Select Preference</option>
                <option value="yes">Regular</option>
                <option value="no">Never</option>
                <option value="occasional">Occasional</option>
              </select>
            </div>

            <div className="preference-group">
              <label>Food Preference</label>
              <select name="foodPreference" value={preferences.foodPreference} onChange={handlePreferenceChange}>
                <option value="">Select Preference</option>
                <option value="veg">Vegetarian</option>
                <option value="non_veg">Non-vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div className="preference-group">
              <label>Budget Range (₹)</label>
              <select name="budget" value={preferences.budget} onChange={handlePreferenceChange}>
                <option value="">Select Budget</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-15000">₹10,000 - ₹15,000</option>
                <option value="15000-20000">₹15,000 - ₹20,000</option>
                <option value="20000+">₹20,000+</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="matches-section">
        <h2>Your Matches</h2>
        <div className="roommate-cards">
          {roommates.map(roommate => (
            <motion.div 
              key={roommate.id}
              className="roommate-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="compatibility-badge">
                <span>{roommate.compatibility}%</span>
                Match
              </div>
              
              <div className="roommate-header">
                <img src={roommate.avatar} alt={roommate.name} className="avatar" />
                <div className="roommate-info">
                  <h3>{roommate.name}</h3>
                  <p className="age-occupation">
                    {roommate.age} • {roommate.occupation}
                  </p>
                  <p className="location">
                    <FaMapMarkerAlt /> {roommate.location}
                  </p>
                </div>
              </div>

              <div className="roommate-details">
                <div className="detail-item">
                  <FaClock />
                  <span>{roommate.lifestyle}</span>
                </div>
                <div className="detail-item">
                  <FaSmoking />
                  <span>{roommate.preferences.smoking}</span>
                </div>
                <div className="detail-item">
                  <FaGlassCheers />
                  <span>{roommate.preferences.drinking}</span>
                </div>
              </div>

              <div className="interests">
                {roommate.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
              </div>

              <button className="connect-btn">Connect</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindRoommate;
