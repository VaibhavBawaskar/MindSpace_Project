import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    User, Settings as SettingsIcon, Loader2, Bell, Lock, CreditCard,
    CheckCircle, Globe, Clock, Layout, Trash2, Calendar
} from 'lucide-react';

const SettingPage = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        // Account
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        // Notifications
        emailNotifications: true,
        appointmentReminders: true,
        clientMessages: true,
        systemUpdates: false,
        weeklySummary: true,
        // Preferences
        language: 'English',
        theme: 'Light',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        // Privacy
        twoFactorAuth: false
    });

    const API_URL = `http://127.0.0.1:8000/api/user-settings/`;

    // Fetch Data Function - useCallback वापरल्यामुळे dependency एरर येणार नाही
    const fetchSettings = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setFetching(false);
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Backend कडून आलेला डेटा state मध्ये सेट करणे
            setFormData(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error("Data Load Error:", error.response?.data);
        } finally {
            setFetching(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            // PATCH request द्वारे बदल सेव्ह करणे
            await axios.patch(API_URL, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert("Settings updated successfully! ✅");
        } catch (error) {
            console.error("Update Error:", error.response?.data);
            alert(error.response?.data?.detail || "Update failed! Please check backend.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader2 className="spin-animation" size={40} color="#6366f1" />
            </div>
        );
    }

    return (
        <section id="settings" className="content-section fade-in" style={{ padding: '20px' }}>
            <div className="page-header" style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>Settings</h1>
                <p style={{ color: '#64748b' }}>Manage your account, preferences, and security</p>
            </div>

            <div className="settings-container" style={{ display: 'flex', gap: '30px' }}>
                {/* --- Sidebar Menu --- */}
                <div className="settings-sidebar" style={{ width: '250px' }}>
                    <div className="settings-menu" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button type="button" onClick={() => setActiveTab('account')} style={menuBtnStyle(activeTab === 'account')}><User size={18} /> Account Settings</button>
                        <button type="button" onClick={() => setActiveTab('notifications')} style={menuBtnStyle(activeTab === 'notifications')}><Bell size={18} /> Notifications</button>
                        <button type="button" onClick={() => setActiveTab('privacy')} style={menuBtnStyle(activeTab === 'privacy')}><Lock size={18} /> Privacy & Security</button>
                        <button type="button" onClick={() => setActiveTab('preferences')} style={menuBtnStyle(activeTab === 'preferences')}><SettingsIcon size={18} /> Preferences</button>
                        <button type="button" onClick={() => setActiveTab('billing')} style={menuBtnStyle(activeTab === 'billing')}><CreditCard size={18} /> Billing & Plan</button>
                    </div>
                </div>

                {/* --- Main Content Area --- */}
                <div className="settings-content" style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

                    <form onSubmit={handleSave}>
                        {/* 1. Account Section */}
                        {activeTab === 'account' && (
                            <div className="tab-pane">
                                <h2 style={tabTitleStyle}>Account Settings</h2>
                                <div style={gridStyle}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Full Name</label>
                                        <input type="text" id="fullName" style={inputStyle} value={formData.fullName || ''} onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Email Address</label>
                                        <input type="email" id="email" style={inputStyle} value={formData.email || ''} onChange={handleChange} placeholder="email@example.com" />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Phone Number</label>
                                        <input type="tel" id="phone" style={inputStyle} value={formData.phone || ''} onChange={handleChange} placeholder="+91..." />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Specialization</label>
                                        <select id="specialization" style={inputStyle} value={formData.specialization || ''} onChange={handleChange}>
                                            <option value="">Select Specialization</option>
                                            <option value="Anxiety Disorders">Anxiety Disorders</option>
                                            <option value="Depression">Depression</option>
                                            <option value="Trauma Therapy">Trauma Therapy</option>
                                            <option value="Family Counselling">Family Counselling</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Notifications Section */}
                        {activeTab === 'notifications' && (
                            <div className="tab-pane">
                                <h2 style={tabTitleStyle}>Notification Settings</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {[
                                        { id: 'emailNotifications', title: 'Email Notifications', desc: 'Receive updates via email' },
                                        { id: 'appointmentReminders', title: 'Appointment Reminders', desc: 'Reminders before sessions' },
                                        { id: 'clientMessages', title: 'Client Messages', desc: 'Alerts for new messages' },
                                        { id: 'systemUpdates', title: 'System Updates', desc: 'Maintenance alerts' }
                                    ].map(item => (
                                        <div key={item.id} style={toggleRowStyle}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '15px' }}>{item.title}</h4>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{item.desc}</p>
                                            </div>
                                            <input type="checkbox" id={item.id} checked={formData[item.id] || false} onChange={handleChange} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Privacy & Security Section */}
                        {activeTab === 'privacy' && (
                            <div className="tab-pane">
                                <h2 style={tabTitleStyle}>Privacy & Security</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={actionBoxStyle}>
                                        <div>
                                            <h4 style={{ margin: 0 }}>Two-Factor Authentication</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{formData.twoFactorAuth ? 'Currently Enabled' : 'Add extra layer of security'}</p>
                                        </div>
                                        <button type="button" style={secBtnStyle}>{formData.twoFactorAuth ? 'Disable' : 'Enable'}</button>
                                    </div>
                                    <div style={{ ...actionBoxStyle, borderLeft: '4px solid #ef4444', marginTop: '20px' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: '#ef4444' }}>Delete Account</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Permanently remove all data</p>
                                        </div>
                                        <button type="button" style={{ ...secBtnStyle, color: '#ef4444' }}><Trash2 size={16} /> Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Preferences Section */}
                        {activeTab === 'preferences' && (
                            <div className="tab-pane">
                                <h2 style={tabTitleStyle}>Preferences</h2>
                                <div style={gridStyle}>
                                    <div className="form-group">
                                        <label style={labelStyle}><Globe size={14} /> Language</label>
                                        <select id="language" style={inputStyle} value={formData.language || 'English'} onChange={handleChange}>
                                            <option>English</option><option>Marathi</option><option>Hindi</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}><Clock size={14} /> Timezone</label>
                                        <select id="timezone" style={inputStyle} value={formData.timezone || 'Asia/Kolkata'} onChange={handleChange}>
                                            <option>Asia/Kolkata</option><option>UTC</option><option>EST</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}><Layout size={14} /> Theme</label>
                                        <select id="theme" style={inputStyle} value={formData.theme || 'Light'} onChange={handleChange}>
                                            <option>Light</option><option>Dark</option><option>Auto</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}><Calendar size={14} /> Date Format</label>
                                        <select id="dateFormat" style={inputStyle} value={formData.dateFormat || 'DD/MM/YYYY'} onChange={handleChange}>
                                            <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Billing Section */}
                        {activeTab === 'billing' && (
                            <div className="tab-pane">
                                <h2 style={tabTitleStyle}>Billing & Plan</h2>
                                <div style={planCardStyle}>
                                    <div style={{ flex: 1 }}>
                                        <span style={badgeStyle}>Active</span>
                                        <h3 style={{ margin: '10px 0 5px' }}>Professional Plan</h3>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>₹499/month • Automatic Renewal</p>
                                    </div>
                                    <button type="button" style={secBtnStyle}>Manage</button>
                                </div>
                            </div>
                        )}

                        {/* Global Save Button */}
                        <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                            <button type="submit" style={saveBtnStyle} disabled={loading}>
                                {loading ? <Loader2 size={20} className="spin-animation" /> : <CheckCircle size={20} />}
                                {loading ? 'Saving Changes...' : 'Save All Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>
                {`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin-animation { animation: spin 1s linear infinite; }
                .fade-in { animation: fadeIn 0.5s ease-in; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}
            </style>
        </section>
    );
};

// --- Styles (Objects) ---
const tabTitleStyle = { fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1e293b' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px', transition: 'border 0.2s' };
const menuBtnStyle = (active) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: active ? '#6366f1' : 'transparent', color: active ? 'white' : '#64748b', cursor: 'pointer', fontWeight: '600', width: '100%', transition: '0.3s', textAlign: 'left' });
const saveBtnStyle = { background: '#6366f1', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' };
const toggleRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '12px' };
const actionBoxStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '12px' };
const secBtnStyle = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' };
const planCardStyle = { display: 'flex', alignItems: 'center', padding: '20px', background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '15px' };
const badgeStyle = { background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' };

export default SettingPage;