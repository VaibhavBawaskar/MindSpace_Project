import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Calendar, Award, Hash, MapPin, Printer } from 'lucide-react';

const ScoreCard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const token = localStorage.getItem('access_token');

                if (!userId) {
                    setError("User session not found. Please log in again.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/client-information/?user_id=${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const finalData = Array.isArray(response.data) ? response.data[0] : response.data;

                if (finalData) {
                    setUserData(finalData);
                } else {
                    setError("No assessment data available.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Technical difficulty loading report. Please try again later.");
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <div style={styles.loader}>Generating Report...</div>;
    if (error) return <div style={styles.errorBox}>{error}</div>;

    // Helper to format "Pending" or 0 values
    const formatValue = (val, fallback = "Not Provided") => {
        return (!val || val === "Pending" || val === 0) ? fallback : val;
    };

    return (
        <div style={styles.container}>
            <div style={styles.reportCard}>
                {/* Header */}
                <div style={styles.header}>
                    <Award size={36} color="#fff" />
                    <h2 style={styles.headerTitle}>Mental Health Assessment Report</h2>
                    <p style={styles.headerSubtitle}>Confidential Clinical Analysis</p>
                </div>

                {/* Personal Information Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Patient Information</h3>
                    <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                            <User size={18} style={styles.icon} />
                            <strong>Name:</strong> {formatValue(userData?.first_name)} {userData?.last_name !== "Pending" ? userData?.last_name : ""}
                        </div>
                        <div style={styles.infoItem}>
                            <Hash size={18} style={styles.icon} />
                            <strong>Age:</strong> {formatValue(userData?.age, "N/A")} Years
                        </div>
                        <div style={styles.infoItem}>
                            <Calendar size={18} style={styles.icon} />
                            <strong>Date of Birth:</strong> {formatValue(userData?.dob)}
                        </div>
                        <div style={styles.infoItem}>
                            <MapPin size={18} style={styles.icon} />
                            <strong>Location:</strong> {formatValue(userData?.district)}, {formatValue(userData?.state)}
                        </div>
                    </div>
                </div>

                <hr style={styles.divider} />

                {/* Assessment Result Section */}
                <div style={styles.resultSection}>
                    <h3 style={styles.sectionTitle}>Test Summary</h3>
                    <div style={styles.scoreContainer}>
                        <div style={styles.scoreCircle}>
                            <span style={styles.scoreValue}>{userData?.marks?.Depression || 0}%</span>
                            <span style={styles.scoreLabel}>Severity</span>
                        </div>
                        <div style={styles.resultText}>
                            <p><strong>Assessment Type:</strong> Depression Screening (PHQ-Analytic)</p>
                            <p><strong>Clinical Status:</strong>
                                <span style={{
                                    color: userData?.marks?.Depression > 50 ? '#dc2626' : '#16a34a',
                                    fontWeight: 'bold',
                                    marginLeft: '5px'
                                }}>
                                    {userData?.marks?.Depression > 50 ? "Attention Required" : "Normal / Stable"}
                                </span>
                            </p>
                            <p><strong>Report Generated:</strong> {new Date(userData?.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* Clinical Note */}
                <div style={styles.noteSection}>
                    <p><strong>Clinical Note:</strong> This score represents a digital screening of symptoms based on user-provided responses. It is not a final medical diagnosis.</p>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    This document is digitally generated by MindSpace Wellness Platform.
                </div>

                <button style={styles.printBtn} onClick={() => window.print()}>
                    <Printer size={18} style={{marginRight: '8px'}} /> Download PDF Report
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', padding: '50px 20px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    reportCard: { width: '100%', maxWidth: '650px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    header: { backgroundColor: '#1e40af', color: '#fff', padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    headerTitle: { margin: 0, fontSize: '24px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    headerSubtitle: { margin: '5px 0 0', opacity: 0.8, fontSize: '14px' },
    section: { padding: '30px' },
    sectionTitle: { fontSize: '14px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    infoItem: { display: 'flex', alignItems: 'center', fontSize: '14px', color: '#334155' },
    icon: { marginRight: '10px', color: '#94a3b8' },
    divider: { border: 'none', height: '1px', backgroundColor: '#f1f5f9', margin: '0 30px' },
    resultSection: { padding: '30px' },
    scoreContainer: { display: 'flex', alignItems: 'center', gap: '40px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px' },
    scoreCircle: { width: '110px', height: '110px', borderRadius: '50%', border: '6px solid #e2e8f0', borderTopColor: '#1e40af', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    scoreValue: { fontSize: '28px', fontWeight: '800', color: '#0f172a' },
    scoreLabel: { fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
    resultText: { fontSize: '15px', color: '#334155', lineHeight: '1.8' },
    noteSection: { padding: '0 30px 20px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' },
    footer: { padding: '20px', backgroundColor: '#f8fafc', fontSize: '11px', color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #f1f5f9' },
    printBtn: { width: '100%', padding: '18px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#1e40af', fontWeight: '600' },
    errorBox: { margin: '100px auto', padding: '20px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', maxWidth: '450px', textAlign: 'center' }
};

export default ScoreCard;