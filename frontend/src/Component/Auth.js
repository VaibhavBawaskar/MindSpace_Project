import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const API_URL = "http://127.0.0.1:8000/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? `${API_URL}/login/` : `${API_URL}/signup/`;

    const payload = isLogin
      ? { username: formData.username, password: formData.password }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: "",
          last_name: "",
          country: "",
          bio: "",
          preferred_language: ""
        };

    try {
      const res = await axios.post(endpoint, payload);

      if (isLogin) {
        const token = res.data.token || res.data.access;
        localStorage.setItem('access_token', token);
        const userDisplayName = res.data.username || formData.username;
        localStorage.setItem('username', userDisplayName);
        const userData = res.data.user;
        const userId = userData ? userData.id : (res.data.user_id || res.data.id);
        if (userId) {
          localStorage.setItem('user_id', userId);
        }
        window.dispatchEvent(new Event("storage"));

        if (res.data.first_time) {
          navigate('/select-language');
        } else {
          navigate('/');
        }
      } else {
        alert("Account created successfully! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const backendError = err.response?.data;
      if (typeof backendError === 'object') {
        const firstKey = Object.keys(backendError)[0];
        const errorMsg = Array.isArray(backendError[firstKey]) ? backendError[firstKey][0] : backendError[firstKey];
        setError(`${firstKey}: ${errorMsg}`);
      } else {
        setError("Error: Backend server is not responding.");
      }
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f9f8', fontFamily: 'Inter, sans-serif', padding: '20px' },
    card: { width: '100%', maxWidth: '1100px', display: 'flex', background: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', flexWrap: 'wrap' },
    formDiv: { flex: 1, padding: '40px', minWidth: '320px' },
    input: { width: '100%', padding: '12px 16px', margin: '8px 0 20px', borderRadius: '12px', border: '1px solid #a7c7e7', outline: 'none', fontSize: '16px' },
    btn: { width: '100%', padding: '14px', background: loading ? '#ccc' : '#8fb9a8', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s', fontSize: '16px', marginTop: '10px' },
    toggleBtn: { color: '#8fb9a8', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none', marginLeft: '5px', fontSize: '14px' },
    forgotBtn: { background: 'none', border: 'none', color: '#8fb9a8', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: 0 }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.formDiv}>
          <h1 style={{fontSize: '32px', marginBottom: '8px', color: '#333'}}>{isLogin ? "Welcome Back" : "Register"}</h1>
          <p style={{color: '#666', marginBottom: '32px'}}>Enter details to access your healing space.</p>

          {error && <div style={{color: '#d32f2f', fontSize: '14px', marginBottom: '15px', padding: '12px', background: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #d32f2f'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={{fontWeight: '600', color: '#444'}}>Username</label>
            <input type="text" name="username" style={s.input} placeholder="Enter username" onChange={handleChange} required />

            {!isLogin && (
              <>
                <label style={{fontWeight: '600', color: '#444'}}>Email Address</label>
                <input type="email" name="email" style={s.input} placeholder="Enter email" onChange={handleChange} required />
              </>
            )}

            <label style={{fontWeight: '600', color: '#444'}}>Password</label>
            <div style={{position: 'relative'}}>
              <input type={showPassword ? "text" : "password"} name="password" style={s.input} placeholder="••••••••" onChange={handleChange} required />
              <span onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', color: '#8fb9a8', fontSize: '14px', fontWeight: 'bold'}}>
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </div>

            {/* --- Forgot Password Link --- */}
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  style={s.forgotBtn}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </button>
          </form>

          <p style={{marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666'}}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} style={s.toggleBtn}>
              {isLogin ? "Create Account" : "Login Instead"}
            </button>
          </p>
        </div>

        <div style={{flex: 1.2, background: '#e0ece8', minWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://media.istockphoto.com/id/1363774646/vector/mental-health.jpg?s=612x612&w=0&k=20&c=tez61I2L6Dp9WGPS2qLHJ9G-9sDRM8Uw3mJJEj1NqFE=" alt="Hero" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;