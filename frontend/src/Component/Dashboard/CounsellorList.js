import React, { useState, useEffect } from 'react';
import {
  Users, // आता वापरला आहे
  UserPlus, Search, Mail,
  Phone, Star, MoreVertical, // आता वापरला आहे
  Loader2, Trash2, Edit, Filter
} from 'lucide-react';

const CounsellorList = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/counsellors/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCounsellors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = counsellors.filter(c =>
    (c.name || c.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    page: { padding: '30px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    topSection: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' },
    searchWrapper: { display: 'flex', gap: '10px', alignItems: 'center' },
    input: { padding: '10px 15px', borderRadius: '10px', border: '1px solid #E2E8F0', width: '300px', outline: 'none' },
    tableCard: { backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#F8FAFC', padding: '15px', color: '#64748B', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' },
    td: { padding: '15px', borderBottom: '1px solid #F1F5F9', color: '#1E293B', fontSize: '14px' },
    avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' },
    status: { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#DCFCE7', color: '#15803D' },
    actionBtn: { border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', marginRight: '10px', display: 'inline-flex', alignItems: 'center' },
    addBtn: { backgroundColor: '#6366F1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
  };

  if (loading) return (
    <div style={{padding: '100px', textAlign: 'center'}}>
      <Loader2 className="animate-spin" size={40} color="#6366F1" style={{margin: '0 auto'}} />
      <p style={{marginTop: '15px', color: '#64748B'}}>माहिती लोड होत आहे...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.topSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Users आयकॉनचा वापर */}
          <div style={{ backgroundColor: '#EEF2FF', padding: '10px', borderRadius: '12px' }}>
            <Users size={24} color="#6366F1" />
          </div>
          <div>
            <h2 style={{margin: 0, color: '#1E293B'}}>Counsellors Management</h2>
            <p style={{color: '#64748B', fontSize: '14px', margin: 0}}>तुमच्या सर्व प्रोफेशनल टीमची यादी आणि मॅनेजमेंट</p>
          </div>
        </div>
        <button style={styles.addBtn}><UserPlus size={18} /> Add New Counsellor</button>
      </div>

      <div style={styles.tableCard}>
        <div style={{padding: '20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between'}}>
           <div style={styles.searchWrapper}>
              <Search size={18} color="#94A3B8" />
              <input
                style={styles.input}
                placeholder="नाव किंवा ईमेलने शोधा..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button style={{...styles.actionBtn, border: '1px solid #E2E8F0', padding: '5px 15px', borderRadius: '8px', gap: '5px', color: '#1E293B', fontWeight: '600'}}>
             <Filter size={16}/> Filter
           </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Counsellor</th>
              <th style={styles.th}>Specialization</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={styles.avatar}>{c.name ? c.name[0].toUpperCase() : 'C'}</div>
                    <span style={{fontWeight: '700'}}>{c.name || c.username}</span>
                  </div>
                </td>
                <td style={styles.td}>{c.specialization || 'Mental Health'}</td>
                <td style={styles.td}>
                  <div style={{fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px'}}>
                    <Mail size={12} color="#64748B"/> {c.email}
                  </div>
                  <div style={{fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <Phone size={12} color="#64748B"/> {c.phone || 'N/A'}
                  </div>
                </td>
                <td style={styles.td}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 'bold'}}>
                     <Star size={14} fill="#F59E0B"/> {c.rating || '4.5'}
                   </div>
                </td>
                <td style={styles.td}><span style={styles.status}>Active</span></td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} title="Edit"><Edit size={16}/></button>
                  <button style={{...styles.actionBtn, color: '#EF4444'}} title="Delete"><Trash2 size={16}/></button>
                  {/* MoreVertical आयकॉनचा वापर */}
                  <button style={styles.actionBtn} title="More"><MoreVertical size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div style={{padding: '40px', textAlign: 'center', color: '#64748B'}}>
            कोणताही डेटा सापडला नाही.
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorList;