import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaRupeeSign, FaWifi, FaUtensils, FaSnowflake } from 'react-icons/fa';
import '../styles/ListProperty.css';

const ListProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locality: '',
    city: '',
    price: '',
    roomType: '',
    gender: '',
    furnishing: '',
    description: '',
    amenities: {
      wifi: false,
      food: false,
      ac: false,
      laundry: false,
      cleaning: false,
      security: false,
      parking: false,
      gym: false
    },
    rules: {
      guestPolicy: '',
      alcoholAllowed: false,
      nonVegAllowed: false
    },
    photos: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (will be implemented later)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="list-property-container">
      <motion.div 
        className="form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>List Your Property</h1>
        <p className="subtitle">Reach thousands of potential tenants by listing your PG with us</p>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Property Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your PG name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Locality</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  placeholder="Area/Locality"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Rent</label>
                <div className="price-input">
                  <FaRupeeSign className="rupee-icon" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Room Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleInputChange} required>
                  <option value="">Select Room Type</option>
                  <option value="single">Single Occupancy</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} required>
                <option value="">Select Furnishing Type</option>
                <option value="fully">Fully Furnished</option>
                <option value="semi">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              <div 
                className={`amenity-item ${formData.amenities.wifi ? 'active' : ''}`}
                onClick={() => handleAmenityToggle('wifi')}
              >
                <FaWifi />
                <span>WiFi</span>
              </div>
              <div 
                className={`amenity-item ${formData.amenities.food ? 'active' : ''}`}
                onClick={() => handleAmenityToggle('food')}
              >
                <FaUtensils />
                <span>Food</span>
              </div>
              <div 
                className={`amenity-item ${formData.amenities.ac ? 'active' : ''}`}
                onClick={() => handleAmenityToggle('ac')}
              >
                <FaSnowflake />
                <span>AC</span>
              </div>
              {/* More amenities can be added here */}
            </div>
          </div>

          <div className="form-section">
            <h2>Description</h2>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Photos</h2>
            <div className="photo-upload">
              <input type="file" multiple accept="image/*" className="photo-input" />
              <p className="upload-text">Drag & drop photos here or click to upload</p>
              <p className="upload-hint">Upload at least 3 photos of your property</p>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              List Property
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ListProperty;
