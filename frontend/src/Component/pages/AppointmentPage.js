import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, MessageSquare, ChevronLeft,
  CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [appointmentData, setAppointmentData] = useState({
    name: '', date: '', time: '', reason: ''
  });

  useEffect(() => {
    const fetchCounsellors = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/counsellors/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
        setErrorMessage("डॉक्टरांची यादी लोड होऊ शकली नाही.");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchCounsellors();
  }, []);

  const timeSlots = [
    { label: "10:00 AM", value: "10:00:00" },
    { label: "11:00 AM", value: "11:00:00" },
    { label: "12:00 PM", value: "12:00:00" },
    { label: "02:00 PM", value: "14:00:00" },
    { label: "05:00 PM", value: "17:00:00" }
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const token = localStorage.getItem('access_token');
    const clientId = localStorage.getItem('user_id') || "CLI-101";

    const payload = {
      client_id: clientId,
      name: appointmentData.name,
      date: appointmentData.date,
      time: appointmentData.time,
      appointment_spec: appointmentData.reason || "Consultation",
      mode: "Audio",
      status: "Pending",
      set_by: "Counselor"
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setBooked(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        throw new Error("माहिती भरताना काहीतरी चूक झाली.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="success-overlay">
        <div className="success-card">
          <CheckCircle2 size={80} className="success-icon" />
          <h1>Booked Successfully!</h1>
          <p>Your appointment has been confirmed. Redirecting to dashboard...</p>
        </div>
        <style>{`
          .success-overlay { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0fdf4; }
          .success-card { text-align: center; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .success-icon { color: #10b981; margin-bottom: 20px; animation: scaleUp 0.5s ease-out; }
          @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="main-card">
        <header className="page-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ChevronLeft size={24} />
          </button>
          <h2>Book Appointment</h2>
        </header>

        {errorMessage && (
          <div className="error-box">
            <AlertCircle size={20} /> <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleBooking} className="form-container">
          <div className="field-group">
            <label><User size={18} /> Choose Specialist</label>
            <select
              required
              className="styled-input"
              value={appointmentData.name}
              onChange={(e) => setAppointmentData({...appointmentData, name: e.target.value})}
              disabled={loadingDoctors}
            >
              <option value="">{loadingDoctors ? "Loading..." : "Select a Doctor"}</option>
              {doctors.map(d => (
                <option key={d.id} value={`${d.first_name} ${d.last_name}`}>
                  Dr. {d.first_name} {d.last_name} {d.specialization ? `(${d.specialization})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label><Calendar size={18} /> Select Date</label>
            <input
              type="date" required className="styled-input"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
            />
          </div>

          <div className="field-group">
            <label><Clock size={18} /> Available Slots</label>
            <div className="slots-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value} type="button"
                  className={`slot-pill ${appointmentData.time === slot.value ? 'selected' : ''}`}
                  onClick={() => setAppointmentData({...appointmentData, time: slot.value})}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label><MessageSquare size={18} /> Reason (Optional)</label>
            <textarea
              className="styled-input text-area"
              placeholder="How can we help you?"
              onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !appointmentData.time || !appointmentData.name || loadingDoctors}
            className="submit-btn"
          >
            {loading ? <Loader2 className="spin" size={22} /> : "Confirm Appointment"}
          </button>
        </form>
      </div>

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .main-card {
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .page-header h2 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0;
        }

        .back-btn {
          border: none;
          background: #f1f5f9;
          padding: 8px;
          border-radius: 12px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .back-btn:hover { background: #e2e8f0; }

        .error-box {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .styled-input {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .styled-input:focus { border-color: #6366f1; }

        .text-area { height: 100px; resize: none; }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }

        .slot-pill {
          padding: 10px;
          border: 2px solid #f1f5f9;
          background: #f8fafc;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .slot-pill:hover { border-color: #cbd5e1; }

        .slot-pill.selected {
          background: #6366f1;
          border-color: #6366f1;
          color: white;
        }

        .submit-btn {
          margin-top: 10px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: #6366f1;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0); } to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .main-card { padding: 20px; border-radius: 0; }
          .page-wrapper { padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default AppointmentPage;