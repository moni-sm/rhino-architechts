import React, { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_description: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitContactForm = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', project_description: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">🦏</div>
          RHINO <span style={{fontWeight: 400, fontSize: '0.8rem', display: 'block', letterSpacing: '0'}}>ARCHITECTS AND CONSTRUCTION</span>
        </div>
        <div className="nav-links">
          <a href="#services" className="nav-link">Services</a>
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="#process" className="nav-link">Process</a>
          <a href="#about" className="nav-link">About Us</a>
          <button className="btn-outline">Contact Us</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Turning Ideas Into Reality.</h1>
          <p style={{lineHeight: '1.6'}}>We proudly provide complete solutions for:<br/>Interior Design & Execution • Turnkey Projects • Site Supervision • Construction Planning • Structural Design Services</p>
          <button className="btn-primary">
            Request a Quote 🦏
          </button>
        </div>
      </section>

      {/* Hero Cards */}
      <div className="hero-cards-container">
        <div className="hero-card active">
          <div className="hero-card-icon">📐</div>
          <h3>Architectural Design</h3>
          <div style={{marginTop: '10px', fontSize: '0.9rem', opacity: 0.8}}>Learn More &gt;</div>
        </div>
        <div className="hero-card">
          <div className="hero-card-icon">👷</div>
          <h3>Construction Management</h3>
        </div>
        <div className="hero-card">
          <div className="hero-card-icon">🛋️</div>
          <h3>Interior Excellence</h3>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="section-container about-section" style={{textAlign: 'center', maxWidth: '800px', paddingTop: '100px'}}>
        <div className="section-header">
          <h2>About Us</h2>
        </div>
        <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#555', marginBottom: '20px'}}>
          At Rhino Architects and Construction, we are committed to delivering quality construction, modern designs, and reliable execution for every project.
        </p>
        <p style={{fontSize: '1.2rem', lineHeight: '1.8', color: '#555', fontWeight: '600'}}>
          From planning to completion — we build with precision, creativity, and trust.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="section-container services-section">
        <div className="section-header">
          <h2>Our Services</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📐</div>
            <h3>Architectural Design</h3>
            <p>Architectural design for a commercial design involves to create and architectural of design.</p>
            <a href="#" className="learn-more">Learn More &gt;</a>
          </div>
          <div className="service-card">
            <div className="service-icon">👷</div>
            <h3>Construction Management</h3>
            <p>Construction management for construction management aim of construction management.</p>
            <a href="#" className="learn-more">Learn More &gt;</a>
          </div>
          <div className="service-card">
            <div className="service-icon">🛋️</div>
            <h3>Interior Excellence</h3>
            <p>Interior excellence includes lighting and correspondence to provide care and rich formats.</p>
            <a href="#" className="learn-more">Learn More &gt;</a>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="portfolio" className="section-container projects-section">
        <div className="section-header" style={{textAlign: 'left'}}>
          <h2>Featured Projects</h2>
        </div>
        <div className="projects-grid">
          <div className="project-card">
            <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Building" className="project-image" />
          </div>
          <div className="project-card">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury Home" className="project-image" />
          </div>
          <div className="project-card">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Interior Design" className="project-image" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <div className="logo-icon" style={{width: '30px', height: '30px', fontSize: '1rem'}}>🦏</div>
              RHINO
            </div>
            <div style={{marginTop: '-15px', marginBottom: '15px', fontSize: '1rem', color: 'var(--primary-orange)', fontWeight: '600'}}>
              Design. Build. Deliver.
            </div>
            <div className="footer-contact-details">
              <p>Rhino Architects and Construction<br/>Elite Street, Rhino Honsering, CA 38125</p>
              <p style={{marginTop: '15px', fontSize: '0.9rem', maxWidth: '350px'}}>
                Follow our Instagram page for the latest project updates, design inspirations, and construction progress.
              </p>
            </div>
            <div className="footer-socials">
              <div className="social-icon">f</div>
              <a href="https://www.instagram.com/rhino_architects?igsh=MXVuNG5lNmMwaXNvag==" target="_blank" rel="noopener noreferrer" className="social-icon" style={{textDecoration: 'none', color: 'inherit'}}>ig</a>
              <div className="social-icon">in</div>
              <div className="social-icon">X</div>
            </div>
          </div>
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={submitContactForm}>
              <div className="form-row">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name" 
                  className="form-input"
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                  className="form-input"
                  required
                />
              </div>
              <textarea 
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                placeholder="Project Description" 
                className="form-input"
                required
              ></textarea>
              <button type="submit" className="btn-primary" style={{width: 'fit-content'}}>
                {formStatus === 'submitting' ? 'Sending...' : 'Contact Us'}
              </button>
              {formStatus === 'success' && <p style={{color: '#4CAF50', marginTop: '10px'}}>Message sent successfully!</p>}
              {formStatus === 'error' && <p style={{color: '#F44336', marginTop: '10px'}}>Failed to send message. Please try again.</p>}
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
