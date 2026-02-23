import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Eye,
  Moon,
  Sun,
  Globe,
  ArrowLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsOptions = [
    {
      title: "Account",
      items: [
        { icon: <User size={20} />, label: "Edit Profile", action: () => navigate('/profile'), color: "#2563eb" },
        { icon: <Lock size={20} />, label: "Change Password", action: () => navigate('/change-password'), color: "#7c3aed" },
        { icon: <Globe size={20} />, label: "Language Preferences", action: () => {}, color: "#ea580c" }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: <Bell size={20} />,
          label: "Push Notifications",
          isToggle: true,
          value: notifications,
          onToggle: () => setNotifications(!notifications),
          color: "#db2777"
        },
        {
          icon: darkMode ? <Moon size={20} /> : <Sun size={20} />,
          label: "Dark Mode",
          isToggle: true,
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode),
          color: "#64748b"
        }
      ]
    },
    {
      title: "Privacy & Support",
      items: [
        { icon: <ShieldCheck size={20} />, label: "Privacy Policy", action: () => {}, color: "#16a34a" },
        { icon: <Eye size={20} />, label: "Terms of Service", action: () => {}, color: "#0891b2" }
      ]
    }
  ];

  return (
    <div className={`settings-container ${darkMode ? 'dark' : ''}`}>
      <header className="settings-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1><SettingsIcon size={24} /> Settings</h1>
      </header>

      <main className="settings-content">
        {settingsOptions.map((section, idx) => (
          <div key={idx} className="settings-section">
            <h2 className="section-title">{section.title}</h2>
            <div className="options-group shadow-sm">
              {section.items.map((item, i) => (
                <div key={i} className="option-item" onClick={item.action}>
                  <div className="option-left">
                    <div className="icon-box" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.isToggle ? (
                    <label className="switch">
                      <input type="checkbox" checked={item.value} onChange={item.onToggle} />
                      <span className="slider round"></span>
                    </label>
                  ) : (
                    <ChevronRight size={18} className="chevron" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="logout-full-btn" onClick={() => { localStorage.clear(); navigate('/ '); }}>
          <LogOut size={20} /> Log Out from Device
        </button>
      </main>

      <style>{`
        .settings-container { padding: 40px; background: #f8fafc; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s; }
        .settings-container.dark { background: #0f172a; color: white; }

        .settings-header { max-width: 700px; margin: 0 auto 30px; }
        .back-btn { background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; font-weight: 500; }
        .settings-header h1 { font-size: 28px; display: flex; align-items: center; gap: 12px; margin: 0; color: #0f172a; }
        .dark .settings-header h1 { color: white; }

        .settings-content { max-width: 700px; margin: 0 auto; }
        .settings-section { margin-bottom: 30px; }
        .section-title { font-size: 14px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; margin-left: 5px; }

        .options-group { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .dark .options-group { background: #1e293b; border-color: #334155; }

        .option-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #f1f5f9; }
        .dark .option-item { border-bottom: 1px solid #334155; }
        .option-item:last-child { border-bottom: none; }
        .option-item:hover { background: #f8fafc; }
        .dark .option-item:hover { background: #334155; }

        .option-left { display: flex; align-items: center; gap: 15px; }
        .icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .option-left span { font-weight: 500; color: #1e293b; }
        .dark .option-left span { color: #e2e8f0; }
        .chevron { color: #94a3b8; }

        /* Logout Button */
        .logout-full-btn { width: 100%; margin-top: 10px; padding: 16px; border-radius: 16px; border: 1px solid #fee2e2; background: #fff1f1; color: #ef4444; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; }
        .logout-full-btn:hover { background: #fecaca; }

        /* Toggle Switch Styling */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #2563eb; }
        input:checked + .slider:before { transform: translateX(20px); }

        @media (max-width: 600px) { .settings-container { padding: 20px; } }
      `}</style>
    </div>
  );
};

export default Settings;