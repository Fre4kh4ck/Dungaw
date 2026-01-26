import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-calendar/dist/Calendar.css"
import "../css/style.css";
// Ensure these paths are correct in your project
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png'
import INSTALOGO from './assets/instalogo.png'
import STAT from './assets/stat.png'
import BG1 from './assets/bg1.jpeg'
import axios from 'axios';
import Tick from './Tick';

export default function Events() {
    // 1. Existing Timer/Tick
    useEffect(() => {
        Tick(GetEvents);
    }, []);

    const [isJoining, setIsJoining] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [data, sendData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [joinCounts, setJoinCounts] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // --- ✅ USER STATE ---
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    // ------------------------------------------

    // --- ✅ NEW ADDITION: QR LIST & ENLARGE STATE ---
    const [showQrListModal, setShowQrListModal] = useState(false);
    const [myJoinedEvents, setMyJoinedEvents] = useState([]);
    const [enlargedQrUrl, setEnlargedQrUrl] = useState(null); // <--- NEW STATE FOR ZOOM

    // --- FUNCTION TO FETCH JOINED EVENTS ---
    const fetchMyJoinedEvents = async () => {
        if (!user) return;
        const userEmail = user.email || user.UserEmail;
        
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-events/${userEmail}`);
            setMyJoinedEvents(res.data);
            setShowQrListModal(true);
        } catch (err) {
            console.error("Error fetching joined events:", err);
            // Open modal anyway to show empty state if error or empty
            setShowQrListModal(true);
        }
    };
    // ----------------------------------------------------

    const handleViewInfo = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinedEvent, setJoinedEvent] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [eventToJoin, setEventToJoin] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const handleJoinEvent = (event) => {
        setEventToJoin(event);
        setShowConfirmModal(true);
    };

    const confirmJoinEvent = async () => {
        // 1. Get User
        const userObjString = localStorage.getItem("user");
        if (!userObjString) {
            alert("Error: You appear to be logged out. Please log in again.");
            return;
        }

        const userObj = JSON.parse(userObjString);
        const userEmail = userObj?.email || userObj?.UserEmail;

        if (!userEmail) {
            alert("Error: Could not find an email address associated with your account.");
            return;
        }

        // 2. Get Event Data
        if (!eventToJoin) {
            alert("Error: No event selected.");
            return;
        }

        const e_id = eventToJoin.EventID || eventToJoin.event_id || eventToJoin.id;
        const e_name = eventToJoin.EventName || eventToJoin.event_name || eventToJoin.name;
        const e_date = eventToJoin.EventStartDate || eventToJoin.event_start_date || eventToJoin.date;
        const e_venue = eventToJoin.EventVenue || eventToJoin.event_venue; 

        if (!e_id) {
            alert("Error: Could not determine Event ID.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/join-event`, {
                email: userEmail,
                eventId: e_id,
                eventName: e_name,
                eventDate: e_date,
                eventVenue: e_venue,
                sendEmailNotification: true
            });

            const { qrCodeDataURL } = response.data;
            if (qrCodeDataURL) setQrCodeUrl(qrCodeDataURL);

            setShowConfirmModal(false);
            setJoinedEvent(eventToJoin);
            setShowJoinModal(true);

            setJoinCounts(prev => ({
                ...prev,
                [e_id]: (prev[e_id] || 0) + 1
            }));

            setEventToJoin(null);

        } catch (err) {
            console.error("❌ JOIN ERROR DETAILS:", err);
            if (err.response) {
                if (err.response.status === 409 || err.response.data.message?.includes("Already joined")) {
                    alert("You have already joined this event!");
                } else {
                    alert(`Failed to join: ${err.response.data.message || "Unknown server error"}`);
                }
            } else {
                alert(`Error: ${err.message}`);
            }
            setShowConfirmModal(false);
        }
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setEventToJoin(null);
    };

    const handleCloseJoinModal = () => {
        setShowJoinModal(false);
        setJoinedEvent(null);
        setQrCodeUrl("");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toDateString();
    };

    const formatEventDateRange = (startDateString, endDateString) => {
        if (!startDateString) return "N/A";
        const startDate = new Date(startDateString);
        if (isNaN(startDate.getTime())) return "Invalid Date";
        const options = { month: 'short', day: 'numeric' };
        if (!endDateString) return startDate.toLocaleDateString('en-US', options);
        const endDate = new Date(endDateString);
        if (isNaN(endDate.getTime())) return startDate.toLocaleDateString('en-US', options);
        if (startDate.toDateString() === endDate.toDateString()) return startDate.toLocaleDateString('en-US', options);
        if (startDate.getMonth() === endDate.getMonth()) {
            return `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}`;
        } else {
            return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
        }
    };

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const FetchEvents = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
        sendData(res.data);
    }

    const GetEvents = () => FetchEvents();

    const filteredEvents = data.filter((event) => {
        const name = event.EventName || event.eventName || event.event_name || "";
        const category = event.EventCategory || event.eventCategory || event.event_category || "";
        const location = event.EventLocation || event.eventLocation || event.event_location || "";
        const venue = event.EventVenue || event.eventVenue || event.event_venue || "";

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDept = selectedDept === "" || event.EventDept === selectedDept;

        if (user && user.role !== 'admin') {
            const userDept = (user.dept || user.department || "").toUpperCase();
            const eventDept = (event.EventDept || "").toUpperCase();
            const isAuthorizedDept = eventDept === 'UA' || eventDept === userDept;
            if (!isAuthorizedDept) return false;
        }

        const isApproved = event.EventStatus === "approved";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDateStr = event.EventEndDate || event.EventStartDate;
        const eventDate = new Date(eventDateStr);
        const isUpcoming = !isNaN(eventDate.getTime()) && eventDate >= today;

        return matchesSearch && matchesDept && isApproved && isUpcoming;
    });

    useEffect(() => {
        const fetchJoinCounts = async () => {
            const counts = {};
            await Promise.all(
                filteredEvents.map(async (event) => {
                    try {
                        const res = await axios.get(`${import.meta.env.VITE_API_URL}/event/${event.EventID}/join-count`);
                        counts[event.EventID] = res.data.total || 0;
                    } catch (err) {
                        counts[event.EventID] = 0;
                    }
                })
            );
            setJoinCounts(prev => ({ ...prev, ...counts }));
        };
        if (filteredEvents.length > 0) fetchJoinCounts();
    }, [filteredEvents]);


    return (
        <>
            <div className='container-fluid'>
                <nav className="navbar navbar-dark fixed-top d-flex justify-content-between px-3"
                    style={{ zIndex: 1050, height: '7rem', paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: '#711212ff' }}>
                    <div className="d-flex align-items-center">
                        <img src={UALOGO} className="ua-logo me-2" alt="UA logo" style={{ width: "50px" }} />
                        <div className="text-white">
                            <div className="fw-bold ua-text">University of Antique</div>
                            <div className="smc-text" style={{ fontSize: '0.85rem' }}>Sibalom Main Campus</div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {user && (
                            <button 
                                className="btn btn-outline-light me-2 fw-semibold" 
                                onClick={fetchMyJoinedEvents}
                                style={{ borderRadius: '20px', fontSize: '0.9rem' }}
                            >
                                <i className="bi bi-qr-code me-1"></i> (Event Qr)
                            </button>
                        )}
                        <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>☰</button>
                    </div>
                </nav>

                <div className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
                    style={{
                        width: '250px',
                        zIndex: 1040,
                        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                        backgroundColor: '#711212ff',
                        transform: isLargeScreen ? "translateX(0)" : (sidebarOpen ? "translateX(0)" : "translateX(-100%)"),
                        transition: "transform 0.3s ease-in-out"
                    }}>
                    <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <img src={UALOGO} alt="UA logo" style={{ width: '40px' }} />
                        <div>
                            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>University of Antique</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Sibalom Campus</div>
                        </div>
                    </div>

                    <ul className="nav flex-column mt-5 px-3">
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/home">
                                <i className="bi bi-house-door-fill"></i> Home
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/calendar">
                                <i className="bi bi-calendar-event-fill"></i> Calendar
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/events"
                                style={{ borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                                <i className="bi bi-calendar2-event"></i> Events
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/chats">
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

                        <li className="nav-item mb-2 justify-content-center d-flex">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center" href="/login">
                                <i className="bi bi-box-arrow-right"></i> Log out
                            </a>
                        </li>
                    </ul>

                    <img src={STAT} alt="Sidebar design"
                        style={{
                            position: "absolute", bottom: "-4.5rem", left: "50%", transform: "translateX(-55%)",
                            width: "400px", opacity: 0.9, zIndex: -1, pointerEvents: "none"
                        }}
                    />
                </div>
            </div>

            <div style={{
                marginLeft: isLargeScreen ? "250px" : "0",
                transition: "margin-left 0.3s ease-in-out",
                width: isLargeScreen ? "calc(100% - 250px)" : "100%",
                overflowX: "hidden"
            }}>
                <div className="container-fluid p-0">
                    <div className="position-relative" style={{ marginTop: '6rem', width: '100%', minHeight: '60vh' }}>
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <img src={BG1} alt="" style={{ width: "100%", minHeight: "60vh", objectFit: "cover", opacity: "0.8" }} />
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))" }}></div>
                        </div>

                        <div style={{
                            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                            textAlign: "center", color: "#fff", width: "90%", maxWidth: "800px"
                        }}>
                            <h1 style={{ fontWeight: "bold", fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                                <span style={{ color: "#00AEEF" }}>Live Today.</span> Live Campus Life.
                            </h1>
                            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", marginBottom: "20px" }}>Discover Most Exciting Campus Events</p>

                            <div style={{
                                display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
                                alignItems: "center", width: "100%", background: "#fff", borderRadius: "8px", padding: "5px 10px"
                            }}>
                                <input type="text" placeholder="Search Events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ flex: "1 1 200px", border: "none", outline: "none", padding: "10px", fontSize: "1rem" }} />
                                <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                                    style={{ border: "none", outline: "none", padding: "10px", background: "transparent", borderLeft: isLargeScreen ? "1px solid #eee" : "none" }}>
                                    <option value="">UA</option>
                                    <option value="CCIS">CCIS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid mt-5 mb-5 px-4">
                    {filteredEvents.length > 0 ? (
                        <div className="row g-4">
                            {filteredEvents.map((event, index) => (
                                <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-stretch">
                                    <div className="card shadow-lg border-0 rounded-4 w-100">
                                        <img src={event.EventPhoto ? `${import.meta.env.VITE_API_URL}/api/upload/${event.EventPhoto}` : "/fallback.jpg"}
                                            className="card-img-top rounded-top-4" alt={event.EventName} style={{ height: '180px', objectFit: 'cover' }} />
                                        <div className="card-body d-flex flex-column">
                                            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                                                {formatEventDateRange(event.EventStartDate, event.EventEndDate)} • {event.EventVenue}
                                            </p>
                                            <h5 className="card-title fw-bold text-truncate">{event.EventName}, {event.EventDept}</h5>
                                            <p className="text-muted mb-2"><i className="bi bi-people-fill me-2"></i>{joinCounts[event.EventID] ?? 0} Interested</p>
                                            <div className="mt-auto d-flex align-items-center gap-2 pt-3">
                                                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 fw-semibold"
                                                    style={{ flex: "1", height: "45px", borderColor: "#711212ff", color: "#711212ff" }} onClick={() => handleJoinEvent(event)}>
                                                    <i className="bi bi-people-fill"></i> Join
                                                </button>
                                                <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center fw-semibold"
                                                    style={{ width: "45px", height: "45px", borderColor: "#711212ff", color: "#711212ff" }} onClick={() => handleViewInfo(event)}>
                                                    <i className="bi bi-info-circle fs-5"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <h1 className="text-center text-muted mt-5">No events found</h1>}
                </div>
            </div>

            {/* Modals */}
            {showModal && selectedEvent && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(5px)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header text-white" style={{ backgroundColor: "#711212ff" }}>
                                <h5 className="modal-title fw-bold">{selectedEvent.EventName}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body p-0">
                                <img src={selectedEvent.EventPhoto ? `${import.meta.env.VITE_API_URL}/api/upload/${selectedEvent.EventPhoto}` : "/fallback.jpg"}
                                    alt={selectedEvent.EventName} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                                <div className="p-4">
                                    <ul className="list-group list-group-flush mb-4">
                                        <li className="list-group-item d-flex gap-3 px-0 align-items-center">
                                            <i className="bi bi-calendar-event fs-4" style={{ color: "#711212ff" }}></i>
                                            <div><h6 className="mb-0 fw-bold">Date</h6><span className="text-muted">{formatDate(selectedEvent.EventStartDate)}</span></div>
                                        </li>
                                        <li className="list-group-item d-flex gap-3 px-0 align-items-center">
                                            <i className="bi bi-geo-alt-fill fs-4" style={{ color: "#711212ff" }}></i>
                                            <div><h6 className="mb-0 fw-bold">Location</h6><span className="text-muted">{selectedEvent.EventVenue}</span></div>
                                        </li>
                                    </ul>
                                    <h6 className="fw-bold">About this event</h6>
                                    <p className="text-muted">{selectedEvent.EventDescription || "No description available."}</p>
                                </div>
                            </div>
                            <div className="modal-footer border-0" style={{ backgroundColor: "#f8f9fa" }}>
                                <button className="btn fw-semibold text-white px-4" style={{ backgroundColor: "#711212ff" }} onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Join Modal */}
            {showConfirmModal && eventToJoin && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(255, 255, 255, 0.43)", backdropFilter: "blur(1px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header text-white" style={{ backgroundColor: "#711212ff" }}>
                                <h5 className="modal-title fw-bold">Confirm Join</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleCloseConfirmModal}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <i className="bi bi-question-circle display-4 text-warning"></i>
                                <p className="mt-3 mb-0 fs-5">Are you sure you want to join <b>{eventToJoin.EventName}</b>?</p>
                            </div>
                            <div className="modal-footer border-0 d-flex justify-content-center">
                                <button className="btn btn-secondary px-4" onClick={handleCloseConfirmModal}>Cancel</button>
                                <button className="btn btn-danger px-4" style={{ backgroundColor: "#711212ff" }} onClick={confirmJoinEvent}>Yes, Join</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showJoinModal && joinedEvent && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(3px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header text-white justify-content-center position-relative" style={{ backgroundColor: "#711212ff" }}>
                                <h5 className="modal-title fw-bold"><i className="bi bi-check-circle-fill me-2"></i>Successfully Joined!</h5>
                                <button type="button" className="btn-close btn-close-white position-absolute end-0 me-3" onClick={handleCloseJoinModal}></button>
                            </div>
                            <div className="modal-body p-4 text-center bg-white">
                                <h4 className="fw-bold text-dark mb-3">{joinedEvent.EventName}</h4>
                                <div className="card p-3 mb-3 mx-auto" style={{ maxWidth: '300px', backgroundColor: '#f9f9f9', border: '1px dashed #711212ff' }}>
                                    {qrCodeUrl ? (
                                        <>
                                            <img src={qrCodeUrl} alt="Ticket QR Code" className="img-fluid mb-2" />
                                            <small className="text-muted d-block">Scan this for attendance</small>
                                        </>
                                    ) : <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>Generating...</div>}
                                </div>
                                {user?.email && (
                                    <div className="alert alert-success d-inline-flex align-items-center gap-2 py-2 px-3 mt-2" role="alert">
                                        <i className="bi bi-envelope-check-fill"></i>
                                        <span>A copy of this QR code has been sent to <strong>{user.email}</strong></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ NEW: USER JOINED EVENTS LIST MODAL */}
            {showQrListModal && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(3px)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header text-white" style={{ backgroundColor: "#711212ff" }}>
                                <h5 className="modal-title fw-bold"><i className="bi bi-qr-code-scan me-2"></i>My Event QRs</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowQrListModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 bg-light">
                                <div className="alert alert-info py-2 small mb-3">
                                    <i className="bi bi-info-circle me-2"></i>Click on a QR code to enlarge it.
                                </div>
                                {myJoinedEvents.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {myJoinedEvents.map((item, index) => (
                                            <div key={index} className="card border-0 shadow-sm overflow-hidden">
                                                <div className="card-body d-flex align-items-center justify-content-between p-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1 text-dark">{item.EventName || item.eventName || "Event Name"}</h6>
                                                        <small className="text-muted"><i className="bi bi-calendar me-1"></i>{formatDate(item.EventStartDate || item.eventDate)}</small>
                                                    </div>
                                                    <div className="bg-white p-1 border rounded text-center position-relative" style={{ width: "70px", height: "70px" }}>
                                                        {item.qrCodeUrl || item.qrCodeDataURL ? (
                                                            // ✅ CLICK TO ENLARGE
                                                            <img 
                                                                src={item.qrCodeUrl || item.qrCodeDataURL} 
                                                                alt="QR" 
                                                                style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }} 
                                                                title="Click to Enlarge"
                                                                onClick={() => setEnlargedQrUrl(item.qrCodeUrl || item.qrCodeDataURL)}
                                                            />
                                                        ) : (
                                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted" style={{ fontSize:"0.6rem" }}>
                                                                No QR
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="bi bi-ticket-detailed display-1 text-muted opacity-25"></i>
                                        <p className="text-muted mt-3">You haven't joined any events yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer border-0 bg-white">
                                <button className="btn btn-secondary" onClick={() => setShowQrListModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ NEW: ENLARGED QR MODAL */}
            {enlargedQrUrl && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-transparent border-0 shadow-none">
                            <div className="modal-body p-0 text-center position-relative">
                                {/* Close Button */}
                                <button 
                                    type="button" 
                                    className="btn btn-light rounded-circle shadow position-absolute top-0 end-0 translate-middle-y me-2 mt-n3"
                                    onClick={() => setEnlargedQrUrl(null)}
                                    style={{ width: "40px", height: "40px", zIndex: 10 }}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                                
                                <div className="bg-white p-3 rounded-4 shadow-lg d-inline-block">
                                    <img 
                                        src={enlargedQrUrl} 
                                        alt="Enlarged QR" 
                                        className="img-fluid" 
                                        style={{ minWidth: "280px", maxWidth: "100%", maxHeight: "70vh" }} 
                                    />
                                    <p className="text-muted mt-2 mb-0 small">Show this code at the venue entrance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}