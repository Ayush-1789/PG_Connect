import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaHome, FaUsers, FaQuoteLeft, FaStar, FaShieldAlt, FaHandshake, FaUserGraduate } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Student",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Found my perfect PG through this platform. The roommate matching system helped me find like-minded people!"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "PG Owner",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Managing my PG has become so much easier. Great platform for reaching out to quality tenants!"
    },
    {
      id: 3,
      name: "Sarah Wilson",
      role: "Student",
      image: "https://randomuser.me/api/portraits/women/67.jpg",
      text: "The detailed filters helped me find a PG that perfectly matched my preferences and budget."
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Find Your Perfect PG & Roommate</h1>
          <p>Discover comfortable PGs and compatible roommates in your preferred location</p>
          <div className="hero-buttons">
            <Link to="/find-pg" className="primary-btn">
              Find PG <FaSearch />
            </Link>
            <Link to="/list-property" className="secondary-btn">
              List Your PG <FaHome />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="user-types">
        <div className="container">
          <div className="user-type student">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaUserGraduate className="type-icon" />
              <h2>For Students & Working Professionals</h2>
              <ul>
                <li>Find verified PGs in your preferred location</li>
                <li>Connect with compatible roommates</li>
                <li>Compare prices and amenities</li>
                <li>Read authentic reviews</li>
              </ul>
              <Link to="/find-pg" className="type-btn student-btn">Start Your Search</Link>
            </motion.div>
          </div>

          <div className="user-type owner">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaHome className="type-icon" />
              <h2>For PG Owners</h2>
              <ul>
                <li>List your property for free</li>
                <li>Reach thousands of verified tenants</li>
                <li>Easy property management</li>
                <li>Secure payment system</li>
              </ul>
              <Link to="/list-property" className="type-btn owner-btn">List Your PG</Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="benefits-grid">
            <motion.div 
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaShieldAlt className="benefit-icon" />
              <h3>Verified Listings</h3>
              <p>All PGs are personally verified to ensure quality and safety</p>
            </motion.div>

            <motion.div 
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaUsers className="benefit-icon" />
              <h3>Smart Matching</h3>
              <p>Find roommates with similar interests and lifestyle</p>
            </motion.div>

            <motion.div 
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FaHandshake className="benefit-icon" />
              <h3>Safe & Secure</h3>
              <p>Secure platform with verified users and secure payments</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>What Our Users Say</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <motion.div 
                key={testimonial.id}
                className="testimonial-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-us">
        <div className="container">
          <div className="about-content">
            <motion.div 
              className="about-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>About Us</h2>
              <p>We are dedicated to making the PG hunting experience seamless and enjoyable. Our platform connects students and working professionals with quality PG accommodations and compatible roommates.</p>
              <p>With years of experience in the housing sector, we understand the challenges faced by both PG seekers and owners. Our mission is to create a trustworthy platform that addresses these challenges effectively.</p>
              <div className="stats">
                <div className="stat-item">
                  <h3>1000+</h3>
                  <p>Verified PGs</p>
                </div>
                <div className="stat-item">
                  <h3>5000+</h3>
                  <p>Happy Users</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Cities</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
