import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

const SelectLanguage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [selectedLang, setSelectedLang] = useState(
        localStorage.getItem('user_language') || null
    );
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setStatusMsg("⚠️ User ID missing. Please login again.");
        }
    }, []);

    const languages = [
        { id: 'en', name: 'English', native: 'English' },
        { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { id: 'mr', name: 'Marathi', native: 'मराठी' },
        { id: 'bn', name: 'Bengali', native: 'বাংলা' },
        { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
        { id: 'te', name: 'Telugu', native: 'తెలుగు' },
        { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
        { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
    ];

    const handleContinue = async () => {

        if (!selectedLang) {
            setStatusMsg("❌ Please select a language first!");
            return;
        }

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setStatusMsg("❌ User ID not found.");
            return;
        }

        setLoading(true);
        setStatusMsg("⏳ Saving your preference...");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/save-language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    language: selectedLang
                }),
            });

            const data = await response.json();

            if (response.ok) {

                // ✅ Change language instantly
                i18n.changeLanguage(selectedLang);

                // ✅ Save to localStorage
                localStorage.setItem('user_language', selectedLang);

                setStatusMsg("✅ Language saved successfully!");

                setTimeout(() => {
                    navigate('/clientInformation');
                }, 1200);

            } else {
                setStatusMsg("❌ Server error occurred.");
                console.error(data);
            }

        } catch (error) {
            setStatusMsg("❌ Connection failed. Check backend.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#0d0d0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        },
        content: {
            maxWidth: '800px',
            width: '100%',
            textAlign: 'center'
        },
        title: {
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '10px'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px',
            margin: '40px 0'
        },
        card: (id) => ({
            backgroundColor: selectedLang === id ? 'rgba(168, 255, 53, 0.1)' : '#1a1a1a',
            border: selectedLang === id ? '2px solid #a8ff35' : '2px solid #333',
            borderRadius: '16px',
            padding: '25px 20px',
            cursor: 'pointer',
            transition: '0.3s',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color: '#fff'
        }),
        btnContinue: {
            backgroundColor: selectedLang ? '#a8ff35' : '#333',
            color: selectedLang ? '#000' : '#888',
            padding: '16px 80px',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: '700',
            border: 'none',
            cursor: selectedLang && !loading ? 'pointer' : 'not-allowed'
        },
        msgDisplay: {
            marginTop: '25px',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: statusMsg.includes('✅') ? '#a8ff35' : '#ff4d4d'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>{t("choose_language")}</h1>
                <p style={{ color: '#9ca3af' }}>
                    {t("select_continue")}
                </p>

                <div style={styles.grid}>
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            style={styles.card(lang.id)}
                            onClick={() => {
                                setSelectedLang(lang.id);
                                setStatusMsg("");
                            }}
                        >
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>
                                {lang.name}
                            </span>
                            <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                                {lang.native}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    style={styles.btnContinue}
                    onClick={handleContinue}
                    disabled={loading || !selectedLang}
                >
                    {loading ? t("saving") : t("continue")}
                </button>

                {statusMsg && (
                    <div style={styles.msgDisplay}>{statusMsg}</div>
                )}
            </div>
        </div>
    );
};

export default SelectLanguage;