import React from 'react';
import './Home.css';
import Navbar from './Navbar';

const Home = () => {
    const testimonials = [
        {
            name: "Dr. Ananya Gupta",
            role: "Clinical Psychologist",
            text: "MindSpace is a vital tool for my practice. Patients can track emotional patterns between sessions easily.",
            avatar: "https://voyageraleigh.com/wp-content/uploads/2025/11/c-1762267245546-personal_1762267240823_1762267240823_keisha_saunderswaldron_keisha-saunders-waldron-web-3.jpg"
        },
        {
            name: "Rahul M.",
            role: "Overcame Severe Anxiety",
            text: "Six months ago, I couldn't leave my house. MindSpace helped me visualize my triggers and find peace.",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGmbP0Sbc_1ueT5iBU9RzqhE_rz5KpJlb-Dw&s"
        },
        {
            name: "Sarah Jenkins",
            role: "Daily User",
            text: "I finally see the link between my sleep and my mood. It feels like talking to a friend who knows me.",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-ZierdE5fUeM7QX8iXjRBl07zL4dAOrkNA&s"
        }
    ];

    return (
        <div className="home-container">
            {/* 1. Navbar Component */}
            <Navbar />

            {/* 2. Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h2 className="hero-title">
                            Your Mental Health<br /> Matters. We're Here to<br /> Help.
                        </h2>
                        <p className="hero-description">
                            Mindspace is an AI-powered platform that helps you understand
                            your mental health, build better habits, and find clarity—
                            anytime, anywhere.
                        </p>
                        <div className="hero-buttons">
                            <a href="/authPage" className="btn-cta">GET STARTED →</a>
                            <a href="/about" className="btn-learn-more">Learn More</a>
                        </div>
                    </div>
                    <img src="https://media.istockphoto.com/id/1363774646/vector/mental-health.jpg?s=612x612&w=0&k=20&c=tez61I2L6Dp9WGPS2qLHJ9G-9sDRM8Uw3mJJEj1NqFE=" alt="Hero" className="hero-image" />
                </div>
            </section>

            {/* 3. Features & Showcase Section */}
            <section className="features-section">
                <div className="partners-banner">
                    <img src="https://www.figma.com/api/mcp/asset/8c4765ca-d436-49d3-9648-4925298e5f72" alt="Partners" />
                </div>
                <hr className="divider" />

                <div className="features-grid">
                    <div className="feature-card">
                        <img src="https://www.figma.com/api/mcp/asset/fb37f047-6fdf-4f6c-a2e8-7c6435b8ee85" alt="Brain" className="feature-icon" />
                        <h3>Understand Your Mind</h3>
                        <p>Get AI-powered insights into your thoughts, emotions, and mental patterns.</p>
                    </div>
                    <div className="feature-card">
                        <img src="https://www.figma.com/api/mcp/asset/27f3a5d1-6ab9-4461-96a9-ca78c1e89e84" alt="Chat" className="feature-icon" />
                        <h3>Personalized Support</h3>
                        <p>Mindspace adapts to you—offering guidance and coping tools based on your mental state.</p>
                    </div>
                    <div className="feature-card">
                        <img src="https://www.figma.com/api/mcp/asset/d10f847e-0780-42a1-ad3b-a5ea0749c056" alt="Growth" className="feature-icon" />
                        <h3>Track Your Growth</h3>
                        <p>Monitor your mood, habits, and progress over time with visual mental health tracking.</p>
                    </div>
                </div>

                {/* Showcase (AI Analysis) */}
                <div className="showcase">
                    <div className="showcase-text">
                        <h2>Understand your mental health faster. Take meaningful action.</h2>
                        <p>Mindspace uses AI to analyze your thoughts, emotions, and habits—helping you identify patterns, reduce stress, and improve your mental well-being with clarity.</p>
                    </div>
                    <img
                        src="https://www.figma.com/api/mcp/asset/2ab130ad-4dcb-466e-bcbe-3179e3dd48bd"
                        alt="App Preview"
                        className="showcase-image"
                    />
                </div>
            </section>

            {/* 4. Get Help Section */}
            <section className="help-section">
                <div className="help-header">
                    <h2 className="section-title">Get Help</h2>
                    <p className="section-subtitle">Signs your mental health might need attention</p>
                </div>

                <div className="help-content">
                    <img src="https://jeevanayurveda.org/wp-content/uploads/2025/10/Mental-Health-Healing-and-Living-a-Balanced-Life-1024x576.jpeg" alt="Mental Health" className="help-image" />
                    <ul className="help-list">
                        <li>Feeling sad or down</li>
                        <li>Inability to concentrate</li>
                        <li>Excessive fears or worries</li>
                        <li>Extreme feelings of guilt</li>
                        <li>Low on energy</li>
                        <li>Paranoia or hallucinations</li>
                        <li>Inability to cope with daily problems</li>
                    </ul>
                </div>

                <div className="help-content reverse">
                    <ul className="help-list">
                        <li>Sudden changes in personality and behavior</li>
                        <li>Major changes in eating habits</li>
                        <li>Inability to be productive at work/studies</li>
                        <li>Dramatic change in sleeping patterns</li>
                        <li>Sexual problems</li>
                        <li>Excessive anger, hostility or violence</li>
                        <li>Suicidal thoughts</li>
                    </ul>
                    <img src="https://img.freepik.com/free-vector/mental-health-disorder-illustration_53876-43164.jpg?semt=ais_user_personalization&w=740&q=80" alt="Mental Health" className="help-image" />
                </div>
            </section>

            {/* 5. Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonial-header-card">
                    <p className="testimonial-label">Client Feedback</p>
                    <h2 className="testimonial-title">Real Stories of Healing</h2>
                    <div className="testimonial-buttons">
                        <button className="btn-join">Join Now!</button>
                    </div>
                </div>

                {testimonials.map((item, index) => (
                    <div className="testimonial-card" key={index}>
                        <img src={item.avatar} alt={item.name} className="testimonial-avatar" />
                        <div className="testimonial-info">
                            <p className="testimonial-name">{item.name}</p>
                            <p className="testimonial-role">{item.role}</p>
                        </div>
                        <hr className="testimonial-divider" />
                        <p className="testimonial-text">{item.text}</p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                ))}
            </section>

            {/* 6. Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="https://www.figma.com/api/mcp/asset/655d459a-b611-453a-9317-bdc5dac55666" alt="MindSpace Logo" />
                            <p>MINDSPACE</p>
                        </div>
                        <div className="footer-copyright">
                            <p>Copyright © 2026 MindSpace AI.</p>
                            <p>All rights reserved</p>
                        </div>
                        <div className="footer-social">
                            <img src="https://www.figma.com/api/mcp/asset/bdacf90e-d9fc-4e1d-b3d4-0b7ece49d61c" alt="Social" />
                            <img src="https://www.figma.com/api/mcp/asset/8b31f198-d53d-4bf3-9e3a-0f072d0f505d" alt="Social" />
                            <img src="https://www.figma.com/api/mcp/asset/f3298538-fa7f-46a3-b1e4-12913ab2efd6" alt="Social" />
                            <img src="https://www.figma.com/api/mcp/asset/df4f5add-d38a-4dcb-80a8-60c7555bf046" alt="Social" />
                        </div>
                    </div>

                    <div className="footer-links">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#terms">Terms of service</a></li>
                            <li><a href="#legal">Legal</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h3>Stay up to date</h3>
                        <div className="newsletter-input">
                            <input type="email" placeholder="olivia@untitledui.com" id="emailInput" />
                            <button id="sendButton">
                                <img src="https://www.figma.com/api/mcp/asset/4bff38d7-8da2-4fa0-b8dd-844c97930663" alt="Send" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;