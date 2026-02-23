import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Search,
  AlertCircle, Loader2, Check, X, MessageSquare
} from 'lucide-react';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/appointments/');
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const remark = remarks[id] || "";
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, appointment_spec: remark })
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const filteredData = appointments.filter(a => {
    const matchesFilter = filter === "All" || a.status === filter;
    const matchesSearch = (a.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const styles = {
    container: { padding: '40px', backgroundColor: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    headerSection: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', width: '350px' },
    tabButton: (isActive) => ({
      padding: '10px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '600',
      backgroundColor: isActive ? '#4F46E5' : 'transparent', color: isActive ? '#fff' : '#6B7280',
      transition: 'all 0.3s ease'
    }),
    card: {
      backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    },
    statusBadge: (status) => {
      const colors = {
        Confirmed: { bg: '#DCFCE7', text: '#15803D' },
        Pending: { bg: '#FEF9C3', text: '#A16207' },
        Cancelled: { bg: '#FEE2E2', text: '#B91C1C' }
      };
      const style = colors[status] || colors.Pending;
      return {
        padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
        backgroundColor: style.bg, color: style.text, display: 'flex', alignItems: 'center', gap: '6px'
      };
    },
    actionBtn: (type) => ({
      flex: 1, padding: '12px', borderRadius: '14px', cursor: 'pointer',
      fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      transition: 'transform 0.2s',
      backgroundColor: type === 'approve' ? '#4F46E5' : '#fff',
      color: type === 'approve' ? '#fff' : '#EF4444',
      border: type === 'reject' ? '1.5px solid #FEE2E2' : 'none'
    })
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F3F4F6' }}>
        <Loader2 className="animate-spin" size={48} color="#4F46E5" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px', margin: 0 }}>Appointments</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Manage patient bookings efficiently</p>
        </div>
        <div style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <input
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
            placeholder="Search by patient name..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', backgroundColor: '#E5E7EB', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
        {["All", "Confirmed", "Pending", "Cancelled"].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={styles.tabButton(filter === tab)}>{tab}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredData.map((app) => (
          <div key={app.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={styles.statusBadge(app.status)}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                {app.status}
              </div>
              <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>#{app.id}</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '8px', margin: 0 }}>{app.name}</h3>
              <div style={{ display: 'flex', gap: '16px', color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16}/> {app.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {app.time}</div>
              </div>
            </div>

            {app.appointment_spec && (
              <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MessageSquare size={14} color="#6366F1" />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Patient Note</span>
                </div>
                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>{app.appointment_spec}</p>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <input
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Add medical remark..."
                value={remarks[app.id] || ""}
                onChange={(e) => setRemarks({ ...remarks, [app.id]: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleStatusUpdate(app.id, 'Confirmed')} style={styles.actionBtn('approve')}>
                <Check size={18}/> Confirm
              </button>
              <button onClick={() => handleStatusUpdate(app.id, 'Cancelled')} style={styles.actionBtn('reject')}>
                <X size={18}/> Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#9CA3AF' }}>
          <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ fontSize: '18px' }}>No appointments found.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;