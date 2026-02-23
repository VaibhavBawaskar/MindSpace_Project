import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Calendar, Camera,
  ArrowLeft, Save, Loader2, ShieldCheck
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // सेव्हिंग दरम्यान बटण डिसेबल करण्यासाठी
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    profile_image: null, // फोटोसाठी स्टेट
    date_joined: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        profile_image: data.profile_image || null,
        date_joined: data.date_joined || ''
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  // ✅ डेटाबेसमध्ये सेव्ह करण्याचे लॉजिक
  const handleSave = async () => {
    setSaving(true);
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    // तुमच्या बॅकएंडमध्ये MultiPartParser असल्यामुळे FormData वापरणे बेस्ट आहे
    const dataToSend = new FormData();
    dataToSend.append('first_name', formData.first_name);
    dataToSend.append('last_name', formData.last_name);
    dataToSend.append('email', formData.email);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('location', formData.location);

    // जर युजरने नवीन फाईल निवडली असेल तरच ती पाठवा
    if (formData.profile_image instanceof File) {
      dataToSend.append('profile_image', formData.profile_image);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/profile/${userId}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
          // लक्षात ठेवा: FormData वापरताना Content-Type हेडर मॅन्युअली टाकू नका!
        },
        body: dataToSend
      });

      if (response.ok) {
        alert("Profile updated successfully ✅");
        setIsEditing(false);
        fetchProfileData(); // नवीन डेटा रिफ्रेश करण्यासाठी
      } else {
        const errorData = await response.json();
        alert("Update failed ❌");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loader-screen">
      <Loader2 className="animate-spin" size={48} color="#2563eb" />
      <p>Loading Profile...</p>
    </div>
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <h1>My Profile</h1>
      </header>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="avatar-card shadow-sm">
            <div className="avatar-wrapper">
              {formData.profile_image && typeof formData.profile_image === 'string' ? (
                <img src={formData.profile_image} alt="Avatar" className="avatar-img" />
              ) : formData.profile_image instanceof File ? (
                <img src={URL.createObjectURL(formData.profile_image)} alt="Avatar Preview" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">{formData.first_name?.[0] || 'U'}</div>
              )}

              {isEditing && (
                <label className="camera-btn">
                  <Camera size={16} />
                  <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </label>
              )}
            </div>
            <h2>{formData.first_name} {formData.last_name}</h2>
            <p className="user-role">MindSpace Member</p>
            {formData.date_joined && (
              <p className="join-date"><Calendar size={14}/> Joined {new Date(formData.date_joined).toLocaleDateString()}</p>
            )}
          </div>

          <div className="security-card shadow-sm">
            <h3><ShieldCheck size={18} /> Account Security</h3>
            <button className="change-pass-btn" onClick={() => navigate('/change-password')}>
              Change Password
            </button>
          </div>
        </aside>

        <main className="profile-main shadow-sm">
          <div className="form-header">
            <h3>Personal Information</h3>
            <button
              className={`edit-toggle ${isEditing ? 'active' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <label><User size={14}/> First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="detail-item">
              <label><User size={14}/> Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="detail-item full-width">
              <label><Mail size={14}/> Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="detail-item">
              <label><Phone size={14}/> Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="detail-item">
              <label><MapPin size={14}/> Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} />
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .profile-container { padding: 40px; background: #f8fafc; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .profile-header { max-width: 1000px; margin: 0 auto 30px; display: flex; align-items: center; gap: 20px; }
        .back-btn { background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .profile-content { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 300px 1fr; gap: 30px; }
        .shadow-sm { background: white; border-radius: 20px; border: 1px solid #e2e8f0; padding: 25px; }

        /* Avatar Styles */
        .avatar-wrapper { position: relative; width: 120px; height: 120px; margin: 0 auto 20px; }
        .avatar-placeholder { width: 100%; height: 100%; background: #2563eb; color: white; font-size: 40px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #eff6ff; }
        .camera-btn { position: absolute; bottom: 5px; right: 5px; background: #2563eb; color: white; padding: 8px; border-radius: 50%; cursor: pointer; border: 2px solid white; }

        .avatar-card { text-align: center; }
        .avatar-card h2 { font-size: 20px; margin: 10px 0 5px; }
        .user-role { color: #2563eb; font-weight: 600; font-size: 14px; }
        .join-date { font-size: 12px; color: #94a3b8; display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 10px; }

        .security-card { margin-top: 20px; }
        .change-pass-btn { width: 100%; margin-top: 10px; padding: 10px; border-radius: 10px; border: 1px solid #e2e8f0; background: none; cursor: pointer; font-weight: 600; color: #475569; }

        /* Form Styles */
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .edit-toggle { padding: 8px 16px; border-radius: 8px; border: none; background: #f1f5f9; cursor: pointer; font-weight: 600; }
        .edit-toggle.active { background: #fee2e2; color: #ef4444; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .detail-item.full-width { grid-column: span 2; }
        .detail-item label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
        .detail-item input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f8fafc; outline: none; transition: 0.2s; }
        .detail-item input:focus { border-color: #2563eb; background: white; }
        .detail-item input:disabled { opacity: 0.7; cursor: not-allowed; }

        .form-actions { margin-top: 30px; display: flex; justify-content: flex-end; }
        .save-btn { background: #2563eb; color: white; border: none; padding: 12px 25px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; }
        .save-btn:disabled { background: #94a3b8; }

        @media (max-width: 800px) {
          .profile-content { grid-template-columns: 1fr; }
          .details-grid { grid-template-columns: 1fr; }
          .detail-item.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default Profile;