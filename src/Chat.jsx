import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../css/style.css";
// Ensure these paths are correct in your project
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png';
import INSTALOGO from './assets/instalogo.png';
import STAT from './assets/stat.png';

// --- STYLES ---
const ChatStyles = () => (
  <style>{`
    .chat-layout-container {
      display: flex;
      height: calc(100vh - 7rem);
    }
    .chat-list-panel {
      flex: 0 0 350px;
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .chat-window-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .chat-list-body { overflow-y: auto; }
    
    .chat-list-item { cursor: pointer; border-bottom: 1px solid #f0f0f0; }
    .chat-list-item:hover { background-color: #f8f9fa; }
    .chat-list-item.active { background-color: #711212; color: white; }
    .chat-list-item.active .text-muted { color: #f0f0f0 !important; }

    .chat-avatar { width: 50px; height: 50px; object-fit: cover; }

    .chat-window-body { background-color: #f5f5f5; }
    
    /* --- FIXED CHAT BUBBLE CSS --- */
    .chat-bubble { 
      padding: 10px 15px; 
      border-radius: 20px; 
      
      /* New properties to fix stacking letters */
      width: fit-content; 
      display: inline-block;
      max-width: 100%; 
      
      word-wrap: break-word; 
    }
    /* ----------------------------- */

    .chat-bubble.me { background-color: #711212; color: white; border-bottom-right-radius: 5px; }
    .chat-bubble.other { background-color: #ffffff; color: #333; border: 1px solid #e9e9e9; border-bottom-left-radius: 5px; }
    .chat-timestamp { font-size: 0.75rem; color: #6c757d; margin-top: 2px; }

    /* Mobile Modal Specifics */
    .mobile-chat-modal {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-chat-content {
      width: 95%;
      height: 90%;
      background: white;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  `}</style>
);

export default function Chats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [activeChatEvent, setActiveChatEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserEmail = currentUser?.email;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      axios.get(`${import.meta.env.VITE_API_URL}/my-chats/${currentUserEmail}`)
        .then(res => {
          const events = Array.isArray(res.data[0]) ? res.data[0] : res.data;
          setJoinedEvents(events);
        })
        .catch(err => console.error("Chat list error:", err));
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChatEvent]); 

  useEffect(() => {
    let poll;
    if (activeChatEvent) {
      const id = activeChatEvent.EventID || activeChatEvent.event_id;
      fetchMessages(id);
      poll = setInterval(() => fetchMessages(id), 2000);
    }
    return () => {
      if (poll) clearInterval(poll);
    };
  }, [activeChatEvent]);

  const fetchMessages = async (eventId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/chatroom/${eventId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    }
  };

  const handleViewChat = (event) => {
    const eventId = event.EventID || event.event_id;

    const markAsRead = () => {
      axios.put(`${import.meta.env.VITE_API_URL}/chats/mark-read`, {
        email: currentUserEmail,
        eventId: eventId
      }).catch(err => console.error("Failed to mark as read", err));
    };

    setMessages([]);
    setActiveChatEvent(event);
    markAsRead();
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatEvent) return;
    const eventId = activeChatEvent.EventID || activeChatEvent.event_id;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/chatroom/${eventId}`, {
        user_email: currentUserEmail,
        message_content: newMessage.trim()
      });
      setNewMessage("");
      fetchMessages(eventId);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const handleCloseActiveChat = () => {
    setActiveChatEvent(null);
    setMessages([]);
  };

  const getEventData = (event) => {
    if (!event) return null;
    return {
      id: event.EventID || event.event_id,
      name: event.EventName || event.event_name || "Unknown Event",
      photo: event.EventPhoto || event.event_photo,
      venue: event.EventVenue || event.event_venue,
      date: event.EventDate || event.event_date
    };
  };

  const formatTime = (dateString) => {
    try {
      if (!dateString) return "";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ""; }
  };

  const activeChatData = activeChatEvent ? getEventData(activeChatEvent) : null;

  // --- REUSABLE CHAT CONTENT RENDERER ---
  const renderChatContent = () => {
    if (!activeChatData) return null;
    return (
      <div className="d-flex flex-column h-100 bg-white">
        {/* Header */}
        <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img
              src={activeChatData.photo ? `${import.meta.env.VITE_API_URL}/api/upload/${activeChatData.photo}` : "https://via.placeholder.com/50"}
              className="rounded-circle me-3 chat-avatar"
              alt="avatar"
              onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
            />
            <div>
              <h5 className="fw-bold mb-0 text-dark">{activeChatData.name}</h5>
              <small className="text-muted">
                {activeChatData.venue}
              </small>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleCloseActiveChat}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Messages Body */}
        <div className="card-body chat-window-body overflow-auto p-3 flex-grow-1">
          {messages && messages.length > 0 ? (
            messages.map((m, idx) => {
              const isMe = m.user_email === currentUserEmail;
              return (
                <div key={idx} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                  {/* Wrapper width control */}
                  <div style={{ maxWidth: '85%' }} className={isMe ? 'd-flex flex-column align-items-end' : 'd-flex flex-column align-items-start'}>
                    <div className={`small text-muted ${isMe ? 'text-end' : ''}`}>
                      {m.user_email.split('@')[0]}
                    </div>
                    <div className={`chat-bubble ${isMe ? 'me' : 'other'}`}>
                      {m.message_content}
                    </div>
                    <div className={`chat-timestamp ${isMe ? 'text-end' : ''}`}>
                      {formatTime(m.sent_at)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted text-center mt-4">No messages yet. Say hi 👋</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="card-footer bg-white p-3">
          <div className="d-flex gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              className="form-control"
              placeholder="Type a message..."
            />
            <button className="btn btn-danger" style={{ backgroundColor: "#711212" }} onClick={handleSendMessage}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ChatStyles />

      {/* Navbar */}
      <div className='container-fluid p-0'>
        <nav className="navbar navbar-dark fixed-top d-flex justify-content-between px-3"
          style={{ zIndex: 1050, height: '7rem', paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: '#711212ff' }}>
          <div className="d-flex align-items-center">
            <img src={UALOGO} className="ua-logo me-2" alt="UA logo" style={{ width: "50px" }} />
            <div className="text-white">
              <div className="fw-bold ua-text">University of Antique</div>
              <div className="smc-text" style={{ fontSize: '0.85rem' }}>Sibalom Main Campus</div>
            </div>
          </div>
          <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
            ☰
          </button>
        </nav>

        {/* Sidebar */}
        <div className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
          style={{ width: '250px', zIndex: 1040, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', backgroundColor: '#711212ff' }}>
          <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
            <img src={UALOGO} alt="UA logo" style={{ width: '40px' }} />
            <div>
              <div className="fw-bold" style={{ fontSize: '1.1rem' }}>University of Antique</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>Sibalom Campus</div>
            </div>
          </div>
          <ul className="nav flex-column mt-5 px-3">
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/home">
                <i className="bi bi-house-door-fill"></i> Home
              </a>
            </li>
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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/chats"
                style={{ borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                <i className="bi bi-chat-dots-fill"></i> Chat
              </a>
            </li>
            <li className="nav-item d-flex justify-content-center gap-3" style={{ marginTop: '8rem' }}>
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
            <li className="nav-item mb-2 justify-content-center d-flex mt-1">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center"
                href="/login" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Log out
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{
        marginLeft: isLargeScreen ? '250px' : '0',
        marginTop: '7rem',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {isLargeScreen ? (
          /* --- DESKTOP VIEW --- */
          <div className="chat-layout-container">
            {/* Left Panel: List */}
            <div className="chat-list-panel bg-white">
              <div className="p-3 border-bottom">
                <h5 className="mb-0 fw-bold">My Chats</h5>
              </div>
              <div className="chat-list-body">
                {joinedEvents.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {joinedEvents.map((event, i) => {
                      const data = getEventData(event);
                      const isActive = activeChatEvent && (activeChatEvent.EventID === data.id || activeChatEvent.event_id === data.id);
                      return (
                        <a key={i} className={`list-group-item list-group-item-action chat-list-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleViewChat(event)}>
                          <div className="d-flex align-items-center">
                            <img src={data.photo ? `${import.meta.env.VITE_API_URL}/api/upload/${data.photo}` : "https://via.placeholder.com/50"}
                              className="rounded-circle me-3 chat-avatar" alt={data.name} onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }} />
                            <div className="flex-grow-1">
                              <div className="fw-bold text-truncate">{data.name}</div>
                              <div className="text-truncate" style={{ fontSize: "0.8rem" }}>{data.venue}</div>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted p-3">You haven't joined any events yet.</p>
                )}
              </div>
            </div>

            {/* Right Panel: Window */}
            <div className="chat-window-panel">
              {activeChatEvent ? (
                renderChatContent()
              ) : (
                <div className="d-flex h-100 justify-content-center align-items-center bg-light">
                  <div className="text-center text-muted">
                    <i className="bi bi-chat-dots-fill" style={{ fontSize: '4rem' }}></i>
                    <h4 className="mt-2">Select a chat</h4>
                    <p>Choose one of your joined events.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- MOBILE VIEW: LIST ONLY --- */
          <div className="container" style={{ paddingTop: '1rem' }}>
            <div className="row">
              <div className="col-12">
                <h4 className="fw-bold">My Chats</h4>
                {joinedEvents.length > 0 ? (
                  <div className="list-group">
                    {joinedEvents.map((event, i) => {
                      const data = getEventData(event);
                      return (
                        <a key={i} className="list-group-item list-group-item-action d-flex align-items-center p-3"
                          onClick={() => handleViewChat(event)}>
                          <img src={data.photo ? `${import.meta.env.VITE_API_URL}/api/upload/${data.photo}` : "https://via.placeholder.com/50"}
                            className="rounded-circle me-3 chat-avatar" alt={data.name} onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }} />
                          <div className="flex-grow-1">
                            <div className="fw-bold text-truncate">{data.name}</div>
                            <div className="text-muted text-truncate">{data.venue}</div>
                          </div>
                          <i className="bi bi-chevron-right"></i>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted mt-5">You haven't joined any events yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE MODAL (POPUP) --- */}
      {!isLargeScreen && activeChatEvent && (
        <div className="mobile-chat-modal">
          <div className="mobile-chat-content animate__animated animate__fadeInUp">
            {renderChatContent()}
          </div>
        </div>
      )}
    </>
  );
}