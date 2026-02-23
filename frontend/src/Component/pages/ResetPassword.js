import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  // तुझ्या बॅकएंड URLs मध्ये 'uidb64' हे नाव असू शकते,
  // जर App.js मध्ये :uid वापरले असेल तर इथे 'uid' लिहा.
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // बॅकएंड पाथला रिक्वेस्ट पाठवली
      const res = await axios.post(`http://127.0.0.1:8000/api/reset-password-confirm/${uid}/${token}/`, {
        new_password: newPassword
      });

      // इथे 'res' चा वापर केल्यामुळे वॉर्निंग निघून जाईल ✅
      alert(res.data.message || "Password updated successfully!");
      navigate('/auth');

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Invalid or expired link.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f4f3', fontFamily: 'Inter, sans-serif' },
    card: { background: '#fff', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '12px', margin: '20px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '16px' },
    button: (isLoading) => ({
      width: '100%', padding: '12px', background: isLoading ? '#ccc' : '#8fb9a8', color: '#fff',
      border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold'
    })
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h3 style={{ color: '#333' }}>Set New Password</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>तुमचा नवीन पासवर्ड खाली टाइप करा.</p>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            style={s.input}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            style={s.button(loading)}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;