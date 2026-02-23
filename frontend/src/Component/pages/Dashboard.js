import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, User, Brain, History, Settings, LogOut,
  CheckCircle, Loader2, Zap, Calendar as CalendarIcon
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/client-information/?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("Backend Raw Data:", data);

      // जर डेटा लिस्ट स्वरूपात असेल तर पहिले ऑब्जेक्ट घ्या
      const finalData = Array.isArray(data) ? data[0] : data;
      setUserData(finalData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!userData || !userData.marks || typeof userData.marks !== 'object') {
      return [{ name: 'N/A', score: 0 }];
    }
    // Object.entries वापरून {Depression: 50} ला [{name: 'Depression', score: 50}] मध्ये रूपांतरित करणे
    return Object.entries(userData.marks).map(([key, value]) => ({
      name: key,
      score: value
    }));
  };

  if (loading) return (
    <div className="loader-screen">
      <Loader2 className="animate-spin" size={48} color="#2563eb" />
      <p>Syncing your wellness data...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><Zap size={28} fill="#2563eb" color="#2563eb"/> Mind<span>Space</span></div>
        <nav className="sidebar-nav">
          <div className="nav-group-label">Menu</div>
          <div className="nav-item" onClick={() => navigate('/profile')}><User size={20}/> <span>Profile</span></div>
          <div className="nav-item" onClick={() => navigate('/appointmentpage')}><CalendarIcon size={20}/> <span>Appointment</span></div>
          <div className="nav-item" onClick={() => navigate('/history')}><History size={20}/> <span>History</span></div>
          <div className="nav-item active"><LayoutDashboard size={20}/> <span>Dashboard</span></div>

          <div className="nav-group-label">System</div>
          <div className="nav-item" onClick={() => navigate('/settings')}><Settings size={20}/> <span>Settings</span></div>
        </nav>
        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={() => { localStorage.clear(); navigate('/'); }}>
            <LogOut size={20}/> <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-text">
            <h1>Welcome back, <span>{userData?.first_name || "User"}!</span></h1>
            <p>Your mental health journey at a glance.</p>
          </div>
          <button className="new-test-btn" onClick={() => navigate('/assessment')}>
             Take New Assessment
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card shadow-sm">
            <div className="stat-icon-box brain-bg"><Brain size={24} /></div>
            <div className="stat-content">
              <h3>Primary Indicator</h3>
              <p className="main-value">
                {userData?.marks?.Depression !== undefined ? `${userData.marks.Depression}%` : "N/A"}
              </p>
              <div className="score-bar-bg">
                <div className="score-bar-fill" style={{ width: `${userData?.marks?.Depression || 0}%` }}></div>
              </div>
              <span className="sub-text">Depression Level</span>
            </div>
          </div>

          <div className="stat-card shadow-sm">
            <div className="stat-icon-box blue-bg"><CheckCircle size={24} /></div>
            <div className="stat-content">
              <h3>Total Scans</h3>
              <p className="main-value">
                {userData?.marks ? Object.keys(userData.marks).length : 0}
              </p>
              <span className="sub-text">Completed assessments</span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card shadow-sm">
            <h3>Wellness Analysis</h3>
            {/* ResponsiveContainer साठी पेरेंट div ची हाईट फिक्स केली आहे */}
            <div style={{ width: '100%', height: 350, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-activity shadow-sm">
            <h3>Metric Breakdown</h3>
            <div className="activity-list">
              {userData?.marks && Object.keys(userData.marks).length > 0 ? (
                Object.entries(userData.marks).map(([test, score], i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-info">
                      <h4>{test} Level</h4>
                      <p>Status: <span style={{color: '#16a34a'}}>Verified</span></p>
                    </div>
                    <div className="score-badge">{score}%</div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px 0'}}>
                   <p style={{color: '#94a3b8'}}>No metrics found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .dashboard-container { display: flex; min-height: 100vh; background: #f8fafc; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; }
        .loader-screen { height: 100vh; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #2563eb; }

        .sidebar { width: 260px; background: white; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 30px 20px; position: fixed; height: 100vh; z-index: 100; }
        .sidebar-logo { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 40px; display: flex; align-items: center; gap: 8px; }
        .sidebar-logo span { color: #2563eb; }

        .nav-group-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 20px 10px 10px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; color: #64748b; cursor: pointer; transition: 0.3s; margin-bottom: 4px; }
        .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
        .nav-item:hover:not(.active) { background: #f1f5f9; color: #0f172a; }

        .logout { margin-top: auto; color: #ef4444; }
        .main-content { margin-left: 260px; flex-grow: 1; padding: 40px 50px; width: calc(100% - 260px); }

        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .header-text h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin: 0; }
        .header-text h1 span { color: #2563eb; }
        .header-text p { color: #64748b; margin: 5px 0 0; }

        .new-test-btn { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); }
        .new-test-btn:hover { background: #1d4ed8; transform: translateY(-2px); }

        .shadow-sm { background: white; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .stat-card { padding: 24px; display: flex; flex-direction: column; }
        .stat-icon-box { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }

        .brain-bg { background: #eff6ff; color: #2563eb; }
        .blue-bg { background: #f0fdf4; color: #16a34a; }

        .stat-content h3 { font-size: 14px; color: #64748b; margin: 0; font-weight: 600; }
        .main-value { font-size: 36px; font-weight: 700; margin: 8px 0; color: #0f172a; }
        .sub-text { font-size: 13px; color: #94a3b8; }

        .score-bar-bg { width: 100%; height: 8px; background: #f1f5f9; border-radius: 10px; margin: 12px 0; }
        .score-bar-fill { height: 100%; background: #2563eb; border-radius: 10px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }

        .charts-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 24px; margin-top: 32px; }
        .chart-card, .recent-activity { padding: 24px; }
        .chart-card h3, .recent-activity h3 { font-size: 18px; font-weight: 700; margin: 0 0 25px; color: #0f172a; }

        .activity-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #f8fafc; }
        .activity-info h4 { margin: 0; font-size: 15px; font-weight: 600; color: #1e293b; }
        .activity-info p { margin: 4px 0 0; font-size: 12px; color: #94a3b8; }
        .score-badge { background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-weight: 700; color: #2563eb; font-size: 14px; }

        @media (max-width: 1100px) {
          .charts-grid { grid-template-columns: 1fr; }
          .main-content { margin-left: 0; padding: 30px 20px; width: 100%; }
          .sidebar { display: none; }
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;