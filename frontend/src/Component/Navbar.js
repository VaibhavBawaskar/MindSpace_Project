import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('access_token');
    const storedName = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedName || "User");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();

    const handleScroll = () => {
      // जर २० पिक्सेल पेक्षा जास्त स्क्रोल झाले तर स्टेट बदला
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('authChange', checkLoginStatus);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location, checkLoginStatus]);

  const handleLogout = () => {
    if (window.confirm("तुम्हाला लॉगआउट करायचे आहे का?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      setShowDropdown(false);
      navigate('/');
    }
  };

  // नॅव्हबारची स्टाईल - इथे आपण बॅकग्राउंड कलर फिक्स केला आहे
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: scrolled ? '10px 5%' : '20px 5%',
    // स्क्रोल झाल्यावर बॅकग्राउंड पूर्ण काळा (solid black) राहील याची खात्री करा
    background: scrolled ? '#0d0d0d' : 'rgba(13, 13, 13, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'fixed', // 'sticky' ऐवजी 'fixed' वापरून पहा जर तो गायब होत असेल तर
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease-in-out',
    borderBottom: scrolled ? '1px solid #333' : '1px solid transparent'
  };

  return (
    <>
      {/* Fixed नॅव्हबार वापरताना कंटेंट मागे दबू नये म्हणून हे रिकामे Div */}
      <div style={{ height: scrolled ? '60px' : '80px', transition: '0.3s' }}></div>

      <header style={navStyle}>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', cursor: 'pointer', margin: 0, letterSpacing: '-0.5px' }} onClick={() => navigate('/')}>
          Mind<span style={{ color: '#a8ff35' }}>Space</span>
        </h1>

        <nav style={{ display: 'flex', gap: '30px', marginLeft: 'auto', alignItems: 'center' }}>
          <span className="nav-link" onClick={() => navigate('/')}>Home</span>
          <span className="nav-link" onClick={() => navigate('/')}>Pages</span>
          <span className="nav-link" onClick={() => navigate('/')}>Contact</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About</span>

          {isLoggedIn && (
            <span className="nav-link" onClick={() => navigate('/assessment')}>Assessment</span>
          )}

          {isLoggedIn ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="user-avatar">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{username}</span>
                <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▾</span>
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-label">Logged in as</p>
                    <p className="user-email-display">{username}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={() => {navigate('/profile'); setShowDropdown(false);}}>
                    <span className="item-icon">👤</span> My Profile
                  </div>
                  <div className="dropdown-item" onClick={() => {navigate('/dashboard'); setShowDropdown(false);}}>
                    <span className="item-icon">📊</span> Dashboard
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="item-icon">🚪</span> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="start-btn" onClick={() => navigate('/authPage')}>
              Start Free Trial
            </button>
          )}
        </nav>

        <style>{`
          .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 15px; font-weight: 500; cursor: pointer; transition: 0.3s; position: relative; }
          .nav-link:hover { color: #a8ff35; }
          .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 0; background-color: #a8ff35; transition: width 0.3s; }
          .nav-link:hover::after { width: 100%; }

          .profile-trigger {
            display: flex; align-items: center; gap: 10px; padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05); border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer;
            transition: 0.3s ease;
          }
          .profile-trigger:hover { background: rgba(168, 255, 53, 0.1); border-color: rgba(168, 255, 53, 0.4); }

          .user-avatar {
            width: 30px; height: 30px; background: #a8ff35; color: #000;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 14px;
          }

          .user-name-text { color: white; font-size: 14px; font-weight: 600; }
          .dropdown-arrow { color: rgba(255,255,255,0.5); transition: 0.3s; }
          .dropdown-arrow.open { transform: rotate(180deg); color: #a8ff35; }

          .dropdown-menu {
            position: absolute; top: 55px; right: 0; width: 220px;
            background: #151515; border-radius: 12px; border: 1px solid #333;
            padding: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);
            z-index: 2000;
          }

          .dropdown-item {
            padding: 12px 15px; color: #ccc; cursor: pointer; border-radius: 8px;
            font-size: 14px; display: flex; align-items: center; gap: 10px; transition: 0.2s;
          }
          .dropdown-item:hover { background: rgba(168, 255, 53, 0.1); color: #a8ff35; }

          .start-btn {
            background: linear-gradient(45deg, #1677ff, #0050b3); color: white;
            padding: 10px 22px; border-radius: 8px; border: none; cursor: pointer;
            font-weight: 600; transition: 0.3s;
          }
        `}</style>
      </header>
    </>
  );
};

export default Navbar;