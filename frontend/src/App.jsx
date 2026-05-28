import React, { useState, useEffect } from 'react';
import './index.css';
import logoImg from './assets/logo_orange.png';
import loaderVid from './assets/loader.mp4';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DEFAULT_PROJECTS = [
  {
    title: "Eco-Villa Concept House",
    category: "Residential Construction",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    details: "A completed energy-efficient modular residence featuring sustainable timber framing, solar integrated roof planning, and recycled insulation systems.",
    status: "Completed"
  },
  {
    title: "Bespoke Dining & Living",
    category: "Interior Excellence",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    details: "A completed luxury custom dining space designed with warm oak furniture panels, hidden smart LED layouts, and space-optimizing open-floor layouts.",
    status: "Completed"
  },
  {
    title: "Boutique Co-Working Studio",
    category: "Commercial Architecture",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    details: "A completed turnkey office renovation delivering acoustic wood panelling, flexible desks, and custom steel partition grids for local startups.",
    status: "Completed"
  },
  {
    title: "Modern Duplex Build",
    category: "Residential Construction",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    details: "An ongoing duplex residential construction project focusing on parametric brickwork facades, open concrete columns, and premium plumbing installation.",
    status: "Ongoing"
  },
  {
    title: "Urban Office Fit-Out",
    category: "Commercial Turnkey",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    details: "An ongoing workspace interior redesign delivering integrated HVAC controls, corporate color schemes, and structural layout optimization.",
    status: "Ongoing"
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Rhino Architects turned our dream home into reality. They took care of everything from architectural planning to interior excellence. The site supervision was daily and meticulous.",
    author: "Sarah Jenkins",
    role: "Homeowner, Villa Crest",
    rating: 5
  },
  {
    quote: "For our commercial space expansion, we needed a team that could deliver on time and strictly follow building guidelines. Rhino delivered the project 2 weeks ahead of schedule.",
    author: "Marcus Chen",
    role: "CEO, TechSpace Office",
    rating: 5
  },
  {
    quote: "Their transparent pricing and professional execution are incredibly refreshing. We received weekly photo updates and a detailed breakdown of raw materials. Exceptionally recommended!",
    author: "David Miller",
    role: "Penthouse Owner",
    rating: 5
  }
];

function App() {
  // Navigation & Scroll state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  // Dynamic projects list state
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);

  // Dynamic testimonials list state
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  // Control4-style extra interactive states
  const [possibilitiesTab, setPossibilitiesTab] = useState('Home'); // 'Home' | 'Business'
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Review Submission Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    author: '',
    role: '',
    rating: 5,
    quote: ''
  });
  const [reviewFormStatus, setReviewFormStatus] = useState(null);

  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Hi! I am the Rhino Architects virtual assistant. Ask me anything about our services, completed duplexes/villas, office location, pricing, or working hours. For custom drawings, you can email us anytime!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_description: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  // Hero Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch projects from FastAPI on mount
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        setProjects(DEFAULT_PROJECTS);
      }
    } catch (err) {
      console.warn("Backend API offline, falling back to static projects list.", err);
      setProjects(DEFAULT_PROJECTS);
    }
  };

  // Fetch reviews from FastAPI on mount
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.length > 0 ? data : DEFAULT_TESTIMONIALS);
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    } catch (err) {
      console.warn("Backend API offline, falling back to static reviews list.", err);
      setTestimonials(DEFAULT_TESTIMONIALS);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProjects(), fetchReviews()]);
      setTimeout(() => {
        setAppLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide Hero Timer
  const slides = [
    {
      title: "Exquisite Custom Homes",
      subtitle: "Designing contemporary spaces with cutting-edge blueprints and structural excellence.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85",
      ctaText: "Explore Projects",
      ctaLink: "#possibilities"
    },
    {
      title: "Precision Commercial Workspaces",
      subtitle: "Delivering high-end office and retail buildings with rigorous site oversight and safety metrics.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85",
      ctaText: "Our Process",
      ctaLink: "#why-us"
    },
    {
      title: "Bespoke Interior Masterpieces",
      subtitle: "Curating customized luxury interiors and turn-key furnishing tailored to your taste.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85",
      ctaText: "Request a Quote",
      ctaLink: "#contact"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Contact form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitContactForm = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
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



  // Close details modal and scroll to contact form with prefilled values
  const handleInquireProject = (project) => {
    setSelectedProject(null);
    setFormData((prev) => ({
      ...prev,
      project_description: `I am interested in inquiring about a project similar to "${project.title}" (${project.category}) located in ${project.location}. Please provide details on execution timeline and estimated costs.`
    }));
    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Submit client review from landing page (moderated)
  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    setReviewFormStatus('submitting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reviewFormData,
          published: false // New public reviews are unpublished by default
        }),
      });
      if (res.ok) {
        setReviewFormStatus('success');
        setReviewFormData({ author: '', role: '', rating: 5, quote: '' });
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewFormStatus(null);
        }, 3000);
      } else {
        setReviewFormStatus('error');
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewFormStatus('error');
    }
  };

  // Send a message to the chatbot assistant
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    // Scroll chat window down
    setTimeout(() => {
      const container = document.getElementById("chatbot-msg-container");
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { sender: 'assistant', text: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { sender: 'assistant', text: "Sorry, I am facing an issue loading my response. Please email our senior architects directly at inquire@rhinoarchitects.com." }]);
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: "Connection error. Make sure the FastAPI backend is running or email us at inquire@rhinoarchitects.com." }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        const container = document.getElementById("chatbot-msg-container");
        if (container) container.scrollTop = container.scrollHeight;
      }, 50);
    }
  };

  const services = [
    {
      icon: "📐",
      title: "Architectural Design",
      desc: "Custom residential and commercial architectural blueprints, space planning, and immersive 3D visualizations."
    },
    {
      icon: "👷",
      title: "Construction Management",
      desc: "End-to-end execution, material procurement, budgeting, and timeline controls for high-standard structural builds."
    },
    {
      icon: "🛋️",
      title: "Interior Excellence",
      desc: "Bespoke space layouts, curated interior finishes, smart lighting layouts, and custom handpicked furniture pieces."
    },
    {
      icon: "🔑",
      title: "Turnkey Projects",
      desc: "Complete design-and-build solutions where we handle every phase from concept planning to final key handover."
    },
    {
      icon: "📋",
      title: "Site Supervision",
      desc: "Daily inspection logs, structural checks, safety audits, and engineering oversight to maintain building integrity."
    },
    {
      icon: "🏗️",
      title: "Structural Planning",
      desc: "Advanced structural engineering calculations, foundation design, loading specs, and municipal drawings approval."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Consultation & Concept",
      desc: "We analyze your plot or space, list your custom design requirements, and draft initial conceptual sketches."
    },
    {
      number: "02",
      title: "Detailed Design & 3D",
      desc: "Our architects render detailed structural blueprints, electrical/plumbing maps, and photorealistic 3D models."
    },
    {
      number: "03",
      title: "Execution & Oversight",
      desc: "Our engineers commence earthwork, concrete structural framing, interior brickwork, and daily quality oversight."
    },
    {
      number: "04",
      title: "Quality Handover",
      desc: "A meticulous multi-point inspection is conducted. The project is delivered clean, fully tested, and ready to use."
    }
  ];

  const trustPoints = [
    {
      title: "100% Quality Execution",
      desc: "We enforce strict construction parameters, using only premium grade steel, concrete, and certified materials."
    },
    {
      title: "Experienced Technical Team",
      desc: "Our team includes certified structural engineers, interior designers, and registered site inspectors."
    },
    {
      title: "Rigorous Site Supervision",
      desc: "We guarantee daily site monitoring logs and send weekly progress digests directly to our clients."
    },
    {
      title: "Transparent BOQ Estimates",
      desc: "We believe in honest partnerships. Our bills of quantities (BOQ) outline exact rates with zero hidden charges."
    }
  ];

  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "15+", label: "Years of Experience" },
    { value: "100%", label: "Satisfaction Rate" },
    { value: "25+", label: "Expert Professionals" }
  ];

  const currentTestimonial = testimonials[activeTestimonial] || testimonials[0] || { quote: "", author: "", role: "", rating: 5 };

  // RENDER LANDING VIEW (CONTROL4 STYLE SECTIONS)
  return (
    <div className="app">
      {appLoading && (
        <div className="page-preloader">
          <div className="preloader-content">
            <video 
              src={loaderVid} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="preloader-video"
            />
            <p className="preloader-text">Constructing Experiences...</p>
          </div>
        </div>
      )}
      {/* 1. Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoImg} alt="Rhino Architects and Construction Logo" className="logo-img" />
          <div className="logo-text">
            <div className="logo-brand">RHINO</div>
            <div className="logo-sub">ARCHITECTS &amp; CONSTRUCTION</div>
          </div>
        </div>
        <div className="nav-links">
          {/* Dropdown 1: For Home */}
          <div className="nav-item-dropdown">
            <span className="nav-link dropdown-trigger">For Home</span>
            <div className="dropdown-menu">
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Home')} className="dropdown-item">Residential Overview</a>
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Home')} className="dropdown-item">Bespoke Villas</a>
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Home')} className="dropdown-item">Interior Design</a>
              <a href="#benefits" className="dropdown-item">Structural Engineering</a>
            </div>
          </div>
          {/* Dropdown 2: For Business */}
          <div className="nav-item-dropdown">
            <span className="nav-link dropdown-trigger">For Business</span>
            <div className="dropdown-menu">
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Business')} className="dropdown-item">Commercial Turnkey</a>
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Business')} className="dropdown-item">Modern Office Layouts</a>
              <a href="#possibilities" onClick={() => setPossibilitiesTab('Business')} className="dropdown-item">Retail Fit-Outs</a>
              <a href="#benefits" className="dropdown-item">Fitness &amp; Workspace Planning</a>
            </div>
          </div>
          {/* Dropdown 3: Our Process */}
          <div className="nav-item-dropdown">
            <span className="nav-link dropdown-trigger">Our Process</span>
            <div className="dropdown-menu">
              <a href="#discover" className="dropdown-item">The Rhino Difference</a>
              <a href="#benefits" className="dropdown-item">Site Supervision</a>
              <a href="#benefits" className="dropdown-item">Timeline &amp; Quality Checks</a>
            </div>
          </div>
          {/* Dropdown 4: Resources */}
          <div className="nav-item-dropdown">
            <span className="nav-link dropdown-trigger">Resources</span>
            <div className="dropdown-menu">
              <a href="#partners" className="dropdown-item">Our Partners</a>
              <a href="#testimonials" className="dropdown-item">Client Reviews</a>
            </div>
          </div>
          <a href="#contact" className="nav-link nav-btn">Request a Quote</a>
        </div>

        {/* Hamburger toggle — mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle mobile navigation"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
            <a href="#discover" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#possibilities" className="mobile-nav-link" onClick={() => { setPossibilitiesTab('Home'); setMobileMenuOpen(false); }}>For Home</a>
            <a href="#possibilities" className="mobile-nav-link" onClick={() => { setPossibilitiesTab('Business'); setMobileMenuOpen(false); }}>For Business</a>
            <a href="#benefits" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Our Process</a>
            <a href="#partners" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Partners</a>
            <a href="#testimonials" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <a href="#contact" className="mobile-nav-link mobile-nav-cta" onClick={() => setMobileMenuOpen(false)}>Request a Quote</a>
          </div>
        </div>
      )}

      {/* 2. Hero Slider with Overlay styling */}
      <section className="hero-slider-section">
        <div className="slides-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'slide-active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.7), rgba(17, 17, 17, 0.8)), url(${slide.image})` }}
            >
              <div className="slide-content">
                <span className="slide-tag">DESIGN • BUILD • DELIVER</span>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="slide-ctas">
                  <a href={slide.ctaLink} className="btn-square-red">{slide.ctaText}</a>
                  <a href="#contact" className="btn-outline-red">Get in Touch</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="slider-arrow arrow-left"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="slider-arrow arrow-right"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'dot-active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. Discover Section */}
      <section id="discover" className="discover-section">
        <div className="discover-container">
          <div className="discover-content">
            <h3 className="section-title-c4">Discover the Rhino Difference</h3>
            <p className="section-desc-c4">
              Rhino Architects and Construction connects design, structure, and execution, bringing them all into one cohesive platform that delivers incredible architectural experiences. Our team personalizes your home or business environment, utilizing advanced structural calculations, site supervision, and premium turnkey delivery. Replace the stress of managing multiple contractors with one single, unified design-build partner.
            </p>
            <a href="#contact" className="btn-square-red">Learn More</a>
          </div>
          <div className="discover-image-box">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Rhino Architectural Excellence" 
              className="discover-image" 
            />
          </div>
        </div>
      </section>

      {/* 4. Explore the Possibilities Section */}
      <section id="possibilities" className="explore-possibilities-section">
        <div className="possibilities-intro">
          <h3 className="section-title-c4 text-center">Explore the Possibilities</h3>
          <p className="section-desc-c4 text-center">
            Create your dream custom residential home or commercial workspace with Rhino Architects, transforming your ideas into structural masterworks.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-menu">
          <button 
            className={`tab-btn ${possibilitiesTab === 'Home' ? 'tab-btn-active' : ''}`}
            onClick={() => setPossibilitiesTab('Home')}
          >
            For Home
          </button>
          <button 
            className={`tab-btn ${possibilitiesTab === 'Business' ? 'tab-btn-active' : ''}`}
            onClick={() => setPossibilitiesTab('Business')}
          >
            For Business
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-wrapper">
          {possibilitiesTab === 'Home' ? (
            <div className="tab-pane">
              <div className="tab-split-layout">
                {/* Left Side Feature Showcase */}
                <div className="tab-feature-showcase">
                  <div className="feature-video-mock">
                    <img 
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Residential Spotlight" 
                    />
                    <div className="play-badge">RESIDENTIAL</div>
                  </div>
                  <div className="feature-showcase-text">
                    <h4>Residential Masterpieces</h4>
                    <p>
                      A truly customized home enhances your daily life by boosting convenience, increasing structural safety, amplifying aesthetic appeal, and maximizing comfort.
                    </p>
                    <a href="#contact" className="btn-square-red">Explore Whole Home Solutions</a>
                  </div>
                </div>

                {/* Right Side Projects Carousel */}
                <div className="tab-projects-carousel-container">
                  <div className="projects-carousel">
                    {projects
                      .filter(p => 
                        p.category.toLowerCase().includes('residential') || 
                        p.category.toLowerCase().includes('interior') || 
                        p.category.toLowerCase().includes('villa') ||
                        p.category.toLowerCase().includes('dining')
                      )
                      .map((project, idx) => (
                        <div key={idx} className="c4-project-card" onClick={() => setSelectedProject(project)}>
                          <div className="card-top">
                            {project.status && (
                              <span className={`status-badge ${project.status.toLowerCase()}`}>
                                {project.status}
                              </span>
                            )}
                            <h5>{project.title}</h5>
                            <span className="c4-learn-more">Learn More &rarr;</span>
                          </div>
                          <div className="card-image-box">
                            <img src={project.image} alt={project.title} />
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="carousel-catalog-btn-box">
                    <a href="#contact" className="btn-square-red outline-red">View Product Catalog</a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tab-pane">
              <div className="tab-split-layout">
                {/* Left Side Feature Showcase */}
                <div className="tab-feature-showcase">
                  <div className="feature-video-mock">
                    <img 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Commercial Spotlight" 
                    />
                    <div className="play-badge">COMMERCIAL</div>
                  </div>
                  <div className="feature-showcase-text">
                    <h4>Commercial Solutions</h4>
                    <p>
                      Transform your business by enabling unified design-build execution, combining high-quality engineering, cost-effective budgeting, and prompt project delivery.
                    </p>
                    <a href="#contact" className="btn-square-red">Discover Commercial Solutions</a>
                  </div>
                </div>

                {/* Right Side Projects Carousel */}
                <div className="tab-projects-carousel-container">
                  <div className="projects-carousel">
                    {projects
                      .filter(p => 
                        p.category.toLowerCase().includes('commercial') || 
                        p.category.toLowerCase().includes('corporate') || 
                        p.category.toLowerCase().includes('lobby') ||
                        p.category.toLowerCase().includes('office') ||
                        p.category.toLowerCase().includes('turnkey')
                      )
                      .map((project, idx) => (
                        <div key={idx} className="c4-project-card" onClick={() => setSelectedProject(project)}>
                          <div className="card-top">
                            {project.status && (
                              <span className={`status-badge ${project.status.toLowerCase()}`}>
                                {project.status}
                              </span>
                            )}
                            <h5>{project.title}</h5>
                            <span className="c4-learn-more">Learn More &rarr;</span>
                          </div>
                          <div className="card-image-box">
                            <img src={project.image} alt={project.title} />
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="carousel-catalog-btn-box">
                    <a href="#contact" className="btn-square-red outline-red">View Product Catalog</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. The Benefits are Built In Section */}
      <section id="benefits" className="benefits-section">
        <div className="benefits-intro">
          <h3 className="section-title-c4 text-center">The Benefits are Built In</h3>
          <p className="section-desc-c4 text-center">
            Partnering with Rhino Architects allows you to personalize your spaces to reflect your unique lifestyle or corporate goals. From concept sketches to turnkey handover, our process is designed to scale and adapt, guaranteeing a seamless construction experience.
          </p>
        </div>

        <div className="benefits-list">
          {/* Row 1: Customizable Systems */}
          <div className="benefit-row">
            <div className="benefit-image-box">
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Customizable Systems" />
            </div>
            <div className="benefit-text-box">
              <h4>Customizable Systems</h4>
              <p>
                Your custom architectural layout and structural blueprints are designed around your current needs while remaining flexible to scale for future growth. We align every layout to your preferences and assist with updates as your vision scales.
              </p>
            </div>
          </div>

          {/* Row 2: Total Control */}
          <div className="benefit-row row-reverse">
            <div className="benefit-image-box">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Total Control" />
            </div>
            <div className="benefit-text-box">
              <h4>Total Control</h4>
              <p>
                Keep your construction project at your fingertips with our weekly progress digests. You get detailed bills of quantities (BOQ), raw material logs, site inspection checklists, and direct digital coordination so you are always in complete control of your budget and timeline.
              </p>
            </div>
          </div>

          {/* Row 3: Professional Integrity */}
          <div className="benefit-row">
            <div className="benefit-image-box">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Professional Integrity" />
            </div>
            <div className="benefit-text-box">
              <h4>Professional Integrity</h4>
              <p>
                Our certified structural engineers, architects, and registered site inspectors ensure your project is correctly installed, secure, and built to withstand the test of time. We check every detail from foundation load maps to custom interior wood trims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Works with Premium Partners Section */}
      <section id="partners" className="partners-section">
        <div className="partners-intro">
          <h3 className="section-title-c4 text-center">Works with Premium Partners</h3>
          <p className="section-desc-c4 text-center">
            We collaborate with industry-leading material suppliers, premium fixtures brands, and engineering safety authorities to deliver top-tier architectural builds. We integrate them into one cohesive execution plan.
          </p>
        </div>

        {/* Partner Logos Grid */}
        <div className="partners-logo-grid">
          <div className="partner-logo-item">HOLCIM</div>
          <div className="partner-logo-item">LUTRON</div>
          <div className="partner-logo-item">BALDWIN</div>
          <div className="partner-logo-item">SCHINDLER</div>
          <div className="partner-logo-item">YALE</div>
          <div className="partner-logo-item">TATA STEEL</div>
          <div className="partner-logo-item">HUNTER DOUGLAS</div>
          <div className="partner-logo-item">CRESTRON</div>
        </div>

        <p className="partners-footer-text">
          Our certified engineering professionals offer tailored solutions to perfectly match your specifications.
        </p>
        <div className="partners-cta-box">
          <a href="#contact" className="btn-square-red">Find Your Nearest Office</a>
        </div>

        {/* Testimonials Quote Slider */}
        <div id="testimonials" className="testimonials-c4-slider-container">
          <div className="testimonials-quote-mark">“</div>
          {currentTestimonial && (
            <div className="testimonials-quote-content">
              <p className="quote-text">"{currentTestimonial.quote}"</p>
              <p className="quote-author">— {currentTestimonial.author}, <span className="quote-role">{currentTestimonial.role}</span></p>
              {currentTestimonial.rating && (
                <div className="quote-rating" style={{ color: 'var(--primary-orange)', marginTop: '8px', fontSize: '1.1rem' }}>
                  {"★".repeat(currentTestimonial.rating)}
                </div>
              )}
            </div>
          )}
          
          <div className="testimonials-slider-controls">
            <button 
              className="slider-control-arrow" 
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            >
              &larr;
            </button>
            <div className="slider-control-dots">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  className={`slider-control-dot ${i === activeTestimonial ? 'dot-active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
            <button 
              className="slider-control-arrow" 
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
            >
              &rarr;
            </button>
          </div>


        </div>
      </section>

      {/* 7. Contact Form Section */}
      <section id="contact" className="contact-section-c4">
        <div className="contact-container">
          <div className="contact-info">
            <h3 className="section-title-c4 text-left">Ready to Start Your Construction Journey?</h3>
            <p className="contact-subtitle">
              Whether you are planning a residential villa, need structural blueprints, or want a full turnkey commercial build, our expert team is ready to deliver.
            </p>
            <div className="contact-list-items">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h6>Office Address</h6>
                  <p>Rhino Architects and Construction<br />Elite Street, Rhino Honsering, CA 38125</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h6>Call / WhatsApp</h6>
                  <p>+1 (555) 744-6627</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h6>Email Support</h6>
                  <p>inquire@rhinoarchitects.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            <h4>Send An Inquiry</h4>
            <p>Fill out the form below and one of our Senior Architects will reach out within 24 hours.</p>
            <form onSubmit={submitContactForm}>
              <div className="form-field">
                <label htmlFor="name-input">Full Name</label>
                <input 
                  id="name-input"
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>
              <div className="form-field">
                <label htmlFor="email-input">Email Address</label>
                <input 
                  id="email-input"
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="e.g. john@example.com"
                  required 
                />
              </div>
              <div className="form-field">
                <label htmlFor="desc-input">Project Description</label>
                <textarea 
                  id="desc-input"
                  name="project_description" 
                  value={formData.project_description} 
                  onChange={handleInputChange} 
                  placeholder="Describe your requirements (e.g. 3-story residential villa turnkey execution)..."
                  required 
                />
              </div>
              <button type="submit" className="btn-square-red submit-btn">
                {formStatus === 'submitting' ? 'Sending Request...' : 'Submit Inquiry'}
              </button>
              {formStatus === 'success' && <p className="form-alert success">✓ Thank you! Your inquiry has been submitted successfully.</p>}
              {formStatus === 'error' && <p className="form-alert error">✗ Failed to submit inquiry. Please check your connection and try again.</p>}
            </form>
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <footer className="footer-c4">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <img src={logoImg} alt="Rhino Logo" className="footer-logo-img" />
              <span>RHINO</span>
            </div>
            <p>
              Premier planning, interior execution, structural design services, and complete turnkey builds. Building modern structures with solid values.
            </p>
            <div className="footer-meta-info">
              <p>📍 Elite Street, Rhino Honsering, CA 38125</p>
              <p>📞 +1 (555) 744-6627</p>
              <p>✉️ info@rhinoarchitects.com</p>
            </div>
          </div>

          <div className="footer-col">
            <h5>Residential Solutions</h5>
            <ul>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Home')}>Whole Home Planning</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Home')}>Bespoke Villa Construction</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Home')}>Bespoke Living Spaces</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Home')}>Interior Customization</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Commercial Services</h5>
            <ul>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Business')}>Smart Workspace Layouts</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Business')}>Retail Building & Fit-Outs</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Business')}>Fitness & Spa Designs</a></li>
              <li><a href="#possibilities" onClick={() => setPossibilitiesTab('Business')}>Turnkey Office Spaces</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="#partners">Our Partners</a></li>
              <li><a href="#testimonials">Client Testimonials</a></li>
              <li><a href="#contact">Get in Touch</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rhino Architects and Construction. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Service</a>
            <span>|</span>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* Dynamic Project Details Showcase Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>&times;</button>
            <div className="modal-content-grid">
              <div className="modal-image-col">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>
              <div className="modal-info-col">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="modal-cat-tag" style={{ marginBottom: 0 }}>{selectedProject.category}</span>
                  {selectedProject.status && (
                    <span className={`status-badge ${selectedProject.status.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                      {selectedProject.status}
                    </span>
                  )}
                </div>
                <h2>{selectedProject.title}</h2>
                <span className="modal-loc-tag">📍 {selectedProject.location}</span>
                <div className="modal-divider"></div>
                <h3>Showcase & Execution Details</h3>
                <p className="modal-details-text">{selectedProject.details || "No details provided."}</p>
                <div className="modal-cta-box">
                  <p>Interested in designing or executing a similar project?</p>
                  <button onClick={() => handleInquireProject(selectedProject)} className="btn-primary modal-cta-btn">
                    Inquire About This Project 🦏
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 9. Write Review Modal Overlay */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close-btn" onClick={() => setShowReviewModal(false)}>&times;</button>
            <div className="modal-content-form" style={{ padding: '30px' }}>
              <h2 style={{ fontFamily: 'Orbitron', marginBottom: '8px', color: 'var(--primary-blue)' }}>Write a Review</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Your review will be submitted to our team for moderation and published shortly.
              </p>
              
              <form onSubmit={handleReviewFormSubmit}>
                <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', textAlign: 'left' }}>Your Name</label>
                  <input 
                    type="text" 
                    value={reviewFormData.author}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, author: e.target.value })}
                    placeholder="e.g. John Doe"
                    required
                    style={{ padding: '10px 14px', border: '1px solid var(--gray-border)', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', textAlign: 'left' }}>Designation / Role</label>
                  <input 
                    type="text" 
                    value={reviewFormData.role}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, role: e.target.value })}
                    placeholder="e.g. Homeowner, Penthouse 4"
                    required
                    style={{ padding: '10px 14px', border: '1px solid var(--gray-border)', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', textAlign: 'left' }}>Rating Score</label>
                  <select 
                    value={reviewFormData.rating}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, rating: parseInt(e.target.value, 10) })}
                    required
                    style={{ padding: '10px 14px', border: '1px solid var(--gray-border)', borderRadius: '4px', backgroundColor: '#fff', outline: 'none' }}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>

                <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', textAlign: 'left' }}>Review Description</label>
                  <textarea 
                    value={reviewFormData.quote}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, quote: e.target.value })}
                    placeholder="Describe your design and construction experience..."
                    required
                    style={{ padding: '10px 14px', border: '1px solid var(--gray-border)', borderRadius: '4px', minHeight: '100px', resize: 'vertical', outline: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-square-red submit-btn" style={{ width: '100%', padding: '12px' }}>
                  {reviewFormStatus === 'submitting' ? 'Submitting Review...' : 'Submit Testimonial'}
                </button>
                
                {reviewFormStatus === 'success' && (
                  <p className="form-alert success" style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', backgroundColor: '#e2f0d9', color: '#385723', textAlign: 'center' }}>
                    ✓ Testimonial submitted successfully for admin review!
                  </p>
                )}
                {reviewFormStatus === 'error' && (
                  <p className="form-alert error" style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', backgroundColor: '#fce4d6', color: '#c65911', textAlign: 'center' }}>
                    ✗ Submission failed. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 10. Floating Chatbot Button */}
      <button 
        className="chatbot-fab" 
        onClick={() => setShowChatbot(!showChatbot)}
        aria-label="Toggle chat assistant"
      >
        <span className="fab-icon">💬</span>
        <span className="fab-subscript">Ask Assistant</span>
      </button>

      {/* 11. Chatbot Dialogue Window */}
      {showChatbot && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🦏</div>
            <div className="chatbot-title-block">
              <h4>Rhino Assistant</h4>
              <span>Online • Ready to help</span>
            </div>
            <button className="chatbot-close" onClick={() => setShowChatbot(false)}>&times;</button>
          </div>
          
          <div className="chatbot-messages" id="chatbot-msg-container">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble-wrapper assistant">
                <div className="chat-bubble assistant typing">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="chatbot-input-area">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              placeholder="Ask about projects, pricing, services..." 
              required
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping}>➔</button>
          </form>

          <div className="chatbot-footer">
            <span>Stuck? <a href="mailto:inquire@rhinoarchitects.com?subject=Inquiry%20from%20Chatbot" className="mail-redirect-btn">✉️ Email Admin Directly</a></span>
          </div>
        </div>
      )}

      {/* 12. Floating Write Review Button (Bottom-Left) */}
      <button 
        className="review-fab" 
        onClick={() => { setShowReviewModal(true); setReviewFormStatus(null); }}
        aria-label="Write a review"
      >
        <span className="fab-icon">⭐</span>
        <span className="fab-subscript">Write a Review</span>
      </button>
    </div>
  );
}

export default App;
