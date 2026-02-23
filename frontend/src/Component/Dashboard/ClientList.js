import React, { useState, useEffect } from 'react';
import {
  Search, Mail, Loader2, MoreVertical, Calendar,
  UserCheck, Clock, Plus, Users, CheckCircle, Clock3, ChevronDown
} from 'lucide-react';

const ClientList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-az");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin-users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sorting आणि Filtering Logic (Warnings fixed)
  const filteredUsers = users
    .filter(u =>
      (u.first_name || u.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name-az") {
        return (a.first_name || a.username || "").localeCompare(b.first_name || b.username || "");
      }
      if (sortBy === "recent") {
        return b.id - a.id;
      }
      return 0;
    });

  const styles = {
    container: { padding: '30px', backgroundColor: '#f8f9fd', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: '#fff', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    cardIndigo: { background: '#4f46e5', color: '#fff' },
    tableCard: { background: '#fff', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', overflow: 'hidden' },
    header: { padding: '30px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
    searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchInput: { padding: '12px 16px 12px 45px', borderRadius: '14px', border: '1px solid #e5e7eb', outline: 'none', width: '280px', fontSize: '14px' },
    selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    select: { appearance: 'none', padding: '12px 40px 12px 15px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer', outline: 'none' },
    addButton: { backgroundColor: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px 24px', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px', borderBottom: '1px solid #f9fafb' },
    td: { padding: '20px 24px', borderBottom: '1px solid #f9fafb', fontSize: '14px' },
    avatar: { width: '45px', height: '45px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5, #9333ea)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', marginRight: '15px' },
    badge: (status) => ({
      padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase',
      backgroundColor: status === 'Confirmed' ? '#ecfdf5' : '#fff7ed',
      color: status === 'Confirmed' ? '#065f46' : '#9a3412',
    })
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Loader2 size={48} color="#4f46e5" className="animate-spin" />
      <p style={{ marginTop: '15px', color: '#666', fontWeight: '600' }}>माहिती लोड होत आहे...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* 1. Stats Bar */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.cardIndigo }}>
          <div><p style={{ margin: 0, opacity: 0.8 }}>Total Clients</p><h3 style={{ margin: '5px 0 0 0', fontSize: '28px' }}>{users.length}</h3></div>
          <Users size={32} strokeWidth={1.5} />
        </div>
        <div style={styles.statCard}>
          <div><p style={{ color: '#666', margin: 0 }}>Confirmed</p><h3 style={{ margin: '5px 0 0 0', fontSize: '28px' }}>{users.filter(u => u.status === 'Confirmed').length}</h3></div>
          <CheckCircle size={32} color="#10b981" />
        </div>
        <div style={styles.statCard}>
          <div><p style={{ color: '#666', margin: 0 }}>Pending</p><h3 style={{ margin: '5px 0 0 0', fontSize: '28px' }}>{users.filter(u => u.status === 'Pending').length}</h3></div>
          <Clock3 size={32} color="#f97316" />
        </div>
      </div>

      {/* 2. Main Table Card */}
      <div style={styles.tableCard}>
        <div style={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>Clients Directory</h1>
            <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '13px' }}>युजर्सची यादी आणि सद्यस्थिती</p>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={styles.searchWrapper}>
              <Search size={18} color="#999" style={{ position: 'absolute', left: '15px' }} />
              <input
                style={styles.searchInput}
                placeholder="नाव किंवा ईमेल शोधा..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sorting Dropdown - setSortBy वापरला आहे */}
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-az">Sort: A-Z</option>
                <option value="recent">Sort: Recent</option>
              </select>
              <ChevronDown size={16} color="#999" style={{ position: 'absolute', right: '15px' }} />
            </div>

            <button style={styles.addButton}>
              <Plus size={18} /> Add Client
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Client Name</th>
                <th style={styles.th}>Email Address</th>
                <th style={styles.th}>Counsellor</th>
                <th style={styles.th}>Session Info</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={styles.avatar}>{u.first_name?.[0] || u.username?.[0] || 'U'}</div>
                      <div>
                        <div style={{ fontWeight: '800', color: '#111' }}>{u.first_name || u.username}</div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold' }}>ID: MS-{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                      <Mail size={14} color="#ccc" /> {u.email}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#374151' }}>
                      <UserCheck size={14} color="#10b981" /> {u.counsellor || 'Not Assigned'}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {u.last_session || 'No data'}</div>
                      <div style={{ color: '#4f46e5', fontWeight: 'bold', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Next: {u.next_session || 'TBD'}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(u.status)}>{u.status || 'Pending'}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <MoreVertical size={18} color="#ccc" cursor="pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>काहीही सापडले नाही.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList;