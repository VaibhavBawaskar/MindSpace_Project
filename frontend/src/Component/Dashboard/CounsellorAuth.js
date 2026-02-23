import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Briefcase } from 'lucide-react';

const CounsellorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    specialization: ''
  });

  const specializationOptions = [
    "Clinical Psychologist",
    "Counselling Psychologist",
    "Child & Adolescent Specialist",
    "Marriage & Family Therapist",
    "Substance Abuse Counsellor",
    "Educational Psychologist",
    "Trauma Specialist",
    "General Mental Health Expert"
  ];

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? 'admin-login/' : 'counsellor-signup/';
    const requestData = isLogin
      ? { username: formData.username, password: formData.password }
      : {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          specialization: formData.specialization
        };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // 1. Save Tokens
          const token = data.access || data.token;
          if (token) localStorage.setItem('access_token', token);

          // 2. Extract User Data correctly from backend response
          // 'data.user' किंवा 'data.admin' तुमच्या बॅकएंडच्या की (key) नुसार बदला
          const userData = data.user || data.admin || data;

          localStorage.setItem('user_id', userData.id);
          localStorage.setItem('user_role', 'counsellor');

          // ✅ 3. हा भाग डॅशबोर्डवर प्रोफाईल दाखवण्यासाठी अत्यंत महत्त्वाचा आहे
          localStorage.setItem('admin_user', JSON.stringify({
            username: userData.username || formData.username,
            first_name: userData.first_name || userData.name || "Counsellor",
            profile_image: userData.profile_image || null,
            email: userData.email
          }));

          alert("Login successful! ✅");
          window.location.href = '/mindspacedashboard';
        } else {
          alert("Counsellor account created successfully! 🎉 Please login now.");
          setIsLogin(true);
          setFormData({ ...formData, password: '', username: '', email: '', name: '', specialization: '' });
        }
      } else {
        let rawError = data.error || data.detail || "Check your details.";
        setError(typeof rawError === 'object' ? JSON.stringify(rawError) : rawError);
      }
    } catch (err) {
      setError("Cannot connect to server. Ensure Django is running.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '420px', border: '1px solid #f1f5f9' },
    toggle: { display: 'flex', marginBottom: '25px', background: '#f1f5f9', borderRadius: '14px', padding: '5px' },
    toggleBtn: (active) => ({ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: '0.3s', backgroundColor: active ? '#fff' : 'transparent', color: active ? '#6366f1' : '#64748b' }),
    inputGroup: { marginBottom: '18px', position: 'relative' },
    label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#1e293b' },
    input: { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', boxSizing: 'border-box', fontSize: '14px' },
    icon: { position: 'absolute', left: '15px', top: '38px', color: '#94a3b8', zIndex: 1 },
    button: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a' }}>MindSpace</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Counsellor Portal</p>
        </div>

        <div style={styles.toggle}>
          <button style={styles.toggleBtn(isLogin)} onClick={() => setIsLogin(true)}>Login</button>
          <button style={styles.toggleBtn(!isLogin)} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', border: '1px solid #fee2e2' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <User size={18} style={styles.icon} />
            <input
              type="text"
              placeholder="Enter username"
              style={styles.input}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <User size={18} style={styles.icon} />
                <input
                  type="text"
                  placeholder="e.g. Dr. Sameer"
                  style={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Specialization</label>
                <Briefcase size={18} style={styles.icon} />
                <select
                  style={{ ...styles.input, backgroundColor: '#fff', cursor: 'pointer', appearance: 'auto' }}
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                >
                  <option value="" disabled>Select specialization</option>
                  {specializationOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  placeholder="email@example.com"
                  style={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <Lock size={18} style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', color: '#94a3b8'}}
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounsellorAuth;