import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Component/Home';
import AuthPage from './Component/Auth';
import SelectLanguage from './Component/pages/SelectLanguage';
import ClientInformation from './Component/pages/ClientInformation';
import ScreeningPage from './Component/pages/ScreeningPage';
import Dashboard from './Component/pages/Dashboard';
import Profile from './Component/pages/Profile';
import History from './Component/pages/History';
import Settings from './Component/pages/Settings';
import ChangePassword from './Component/pages/ChangePassword';
import ScoreCard from './Component/pages/ScoreCard';
import './i18n';
import About from './Component/pages/About';
import AppointmentPage from './Component/pages/AppointmentPage';

import ForgotPassword from './Component/pages/ForgotPassword';
import ResetPassword from './Component/pages/ResetPassword';

import MindSpaceDashboard from './Component/Dashboard/MindSpaceDashboard';
import ClientList from './Component/Dashboard/ClientList';
import CounsellorAuth from './Component/Dashboard/CounsellorAuth';
import AppointmentList from './Component/Dashboard/AppointmentList';
import TaskManager from './Component/Dashboard/TaskManager';
import SettingPage from './Component/Dashboard/SettingPage';
import CounsellorList from './Component/Dashboard/CounsellorList';




// Temporary components (Nantar tu navin files banvu shakto)


function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Page (Login/Register) */}
        <Route path="/" element={<Home />} />
        <Route path="/authPage" element={<AuthPage />} />


        {/* Login nantar ya pages chi garaj aahe */}
        <Route path="/select-language" element={<SelectLanguage />} />
        ClientInformation
        <Route path="/clientInformation" element={<ClientInformation />} />
        <Route path="/assessment" element={<ScreeningPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
         <Route path="/change-password" element={<ChangePassword />} />
         <Route path="/assessment-result" element={<ScoreCard />} />
         <Route path="/appointmentpage" element={<AppointmentPage />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

         <Route path="/counsellorauth" element={<CounsellorAuth />} />
         <Route path="/mindspacedashboard" element={<MindSpaceDashboard />} />
         <Route path="/clientlist" element={<ClientList />} />
         <Route path="/appointmentlist" element={<AppointmentList />} />
         <Route path="/taskmanager" element={<TaskManager />} />
         <Route path="/settingpage" element={<SettingPage />} />
          <Route path="/counsellorList" element={<CounsellorList />} />



        <Route path="/about" element={<About />} />

        {/* 404 Page jar rasta chukla tar */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;