import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2
} from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // १. पासवर्ड मॅच होतोय का तपासणे
    if (formData.new_password !== formData.confirm_password) {
      alert("New passwords do not match! ❌");
      return;
    }

    setLoading(true);

    // २. localStorage मधून डेटा मिळवणे
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    // ३. जर युजर आयडी नसेल तर एरर दाखवणे
    if (!userId) {
      alert("User session not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      // ✅ तुमच्या मागणीनुसार पाथमध्ये userId जोडला आहे
      const response = await fetch(`http://127.0.0.1:8000/api/change-password/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        }),
      });

      // रिस्पॉन्स JSON आहे की नाही हे तपासणे (404 टाळण्यासाठी)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();

        if (response.ok) {
          alert("Password changed successfully! ✅");
          navigate('/profile');
        } else {
          alert(data.error || data.detail || "Failed to change password. ❌");
        }
      } else {
        alert("Server Error: Please check if the URL/ID is correct. ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-container">
      <header className="password-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} /> Back to Profile
        </button>
      </header>

      <div className="password-card shadow-sm">
        <div className="icon-circle">
          <ShieldCheck size={32} color="#2563eb" />
        </div>
        <h2>Update Password</h2>
        <p>Keep your account secure by using a strong password.</p>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <label>Current Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="old_password"
                placeholder="Enter current password"
                value={formData.old_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="new_password"
                placeholder="Create new password"
                value={formData.new_password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <CheckCircle2 size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm new password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
          </button>
        </form>
      </div>

      <style>{`
        .password-container { min-height: 100vh; background: #f8fafc; padding: 40px 20px; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; align-items: center; }
        .password-header { width: 100%; max-width: 450px; margin-bottom: 20px; }
        .back-btn { background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .password-card { background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; width: 100%; max-width: 450px; text-align: center; }
        .icon-circle { width: 64px; height: 64px; background: #eff6ff; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .password-card h2 { margin: 0 0 10px; font-size: 24px; color: #0f172a; }
        .password-card p { color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 30px; }
        .password-form { text-align: left; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 14px; color: #94a3b8; }
        .input-wrapper input { width: 100%; padding: 12px 14px 12px 42px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; transition: 0.2s; background: #fcfdfe; }
        .input-wrapper input:focus { outline: none; border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .eye-btn { position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 5px; }
        .submit-btn { width: 100%; background: #2563eb; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 10px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .submit-btn:hover { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 480px) { .password-card { padding: 30px 20px; } }
      `}</style>
    </div>
  );
};

export default ChangePassword;