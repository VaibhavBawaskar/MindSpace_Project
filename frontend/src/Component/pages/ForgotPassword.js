import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSendLink = async (e) => {
    e.preventDefault();

    // बेसिक व्हॅलिडेशन
    if (!email) {
      setMessage({ type: "error", text: "कृपया तुमचा ईमेल टाका." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // बॅकएंडमधील ForgotPasswordView ला हिट करतो
      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password/", {
        email: email
      });

      // सक्सेस मेसेज
      setMessage({
        type: "success",
        text: res.data.message || "The reset link has been sent to your email. Please check your inbox.!"
      });

      // युजरला २ सेकंद मेसेज दाखवून बॅक टू लॉगिन पाठवू शकता (पर्यायी)
      // setTimeout(() => navigate('/auth'), 5000);

    } catch (err) {
      // एरर हँडलिंग
      const errorMsg = err.response?.data?.error || "No account found with this email.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f3', fontFamily: 'Inter, sans-serif' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    input: { width: '100%', padding: '14px', margin: '20px 0', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '16px', outline: 'none', transition: '0.3s', boxSizing: 'border-box' },
    button: { width: '100%', padding: '14px', backgroundColor: '#8fb9a8', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
    msgBox: (type) => ({
      padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
      backgroundColor: type === 'error' ? '#ffebee' : '#e8f5e9',
      color: type === 'error' ? '#d32f2f' : '#2e7d32',
      border: `1px solid ${type === 'error' ? '#ffcdd2' : '#c8e6c9'}`
    })
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
        <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>Forgot Password?</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>

        </p>

        {message.text && (
          <div style={s.msgBox(message.type)}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSendLink}>
          <input
            type="email"
            placeholder="Enter Your Email"
            style={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ ...s.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => navigate('/authpage')}
          style={{ background: 'none', border: 'none', color: '#8fb9a8', marginTop: '20px', cursor: 'pointer', fontWeight: '600' }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;