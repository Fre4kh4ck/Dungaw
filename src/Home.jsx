import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png';
import INSTALOGO from './assets/instalogo.png';
import STAT from './assets/stat.png';
import CCSLOGO from './assets/CCSLOGO.png';
import BG2 from './assets/bg2.jpg';
import CBALOGO from './assets/CBALOGO.png';
import CMSLOGO from './assets/CMSLOGO.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CMSMP4 from './assets/CMS.mp4';
import CCISMP4 from './assets/CCSMP4.mp4';
import CBAMP4 from './assets/HMVID.mp4';

// --- STYLES ---
// --- STYLES (Updated with Calendar Fixes) ---
const HomeStyles = () => (
  <style>{`
    .page-container {
      margin-top: 7rem;
      margin-left: 0;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      transition: margin-left 0.3s ease-in-out;
      background-color: #f8f9fa;
      min-height: calc(100vh - 7rem);
    }
    .page-container-large {
      margin-left: 250px;
    }
    .course-card {
      position: relative;
      border: none;
      border-radius: 0.75rem;
      overflow: hidden;
      height: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    .video-background {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%; 
      height: 100%;
      object-fit: cover;
      transform: translate(-50%, -50%);
      z-index: 1;
      pointer-events: none;
      border: none;
    }
    .course-card-overlay {
      position: relative;
      z-index: 2;
      height: 100%;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.25rem;
      color: white;
    }
    .course-card-logo {
      width: 45px;
      height: 45px;
      margin-bottom: 0.5rem;
    }
    
    /* --- ✅ CALENDAR FIXES START --- */
    .calendar-wrapper .react-calendar {
      width: 100%;
      border: none;
      font-family: 'Arial', sans-serif;
      background-color: transparent;
    }
    .react-calendar__tile {
      border-radius: 0.5rem;
      position: relative;
      min-height: 55px;
      padding: 10px 6.6667px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .react-calendar__tile--active {
      background: #711212 !important;
      color: white !important;
    }
    .react-calendar__tile--now {
      background: #f0f0f0;
    }
    .react-calendar__navigation button {
      color: #711212;
      min-width: 44px;
      background: none;
      font-weight: bold;
      font-size: 1.2rem;
    }

    /* --- WEEKDAY HEADER FIXES --- */
    .react-calendar__month-view__weekdays {
      text-align: center;
      font-size: 0.8rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5rem 0;
      display: flex;           /* Centers content */
      justify-content: center; 
      align-items: center;
    }
    /* Target the ABBR tag specifically to stop wrapping */
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none !important;
      white-space: nowrap !important; /* ✅ This stops "Mon" from becoming "Mo n" */
      cursor: default;
      font-weight: bold;
    }
    
    /* MOBILE SPECIFIC FIXES */
    @media (max-width: 576px) {
        .react-calendar__tile {
            min-height: 40px;
            padding: 5px 2px !important; 
            font-size: 0.75rem !important; 
            overflow: hidden;
        }
        .react-calendar__month-view__days__day--weekend {
            font-size: 0.75rem !important;
        }
        .react-calendar__navigation button {
            font-size: 1rem;
        }
        .event-dot {
            width: 4px;
            height: 4px;
            margin-top: 2px;
        }
        /* Ensure text fits on small screens */
        .react-calendar__month-view__weekdays__weekday abbr {
            font-size: 0.7rem; 
        }
    }
    /* --- CALENDAR FIXES END --- */

    .event-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin: 0 auto;
      margin-top: auto; /* Pushes dot to bottom */
      background-color: #711212;
    }
    .agenda-list-group {
      max-height: 250px;
      overflow-y: auto;
    }
    .footer-main {
      background-color: #711212;
      color: white;
      padding: 3rem 1.5rem 2rem 1.5rem;
    }
    .footer-main a {
      color: #f0f0f0;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-main a:hover {
      color: #ffffff;
      text-decoration: underline;
    }
    .footer-social-icon {
      font-size: 1.75rem;
      margin-right: 1rem;
    }
    .footer-copyright {
      background-color: #5a0e0e;
      color: #e0e0e0;
      padding: 1rem;
      text-align: center;
    }
    .notification-bell-icon {
      position: relative;
    }
    .notification-dot {
      width: 12px;
      height: 12px;
      background-color: #dc3545;
      top: 8px;
      right: 0px;
      border: 2px solid white;
    }
    .notification-dropdown-menu {
      width: 350px;
      border-radius: 0.5rem;
      border: 1px solid #dee2e6;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      padding: 0;
      margin-top: 0.5rem !important;
    }
    .notification-header {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .notification-header h6 {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 0;
    }
    .notification-header .btn-mark-read {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      color: #711212;
      background: none;
      border: none;
      text-decoration: none;
    }
    .notification-header .btn-mark-read:hover {
      text-decoration: underline;
    }
    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    .notification-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      text-decoration: none;
      white-space: normal;
      border-bottom: 1px solid #f0f0f0;
    }
    .notification-item:last-child {
      border-bottom: none;
    }
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    .notification-item-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 1.1rem;
    }
    .notification-item-content {
      flex-grow: 1;
      font-size: 0.95rem;
      color: #333;
    }
    .notification-item-content strong {
      color: #711212;
    }
    .notification-empty-state {
      padding: 2rem 1rem;
      text-align: center;
      color: #6c757d;
    }
    .notification-footer {
      text-align: center;
      padding: 0.75rem;
      border-top: 1px solid #f0f0f0;
      font-size: 0.9rem;
    }
    .notification-footer a {
      text-decoration: none;
      font-weight: 500;
      color: #711212;
    }
    .notification-footer a:hover {
      text-decoration: underline;
    }

    /* --- PROFESSIONAL MODAL STYLING --- */
    .modal-content-custom {
      border: none;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }
    .modal-header-custom {
      background: linear-gradient(135deg, #711212 0%, #5a0e0e 100%);
      color: white;
      padding: 1.5rem;
      border-bottom: none;
    }
    .modal-header-custom .btn-close {
      filter: brightness(0) invert(1);
      opacity: 0.8;
    }
    .modal-body-custom {
      padding: 2rem;
      background-color: #fff;
    }
    .custom-list-item {
      border: none;
      padding: 0.75rem 0;
      background: transparent;
      font-size: 0.95rem;
      color: #444;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .custom-list-icon {
      color: #711212;
      font-size: 1.2rem;
      background-color: rgba(113, 18, 18, 0.1);
      padding: 8px;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-footer-custom {
      background-color: #f8f9fa;
      border-top: 1px solid #eee;
      padding: 1rem 2rem;
    }
  `}</style>
);


export default function Home() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, sendData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Video state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoSource, setSelectedVideoSource] = useState(null);

  const [unreadChats, setUnreadChats] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // MAP KEYS TO YOUR LOCAL MP4 FILES
  const VIDEO_SOURCES = {
    CCS: CCISMP4,
    HM: CBAMP4,
    CMS: CMSMP4
  };

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getEventsForDate = (date, eventSource) => {
    const cleanSelectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    return eventSource.filter((event) => {
      const startDate = event.startDate;
      const endDate = event.endDate;
      if (!endDate || startDate.getTime() === endDate.getTime()) {
        return startDate.getTime() === cleanSelectedDate.getTime();
      }
      return cleanSelectedDate >= startDate && cleanSelectedDate <= endDate;
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        const allEvents = Array.isArray(res.data[0]) ? res.data[0] : res.data;
        const approvedEvents = allEvents.filter(event => event.EventStatus === "approved");

        const formatted = approvedEvents.map((event) => {
          const parseDate = (dateString) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
          };
          return {
            ...event,
            ...event,
            startDate: parseDate(event.EventStartDate),
            endDate: parseDate(event.EventEndDate),
          }
        }).filter(event => event.startDate);

        sendData(formatted);
        setSelectedEvents(getEventsForDate(new Date(), formatted));
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'guest') {
      const checkNotifications = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/chats/notifications/${user.email}`);
          setUnreadChats(res.data.unreadChats || []);
        } catch (err) {
          console.error("Failed to fetch notifications", err);
        }
      };
      checkNotifications();
      const intervalId = setInterval(checkNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleNotificationClick = (eventId) => {
    setUnreadChats(prevChats => prevChats.filter(chat => chat.eventId !== eventId));
    sessionStorage.setItem('openChatOnLoad', eventId);
    navigate('/chats');
  };

  const handleViewAllChats = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('openChatOnLoad');
    navigate('/chats');
  };

  const handleMarkAllAsRead = async () => {
    if (!user || unreadChats.length === 0) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/chats/mark-all-read`, { email: user.email });
      setUnreadChats([]);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleDateChange = (value) => {
    setDate(value);
    setSelectedEvents(getEventsForDate(value, data));
  };

  // Updated Video Handlers for LOCAL MP4
  const handlePlayVideo = (videoSource) => {
    setSelectedVideoSource(videoSource);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setSelectedVideoSource(null);
    setShowVideoModal(false);
  };

  const deptColors = {
    UA: "#f21010ff", CBA: "#6bc6ffff", CCIS: "#0d6efd", CTE: "#a735dcff",
    CCJE: "#d7ff24ff", CAS: "#18bb0cff", CEA: "#c9a420ff", CIT: "#fd7e14", CMS: "#9E9E9E"
  };

  return (
    <>
      <HomeStyles />

      {/* ===== NAVBAR ===== */}
      <div className='container-fluid p-0'>
        <nav className="navbar navbar-dark fixed-top d-flex justify-content-between align-items-center px-3"
          style={{ zIndex: 1050, height: '7rem', paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: '#711212ff' }}
        >
          <div className="d-flex align-items-center">
            <img src={UALOGO} className="ua-logo me-2" alt="UA logo" style={{ width: "50px" }} />
            <div className="text-white">
              <div className="fw-bold ua-text">University of Antique</div>
              <div className="smc-text" style={{ fontSize: '0.85rem' }}>Sibalom Main Campus</div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            {user && user.role !== 'guest' && (
              <div className="dropdown me-2">
                <a className="nav-link text-white notification-bell-icon" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-bell-fill fs-4"></i>
                  {unreadChats.length > 0 && (
                    <span className="position-absolute border rounded-circle notification-dot">
                      <span className="visually-hidden">New messages</span>
                    </span>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end notification-dropdown-menu fade">
                  <li>
                    <div className="notification-header">
                      <h6>Notifications</h6>
                      {unreadChats.length > 0 && (
                        <button className="btn-mark-read" onClick={handleMarkAllAsRead}>Mark all as read</button>
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="notification-list">
                      {unreadChats.length > 0 ? (
                        unreadChats.map((chat) => (
                          <a key={chat.eventId} className="dropdown-item notification-item" href="#" onClick={(e) => { e.preventDefault(); handleNotificationClick(chat.eventId); }}>
                            <div className="notification-item-icon bg-danger-subtle text-danger"><i className="bi bi-chat-dots-fill"></i></div>
                            <div className="notification-item-content">New message in <strong className="d-block">{chat.eventName}</strong></div>
                          </a>
                        ))
                      ) : (
                        <div className="notification-empty-state"><i className="bi bi-check2-circle fs-3 d-block mx-auto mb-2"></i>You're all caught up!</div>
                      )}
                    </div>
                  </li>
                  <li><div className="notification-footer"><a href="/chats" onClick={handleViewAllChats}>View all chats</a></div></li>
                </ul>
              </div>
            )}
            <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>☰</button>
          </div>
        </nav>

        {/* ===== SIDEBAR ===== */}
        <div className={` border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
          style={{ width: '250px', zIndex: 1040, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', backgroundColor: '#711212ff', position: 'relative', overflow: 'hidden' }}
        >
          <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
            <img src={UALOGO} alt="UA logo" style={{ width: '40px' }} />
            <div><div className="fw-bold" style={{ fontSize: '1.1rem' }}>University of Antique</div><div className="text-muted" style={{ fontSize: '0.85rem' }}>Sibalom Campus</div></div>
          </div>
          <ul className="nav flex-column mt-5 px-3">
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 active fw-semibold text-light border-light px-3 py-2" href="/home" style={{ borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                <i className="bi bi-house-door-fill"></i> Home
              </a>
            </li>
            {/* --- RESTRICTED LINKS (Hidden from Guests) --- */}
            {user?.role !== 'guest' && (
              <>
                <li className="nav-item mb-2">
                  <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/calendar">
                    <i className="bi bi-calendar-event-fill"></i> Calendar
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events">
                    <i className="bi bi-calendar2-event"></i> Events
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/chats">
                    <i className="bi bi-chat-dots-fill"></i> Chat
                  </a>
                </li>
              </>
            )}

            {/* --- SHARED LINKS (Visible to Guests & Users) --- */}
            {/* I moved the social icons and logout button here so Guests can see them too */}

            <li className="nav-item d-flex justify-content-center gap-3 mt-5">
              {/* Icons... */}
            </li>

            <li className="nav-item d-flex justify-content-center gap-3" style={{ marginTop: '12rem' }}>
              <a className="nav-link p-0" href="https://sims.antiquespride.edu.ph/aims/" target="_blank" rel="noopener noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }} src={UALOGO} alt="UA Logo" />
              </a>
              <a className="nav-link p-0" href="https://www.facebook.com/universityofantique" target="_blank" rel="noopener noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }} src={FBLOGO} alt="FB Logo" />
              </a>
              <a className="nav-link p-0" href="https://www.instagram.com/universityofantique/" target="_blank" rel="noopener noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }} src={INSTALOGO} alt="IG Logo" />
              </a>
            </li>

            <li className="nav-item mb-2 justify-content-center d-flex">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center"
                href="/login"
              >
                <i className="bi bi-box-arrow-right"></i> Log out
              </a>
            </li>
          </ul>
          <img src={STAT} alt="Sidebar design" style={{ position: "absolute", bottom: "-4.5rem", left: "50%", transform: "translateX(-55%)", width: "400px", opacity: 0.9, zIndex: -1, pointerEvents: "none" }} />
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className={`page-container ${isLargeScreen ? 'page-container-large' : ''}`}>
        <div className="container-fluid px-lg-4">
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Carousel */}
              <div id="carouselExampleAutoplaying" className="carousel slide shadow-sm mb-4" data-bs-ride="carousel">
                <div className="carousel-inner rounded-4">
                  <div className="carousel-item active"><img src={BG2} className="d-block w-100" alt="..." /></div>
                  <div className="carousel-item"><img src={BG2} className="d-block w-100" alt="..." /></div>
                </div>
              </div>

              {/* DEPARTMENTS GRID */}
              <h2 className="fw-bold mb-3" style={{ color: "#711212" }}>Discover Departments</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">

                {/* CCIS Card */}
                <div className="col">
                  <div className="card course-card">
                    <video className="video-background" src={CCISMP4} autoPlay loop muted playsInline />
                    <div className="course-card-overlay">
                      <img src={CCSLOGO} alt="CCIS" className="course-card-logo" />
                      <h4 className="fw-bold">CCIS</h4>
                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#modalCCIS">View Details</button>
                        <button className="btn btn-light btn-sm d-flex align-items-center gap-1" onClick={() => handlePlayVideo(VIDEO_SOURCES.CCS)}>
                          <i className="bi bi-play-fill"></i> Play Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CBA Card */}
                <div className="col">
                  <div className="card course-card">
                    <video className="video-background" src={CBAMP4} autoPlay loop muted playsInline />
                    <div className="course-card-overlay">
                      <img src={CBALOGO} alt="CBA" className="course-card-logo" />
                      <h4 className="fw-bold">CBA</h4>
                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#modalCBA">View Details</button>
                        <button className="btn btn-light btn-sm d-flex align-items-center gap-1" onClick={() => handlePlayVideo(VIDEO_SOURCES.HM)}>
                          <i className="bi bi-play-fill"></i> Play Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CMS Card */}
                <div className="col">
                  <div className="card course-card">
                    <video className="video-background" src={CMSMP4} autoPlay loop muted playsInline />
                    <div className="course-card-overlay">
                      <img src={CMSLOGO} alt="CMS" className="course-card-logo" />
                      <h4 className="fw-bold">CMS</h4>
                      <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#modalCMS">View Details</button>
                        <button className="btn btn-light btn-sm d-flex align-items-center gap-1" onClick={() => handlePlayVideo(VIDEO_SOURCES.CMS)}>
                          <i className="bi bi-play-fill"></i> Play Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column (Calendar/Agenda) */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                {/* MODIFIED: Changed p-4 to p-2 on mobile (p-md-4 on desktop) to give calendar space */}
                <div className="card-body p-2 p-md-4 calendar-wrapper">
                  <h5 className="fw-bold text-center mb-3 text-danger"><i className="bi bi-calendar3 me-2"></i>Academic Calendar</h5>
                  <Calendar onChange={handleDateChange} value={date} className="border-0"
                    tileContent={({ date, view }) => {
                      if (view !== 'month') return null;
                      const eventsForDay = getEventsForDate(date, data);
                      if (eventsForDay.length > 0) return <div className="event-dot" style={{ backgroundColor: deptColors[eventsForDay[0].EventDept] || '#bbb' }}></div>;
                      return null;
                    }}
                  />
                </div>
              </div>
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-center mb-3 text-danger"><i className="bi bi-list-check me-2"></i>Agenda for {date.toDateString()}</h5>
                  <div className="agenda-list-group">
                    {selectedEvents.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {selectedEvents.map((event, i) => (
                          <li key={i} className="list-group-item d-flex align-items-center gap-2 px-1">
                            <span style={{ width: "10px", height: "10px", backgroundColor: deptColors[event.EventDept] || '#bbb', borderRadius: "50%", flexShrink: 0 }}></span>
                            <div><span className="fw-semibold">{event.EventName}</span><small className="text-muted d-block">{event.EventTime} • {event.EventVenue}</small></div>
                          </li>
                        ))}
                      </ul>
                    ) : (<p className="text-muted text-center fst-italic mt-3">No events scheduled for this day.</p>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer-main" style={{ marginLeft: isLargeScreen ? "250px" : "0", transition: "margin-left 0.3s ease-in-out" }}>
        <div className="container-fluid px-lg-5">
          <div className="row g-4">
            <div className="col-md-5">
              <div className="d-flex align-items-center mb-2">
                <img src={UALOGO} alt="UA Logo" style={{ width: "40px" }} className="me-2" />
                <h5 className="fw-bold mb-0">University of Antique</h5>
              </div>
              <p className="small" style={{ color: "#f0f0f0" }}>Sibalom Main Campus, Sibalom, Antique</p>
              <p className="small" style={{ color: "#f0f0f0" }}>© 2025 University of Antique. All Rights Reserved.</p>
            </div>
            <div className="col-md-3 col-6">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/home">Home</a></li>
                <li className="mb-2"><a href="/calendar">Calendar</a></li>
                <li className="mb-2"><a href="/events">Events</a></li>
                <li className="mb-2"><a href="/chats">Chats</a></li>
              </ul>
            </div>
            <div className="col-md-4 col-6">
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div>
                <a href="https://www.facebook.com/universityofantique" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><i className="bi bi-facebook"></i></a>
                <a href="https://www.instagram.com/universityofantique/" target="_blank" rel="noopener noreferrer" className="footer-social-icon"><i className="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="footer-copyright" style={{ marginLeft: isLargeScreen ? "250px" : "0", transition: "margin-left 0.3s ease-in-out" }}>
        <small>Powered by Dungaw | A University Event Management System</small>
      </div>

      {/* ============================================================ */}
      {/* PROFESSIONAL DEPARTMENT MODALS (CCIS, CBA, CMS)              */}
      {/* ============================================================ */}

      {/* 1. CCIS DETAILS MODAL */}
      <div className="modal fade" id="modalCCIS" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-content-custom">
            <div className="modal-header modal-header-custom">
              <div className="d-flex align-items-center gap-3">
                <img src={CCSLOGO} alt="CCIS" style={{ width: '45px', height: '45px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <div><h5 className="modal-title fw-bold mb-0">College of Computer Studies</h5><small className="text-white-50">Innovating the Future</small></div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body modal-body-custom">
              <p className="text-muted mb-4">Welcome to the College of Computer Studies (CCIS). We foster innovation, critical thinking, and excellence in IT education to prepare students for the digital era.</p>
              <h6 className="fw-bold text-uppercase text-secondary small mb-3">Academic Programs</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item custom-list-item"><i className="bi bi-laptop custom-list-icon"></i><span className="fw-semibold">BS in Information Technology</span></li>
                <li className="list-group-item custom-list-item"><i className="bi bi-cpu custom-list-icon"></i><span className="fw-semibold">BS in Computer Science</span></li>
                <li className="list-group-item custom-list-item"><i className="bi bi-book custom-list-icon"></i><span className="fw-semibold">BL and Information Science</span></li>
              </ul>
            </div>
            <div className="modal-footer modal-footer-custom"><button type="button" className="btn btn-outline-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>

      {/* 2. CBA DETAILS MODAL */}
      <div className="modal fade" id="modalCBA" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-content-custom">
            <div className="modal-header modal-header-custom" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
              <div className="d-flex align-items-center gap-3">
                <img src={CBALOGO} alt="CBA" style={{ width: '45px', height: '45px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <div><h5 className="modal-title fw-bold mb-0">College of Business Admin</h5><small className="text-white-50">Leadership & Management</small></div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body modal-body-custom">
              <p className="text-muted mb-4">The College of Business Administration prepares students for leadership roles in the corporate world, focusing on entrepreneurship and hospitality.</p>
              <h6 className="fw-bold text-uppercase text-secondary small mb-3">Academic Programs</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item custom-list-item"><i className="bi bi-briefcase custom-list-icon" style={{ color: '#0d6efd', backgroundColor: 'rgba(13, 110, 253, 0.1)' }}></i><span className="fw-semibold">BS in Business Administration</span></li>
                <li className="list-group-item custom-list-item"><i className="bi bi-cup-hot custom-list-icon" style={{ color: '#0d6efd', backgroundColor: 'rgba(13, 110, 253, 0.1)' }}></i><span className="fw-semibold">BS in Hospitality Management</span></li>
              </ul>
            </div>
            <div className="modal-footer modal-footer-custom"><button type="button" className="btn btn-outline-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>

      {/* 3. CMS DETAILS MODAL */}
      <div className="modal fade" id="modalCMS" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-content-custom">
            <div className="modal-header modal-header-custom" style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}>
              <div className="d-flex align-items-center gap-3">
                <img src={CMSLOGO} alt="CMS" style={{ width: '45px', height: '45px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <div><h5 className="modal-title fw-bold mb-0">College of Maritime Studies</h5><small className="text-white-50">Seamanship & Discipline</small></div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body modal-body-custom">
              <p className="text-muted mb-4">Dedicated to producing world-class seafarers and maritime professionals who are globally competitive and disciplined.</p>
              <div className="p-3 rounded-3 border d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                <i className="bi bi-anchor-fill me-3 fs-2 text-secondary"></i>
                <div><div className="fw-bold">BS Marine Engineering</div><small>Upcoming Course</small></div>
              </div>
            </div>
            <div className="modal-footer modal-footer-custom"><button type="button" className="btn btn-outline-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button></div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL (Shared) */}
      {showVideoModal && selectedVideoSource && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-black border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-3 bg-dark text-white">
                <h5 className="modal-title"><i className="bi bi-play-circle-fill me-2"></i>Department Video</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseVideoModal}></button>
              </div>
              <div className="modal-body p-0 bg-black d-flex justify-content-center align-items-center">
                <video controls autoPlay className="w-100" style={{ maxHeight: '80vh' }}>
                  <source src={selectedVideoSource} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}