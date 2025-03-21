import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaMapMarkerAlt, FaBed, FaRupeeSign } from 'react-icons/fa';
import '../styles/FindPG.css';

const FindPG = () => {
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    roomType: '',
    gender: '',
    furnishing: ''
  });

  // Sample PG data (will be replaced with actual API data)
  const pgListings = [
    {
      id: 1,
      name: "Vallabh Residency",
      location: "Near ADIT College, Anand",
      price: 8000,
      roomType: "Single",
      rating: 4.5,
      amenities: ["WiFi", "AC", "Laundry", "Food"],
      image: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      name: "Student Palace PG",
      location: "VV Nagar, Anand",
      price: 10000,
      roomType: "Double Sharing",
      rating: 4.8,
      amenities: ["WiFi", "AC", "Gym", "Food", "Security"],
      image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      name: "Vidyanagar Heights",
      location: "Near SP University, VV Nagar",
      price: 12000,
      roomType: "Single",
      rating: 4.6,
      amenities: ["WiFi", "AC", "Food", "Gaming Room", "Study Area"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      name: "Anand Student Home",
      location: "Ganesh Crossing, Anand",
      price: 7000,
      roomType: "Triple Sharing",
      rating: 4.2,
      amenities: ["WiFi", "Food", "Laundry", "Library"],
      image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      name: "GCET Campus Stay",
      location: "Near GCET College, VV Nagar",
      price: 11000,
      roomType: "Double Sharing",
      rating: 4.7,
      amenities: ["WiFi", "AC", "Food", "Study Room", "Gym"],
      image: "https://images.unsplash.com/photo-1580041065738-e72ab3d8bcb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 6,
      name: "Bhaikaka Student PG",
      location: "Bhaikaka Circle, VV Nagar",
      price: 9000,
      roomType: "Single",
      rating: 4.4,
      amenities: ["WiFi", "AC", "Food", "Power Backup", "Security"],
      image: "https://images.unsplash.com/photo-1580041065738-e72ab3d8bcb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="find-pg-container">
      <section className="search-section">
        <motion.div 
          className="search-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="search-box">
            <FaMapMarkerAlt className="search-icon" />
            <input
              type="text"
              placeholder="Enter location or area..."
              value={filters.location}
              onChange={(e) => handleFilterChange(e)}
              name="location"
            />
            <button className="filter-btn">
              <FaFilter /> Filters
            </button>
          </div>
        </motion.div>
      </section>

      <div className="content-container">
        <aside className="filters-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Price Range</label>
            <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
              <option value="">All Prices</option>
              <option value="0-10000">₹0 - ₹10,000</option>
              <option value="10000-15000">₹10,000 - ₹15,000</option>
              <option value="15000-20000">₹15,000 - ₹20,000</option>
              <option value="20000+">₹20,000+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Room Type</label>
            <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double Sharing</option>
              <option value="triple">Triple Sharing</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Furnishing</label>
            <select name="furnishing" value={filters.furnishing} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="fully">Fully Furnished</option>
              <option value="semi">Semi Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>
        </aside>

        <main className="listings-container">
          <div className="listings-header">
            <h2>Available PGs</h2>
            <select className="sort-select">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="pg-listings">
            {pgListings.map(pg => (
              <motion.div 
                key={pg.id} 
                className="pg-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pg-image" style={{ backgroundImage: `url(${pg.image})` }}>
                  <div className="pg-rating">
                    <span>★ {pg.rating}</span>
                  </div>
                </div>
                <div className="pg-details">
                  <h3>{pg.name}</h3>
                  <p className="location">
                    <FaMapMarkerAlt /> {pg.location}
                  </p>
                  <div className="pg-info">
                    <span><FaBed /> {pg.roomType}</span>
                    <span><FaRupeeSign /> {pg.price}/month</span>
                  </div>
                  <div className="amenities">
                    {pg.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                  <button className="view-details-btn">View Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindPG;
