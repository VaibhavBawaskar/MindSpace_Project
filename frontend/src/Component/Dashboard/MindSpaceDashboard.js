import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Calendar, Activity, Bell, Search,
  ArrowUpDown, BrainCircuit, LogOut, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// sub-components
import ClientList from './ClientList';
import AppointmentList from './AppointmentList';
import TaskManager from './TaskManager';
import SettingPage from './SettingPage';
import CounsellorList from './CounsellorList';

const MindSpaceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [mergedClients, setMergedClients] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stats, setStats] = useState({
    total_counsellors: 0,
    total_clients: 0,
    today_appointments: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
      const [clientsRes, scansRes, counsellorsRes, appointmentsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/client-information/', { headers }),
        fetch('http://127.0.0.1:8000/api/depression-scan/', { headers }),
        fetch('http://127.0.0.1:8000/api/counsellors/', { headers }),
        fetch('http://127.0.0.1:8000/api/appointments/', { headers })
      ]);

      const infoData = await clientsRes.json();
      const scansData = await scansRes.json();
      const counsellorsData = await counsellorsRes.json();
      const appointmentsData = await appointmentsRes.json();

      // डेटा मॅपिंग आणि मर्चिंग
      const integrated = infoData.map((client, index) => {
        const scan = scansData.find(s => s.user === client.user);
        return {
          ...client,
          id_no: `MS-${1000 + (client.id || index)}`,
          score: scan ? Math.round((scan.total_score / 12) * 100) : 0,
          label: scan ? scan.result : 'Normal',
          status: scan ? 'Analyzed' : 'Pending',
          date: scan ? new Date(scan.created_at).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'}) : 'N/A'
        };
      });

      setMergedClients(integrated);
      setAnalyticsData(integrated.slice(0, 7).reverse());

      // Pie Chart कॅल्क्युलेशन
      const severityCounts = {
        Severe: integrated.filter(c => c.score >= 70).length,
        Moderate: integrated.filter(c => c.score >= 40 && c.score < 70).length,
        Healthy: integrated.filter(c => c.score < 40).length,
      };

      setPieData([
        { name: 'Severe', value: severityCounts.Severe, color: '#ef4444' },
        { name: 'Moderate', value: severityCounts.Moderate, color: '#f59e0b' },
        { name: 'Healthy', value: severityCounts.Healthy, color: '#10b981' },
      ]);

      // ✅ आजच्या तारखेनुसार अपॉइंटमेंट फिल्टर करणे
      const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD फॉरमॅट
      const todayAppsCount = appointmentsData.filter(app => app.date === todayStr).length;

      setStats({
        total_counsellors: Array.isArray(counsellorsData) ? counsellorsData.length : 0,
        total_clients: infoData.length || 0,
        today_appointments: todayAppsCount, // आता इथे फक्त आजची संख्या दिसेल
      });
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Dashboard UI घटक
  const DashboardHome = () => (
    <div className="fade-in">
      <div className="stats-grid">
        <StatCard label="Total Clients" value={stats.total_clients} icon={<Users/>} color="bg-blue" />
        <StatCard label="Today Appointments" value={stats.today_appointments} icon={<Calendar/>} color="bg-purple" />
        <StatCard label="Active Counsellors" value={stats.total_counsellors} icon={<CheckCircle/>} color="bg-green" />
      </div>

      <div className="charts-container">
        <div className="chart-box main-chart">
          <h3>Wellness Score Trends</h3>
          <p>Mental health progress analytics</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box side-chart">
          <h3>Health Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="table-container">
        <div className="table-header">
            <h3>Recent Wellness Scans</h3>
            <button className="refresh-btn" onClick={fetchData} disabled={loading}>
              {loading ? <span className="animate-spin">⌛</span> : <ArrowUpDown size={14}/>} Sync
            </button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID No</th>
              <th>Client Details</th>
              <th>Status</th>
              <th>Mental Health Score</th>
              <th>Last Scan</th>
            </tr>
          </thead>
          <tbody>
            {mergedClients.map((c, i) => (
              <tr key={i}>
                <td className="id-cell">{c.id_no}</td>
                <td>
                  <div className="client-info">
                    <div className="avatar">{c.first_name?.[0]}</div>
                    <div>
                      <p className="client-name">{c.first_name} {c.last_name}</p>
                      <p className="client-email">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div className="score-container">
                    <div className="progress-bg">
                      <div className="progress-fill" style={{
                        width: `${c.score}%`,
                        backgroundColor: c.score >= 70 ? '#ef4444' : c.score >= 40 ? '#f59e0b' : '#10b981'
                      }}></div>
                    </div>
                    <span className="score-text">{c.score}%</span>
                  </div>
                </td>
                <td className="date-text">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'counsellors': return <CounsellorList />;
      case 'clients': return <ClientList />;
      case 'appointments': return <AppointmentList />;
      case 'tasks': return <TaskManager />;
      case 'settings': return <SettingPage />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="app-layout">
      <nav className="side-nav">
        <div className="brand">
          <div className="brand-logo"><BrainCircuit size={20}/></div>
          <span className="brand-name">MindSpace</span>
        </div>
        <div className="menu-list">
          <MenuItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <MenuItem icon={<Users size={20}/>} label="Counsellors" active={activeTab==='counsellors'} onClick={()=>setActiveTab('counsellors')} />
          <MenuItem icon={<Activity size={20}/>} label="Clients" active={activeTab==='clients'} onClick={()=>setActiveTab('clients')} />
          <MenuItem icon={<Calendar size={20}/>} label="Appointments" active={activeTab==='appointments'} onClick={()=>setActiveTab('appointments')} />
        </div>
        <div className="nav-footer">
          <MenuItem icon={<LogOut size={20}/>} label="Logout" onClick={() => {localStorage.clear(); window.location.href='/counsellorauth';}} />
        </div>
      </nav>

      <main className="content-area">
        <header className="top-bar">
          <div className="search-box"><Search size={18}/> <input placeholder="Search client reports..." /></div>
          <div className="user-nav">
             <Bell size={20} style={{color: '#64748b', cursor: 'pointer'}} />
             <div className="user-avatar">AD</div>
          </div>
        </header>
        <div className="dynamic-content">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root { --p: #6366f1; --bg: #f8fafc; --card: #ffffff; --txt: #1e293b; --sec: #64748b; }
        * { margin:0; padding:0; box-sizing:border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); }
        .app-layout { display: flex; min-height: 100vh; }
        .side-nav { width: 260px; background: #fff; border-right: 1px solid #e2e8f0; padding: 25px; position: fixed; height: 100vh; }
        .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .brand-logo { background: var(--p); color: #fff; padding: 8px; border-radius: 10px; }
        .brand-name { font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 12px; cursor: pointer; color: var(--sec); transition: 0.3s; font-weight: 600; margin-bottom: 5px; }
        .menu-item.active { background: var(--p); color: #fff; }
        .content-area { margin-left: 260px; flex: 1; padding: 40px; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        .search-box { background: #fff; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 15px; display: flex; align-items: center; gap: 10px; width: 350px; }
        .search-box input { border: none; outline: none; width: 100%; font-size: 14px; }
        .user-nav { display: flex; align-items: center; gap: 20px; }
        .user-avatar { width: 40px; height: 40px; background: #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 30px; }
        .stat-card { background: #fff; padding: 25px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .stat-icon { padding: 12px; border-radius: 12px; color: #fff; }
        .bg-green { background: #10b981; } .bg-blue { background: #3b82f6; } .bg-purple { background: #8b5cf6; }
        .charts-container { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; margin-bottom: 30px; }
        .chart-box { background: #fff; padding: 25px; border-radius: 24px; border: 1px solid #e2e8f0; }
        .table-container { background: #fff; padding: 30px; border-radius: 24px; border: 1px solid #e2e8f0; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { text-align: left; color: var(--sec); font-size: 12px; text-transform: uppercase; padding: 15px; border-bottom: 1px solid #f1f5f9; }
        .custom-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .id-cell { font-family: monospace; font-weight: 700; color: var(--p); background: #f5f7ff; padding: 4px 8px; border-radius: 6px; }
        .client-info { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 35px; height: 35px; border-radius: 10px; background: #f1f5f9; color: var(--p); display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .client-name { font-weight: 700; color: #1e293b; }
        .client-email { font-size: 11px; color: var(--sec); }
        .status-pill { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }
        .status-pill.analyzed { background: #f0fdf4; color: #10b981; }
        .status-pill.pending { background: #fffbeb; color: #f59e0b; }
        .score-container { display: flex; align-items: center; gap: 10px; }
        .progress-bg { width: 80px; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }
        .score-text { font-size: 12px; font-weight: 700; color: var(--sec); }
        .animate-spin { display: inline-block; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

const MenuItem = ({ icon, label, active, onClick }) => (
  <div className={`menu-item ${active ? 'active' : ''}`} onClick={onClick}>{icon} <span>{label}</span></div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="stat-card">
    <div><p style={{color:'#64748b', fontWeight:'600'}}>{label}</p><h2 style={{fontSize:'32px', fontWeight:'800'}}>{value}</h2></div>
    <div className={`stat-icon ${color}`}>{icon}</div>
  </div>
);

export default MindSpaceDashboard;