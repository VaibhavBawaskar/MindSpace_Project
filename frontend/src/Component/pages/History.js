import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Calendar,
  ChevronRight,
  Search,
  ArrowLeft,
  Loader2,
  FileText,
  Clock,
  User,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assessments');
  const [testHistory, setTestHistory] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllHistory = useCallback(async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!userId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // ✅ बॅकएंडला युजर आयडी फिल्टर म्हणून पाठवत आहोत
      const [testRes, appRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/client-information/?user_id=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://127.0.0.1:8000/api/appointments/?user=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const testData = await testRes.json();
      const appData = await appRes.json();

      // डेटा व्यवस्थित सेट करणे
      setTestHistory(Array.isArray(testData) ? testData : (testData.id ? [testData] : []));
      setAppointmentHistory(Array.isArray(appData) ? appData : []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHistory();
  }, [fetchAllHistory]);

  if (loading) return (
    <div className="loader-screen">
      <div className="loader-content">
        <Loader2 className="spin" size={40} color="#6366f1" />
        <p>Loading History...</p>
      </div>
    </div>
  );

  return (
    <div className="history-page">
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>

      <div className="history-wrapper">
        <header className="page-header">
          <div className="nav-row">
            <button className="icon-btn-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
            </button>
            <div className="title-area">
              <h1>Activity History</h1>
              <p>Keep track of your previous tests and sessions.</p>
            </div>
          </div>

          <div className="controls-row">
            <div className="tab-switcher">
              <button
                className={`tab-item ${activeTab === 'assessments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('assessments'); setSearchTerm(""); }}
              >
                <FileText size={16} /> Assessments
              </button>
              <button
                className={`tab-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('appointments'); setSearchTerm(""); }}
              >
                <Calendar size={16} /> Appointments
              </button>
            </div>

            <div className="search-field">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={activeTab === 'assessments' ? "Search Test..." : "Search Doctor..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="content-area">
          {activeTab === 'assessments' ? (
            <div className="history-list">
              {testHistory.length > 0 && testHistory.some(entry => entry.marks) ? (
                testHistory.map((entry, index) =>
                  entry.marks && Object.entries(entry.marks)
                    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(([testName, score], i) => (
                      <div key={`test-${index}-${i}`} className="glass-card" onClick={() => navigate('/assessment-result')}>
                        <div className="card-icon assessment-icon"><LayoutGrid size={22} /></div>
                        <div className="card-info">
                          <h3>{testName} Test</h3>
                          <div className="meta-info">
                            {/* ✅ डेटाबेसमधील खरी तारीख दाखवण्यासाठी entry.created_at वापरा */}
                            <span><Calendar size={12} /> {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</span>
                            <span className="dot">•</span>
                            <span className="success-text">Completed</span>
                          </div>
                        </div>
                        <div className="card-result">
                          <div className="score-badge">
                            <span className="score-val">{score}%</span>
                            <span className="score-lab">Score</span>
                          </div>
                          <ChevronRight size={18} className="arrow" />
                        </div>
                      </div>
                    ))
                )
              ) : <EmptyState message="No assessments found" />}
            </div>
          ) : (
            <div className="history-list">
              {appointmentHistory.filter(app => app.name?.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                appointmentHistory
                  .filter(app => app.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((app, index) => (
                    <div key={`app-${index}`} className="glass-card no-click">
                      <div className="card-icon appointment-icon"><User size={22} /></div>
                      <div className="card-info">
                        <h3>{app.name}</h3>
                        <div className="meta-info">
                          <span><Clock size={12} /> {app.time}</span>
                          <span className="dot">•</span>
                          <span>{app.date}</span>
                        </div>
                        <div className={`status-pill ${(app.status || 'pending').toLowerCase()}`}>
                          {app.status || 'Pending'}
                        </div>
                      </div>
                      <div className="card-result">
                        <CheckCircle2 size={24} className={app.status === 'Completed' ? 'done' : 'pending-icon'} />
                      </div>
                    </div>
                  ))
              ) : <EmptyState message="No appointments found" />}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .history-page { min-height: 100vh; background: #f4f7fa; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow-x: hidden; padding: 40px 20px; }
        .bg-decoration .circle { position: fixed; border-radius: 50%; filter: blur(80px); z-index: 0; opacity: 0.5; }
        .circle-1 { width: 300px; height: 300px; background: #cbd5e1; top: -50px; right: -50px; }
        .circle-2 { width: 250px; height: 250px; background: #94a3b8; bottom: -50px; left: -50px; }
        .history-wrapper { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }
        .page-header { margin-bottom: 30px; }
        .nav-row { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
        .icon-btn-back { width: 45px; height: 45px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; color: #64748b; }
        .icon-btn-back:hover { background: #f8fafc; color: #1e293b; transform: translateX(-3px); }
        .title-area h1 { font-size: 28px; font-weight: 800; color: #1e293b; margin: 0; }
        .title-area p { font-size: 14px; color: #64748b; margin: 5px 0 0; }
        .controls-row { display: flex; flex-direction: column; gap: 15px; }
        .tab-switcher { display: flex; background: #e2e8f0; padding: 6px; border-radius: 14px; }
        .tab-item { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; color: #64748b; transition: 0.3s; background: transparent; }
        .tab-item.active { background: white; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .search-field { position: relative; background: white; border: 1px solid #e2e8f0; border-radius: 14px; display: flex; align-items: center; padding: 0 15px; }
        .search-icon { color: #94a3b8; }
        .search-field input { border: none; padding: 14px; width: 100%; outline: none; font-size: 14px; color: #1e293b; font-family: inherit; }
        .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border: 1px solid white; border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 18px; margin-bottom: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .glass-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); }
        .card-icon { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .assessment-icon { background: #f1f5f9; color: #475569; }
        .appointment-icon { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .card-info { flex-grow: 1; }
        .card-info h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
        .meta-info { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; }
        .status-pill { display: inline-block; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 6px; margin-top: 8px; text-transform: uppercase; }
        .status-pill.pending { background: #fef3c7; color: #92400e; }
        .status-pill.completed { background: #d1fae5; color: #065f46; }
        .score-badge { text-align: right; background: #f1f5f9; padding: 8px 12px; border-radius: 12px; }
        .score-val { display: block; font-size: 18px; font-weight: 800; color: #1e293b; }
        .score-lab { font-size: 10px; color: #64748b; font-weight: 700; }
        .done { color: #10b981; }
        .pending-icon { color: #e2e8f0; }
        .empty-state { text-align: center; padding: 60px 0; color: #94a3b8; background: white; border-radius: 24px; border: 2px dashed #e2e8f0; margin-top: 20px; }
        .loader-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f7fa; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <HistoryIcon size={48} style={{ marginBottom: '15px', opacity: 0.2 }} />
    <p style={{ fontWeight: 600, fontSize: '16px' }}>{message}</p>
  </div>
);

export default History;