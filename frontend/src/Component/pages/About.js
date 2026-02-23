import React from 'react';
import Navbar from '../Navbar'; // HE LINE FIX KELI AAHE
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    // Inline CSS Styles
    const styles = {
        container: {
            fontFamily: "'Montserrat', sans-serif",
            backgroundColor: "#fafafa",
            color: "#333",
            lineHeight: "1.6",
            overflowX: "hidden"
        },
        hero: {
            backgroundColor: "#0d0d0d",
            padding: "140px 20px 80px",
            textAlign: "center",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        heroTitle: {
            color: "#ffffff",
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: "800",
            marginBottom: "20px",
            textTransform: "uppercase"
        },
        spanNeon: {
            color: "#a8ff35"
        },
        heroSub: {
            color: "#ccc",
            fontSize: "1.1rem",
            maxWidth: "800px",
            margin: "0 auto"
        },
        section: {
            padding: "80px 10%",
            display: "flex",
            flexWrap: "wrap",
            gap: "60px",
            alignItems: "center"
        },
        imageSide: {
            flex: "1",
            minWidth: "300px",
            borderRadius: "30px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            width: "100%"
        },
        contentSide: {
            flex: "1",
            minWidth: "300px"
        },
        missionTitle: {
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#1677ff"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            padding: "60px 10%",
            backgroundColor: "#fff"
        },
        card: {
            padding: "40px 30px",
            borderRadius: "24px",
            backgroundColor: "#f9f9f9",
            textAlign: "center",
            border: "1px solid #eee",
            transition: "0.3s"
        },
        ctaSection: {
            backgroundColor: "#0d0d0d",
            color: "#fff",
            textAlign: "center",
            padding: "100px 20px"
        },
        btnCta: {
            backgroundColor: "#a8ff35",
            color: "#000",
            padding: "18px 45px",
            fontSize: "18px",
            fontWeight: "700",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            marginTop: "30px",
            boxShadow: "0 10px 20px rgba(168, 255, 53, 0.3)",
            transition: "0.3s"
        }
    };

    return (
        <div style={styles.container}>
            <Navbar />

            {/* 1. Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.heroTitle}>
                    Your Mental Health, <span style={styles.spanNeon}>Our Mission.</span>
                </h1>
                <p style={styles.heroSub}>
                    At MindSpace AI, we bridge the gap between human empathy and artificial intelligence to provide personalized mental wellness support for everyone.
                </p>
            </header>

            {/* 2. Mission Section */}
            <section style={styles.section}>
                <div style={styles.contentSide}>
                    <h2 style={styles.missionTitle}>Helping You Find Peace</h2>
                    <p style={{fontSize: "1.1rem", color: "#555", marginBottom: "20px"}}>
                        Manasik aarogya he fakt "bimari" nahi, tar te jagnyacha ek sakaratmak marg aahe.
                        Aamche AI-powered tools tumchya emotions cha abhyas karun tumhala stress free jagnyasathi madat kartat.
                    </p>
                    <p style={{fontSize: "1rem", color: "#666"}}>
                        MindSpace AI deals with anxiety, stress, and mood tracking while maintaining 100% privacy of your data.
                    </p>
                </div>
                <div style={styles.imageSide}>
                    <img
                        src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1000"
                        alt="Wellness"
                        style={{width: "100%", borderRadius: "30px"}}
                    />
                </div>
            </section>

            {/* 3. Values Grid */}
            <div style={{textAlign: "center", paddingTop: "50px"}}>
                <h2 style={{fontSize: "36px"}}>Our Core Values</h2>
            </div>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <div style={{fontSize: "50px", marginBottom: "20px"}}>🛡️</div>
                    <h3>Privacy First</h3>
                    <p>Tumcha pratyek vichar aani data encrypted aani safe aahe.</p>
                </div>
                <div style={styles.card}>
                    <div style={{fontSize: "50px", marginBottom: "20px"}}>🧠</div>
                    <h3>Smart Insights</h3>
                    <p>AI technology cha vapar karun tumchya mental health che accurate analysis.</p>
                </div>
                <div style={styles.card}>
                    <div style={{fontSize: "50px", marginBottom: "20px"}}>🤝</div>
                    <h3>Empathy</h3>
                    <p>Technology kitihi mothi asli, tari aamcha udesh manuskichi japnyacha aahe.</p>
                </div>
            </div>

            {/* 4. CTA Section */}
            <section style={styles.ctaSection}>
                <h2 style={{fontSize: "40px", fontWeight: "800"}}>Join the Community</h2>
                <p style={{marginTop: "15px", opacity: "0.8"}}>Aata pasunch tumchya manasik swasthya kade ek paaul uchala.</p>
                <button
                    style={styles.btnCta}
                    onClick={() => navigate('/authPage')} // App.js madheel route pramane authPage kela aahe
                    onMouseOver={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.cursor = "pointer";
                    }}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                >
                    GET STARTED NOW →
                </button>
            </section>
        </div>
    );
};

export default About;