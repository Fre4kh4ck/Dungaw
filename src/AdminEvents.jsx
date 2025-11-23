import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-calendar/dist/Calendar.css";
import UALOGO from './assets/Ualogo.png';
import STAT from './assets/stat.png';
import { useNavigate } from "react-router-dom"; 

export default function AdminHome() {
    // --- STATE ---
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [submittedEvents, setSubmittedEvents] = useState([]);
    const [approvedEvents, setApprovedEvents] = useState([]);
    const [deniedEvents, setDeniedEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("submitted");
    const navigate = useNavigate();

    // --- 1. GET CURRENT ROLE ---
    const rawRole = localStorage.getItem('role');
    const role = rawRole ? rawRole.trim().toLowerCase() : '';

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // --- 2. FETCH EVENTS ---
    const fetchEvents = async () => {
        const statuses = ["submitted", "approved", "denied"];
        for (const status of statuses) {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/status/${status}`);
                if (status === "submitted") setSubmittedEvents(data);
                else if (status === "approved") setApprovedEvents(data);
                else setDeniedEvents(data);
            } catch (error) {
                console.error(`Error fetching ${status} events`, error);
            }
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // --- 3. HANDLE ADMIN BUTTON CLICK ---
    const handleAdminClick = (e) => {
        e.preventDefault(); 
        if (role === 'admin') {
            navigate('/accounts'); 
        } else {
            alert("⛔ Access Denied: Only the Super Admin can manage accounts."); 
        }
    };

    // --- 4. SUBMIT DATA ---
    const submitData = async (e) => {
        e.preventDefault();
        const file = e.target.photo.files[0];

        if (file) {
            const fileType = file.type;
            const fileName = file.name.toLowerCase();
            if (fileType !== "image/jpeg" && !fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg")) {
                alert("❌ Only JPEG or JPG files are allowed!");
                return;
            }
        }

        const formData = new FormData();
        formData.append("title", e.target.title.value);
        formData.append("time", e.target.time.value);
        formData.append("startDate", e.target.startDate.value);
        formData.append("endDate", e.target.endDate.value);
        formData.append("venue", e.target.venue.value);
        formData.append("description", e.target.description.value);
        formData.append("photo", file);
        formData.append("dept", e.target.dept.value);

        const eventStatus = (role === 'admin') ? 'approved' : 'submitted';
        formData.append("status", eventStatus);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/events/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            if(role === 'admin') {
                alert("✅ Event Created and Auto-Approved!");
            } else {
                alert("✅ Event Submitted for Review!");
            }
            
            e.target.reset();
            fetchEvents(); // Refresh the lists
        } catch (err) {
            console.error("Upload error:", err);
            alert("❌ Failed to add event");
        }
    };

    // --- RENDER HELPER FOR EVENTS ---
    const renderEvents = (events) => (
        <div className="row">
            {events.length > 0 ? (
                events.map((event) => {
                    const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
                    let dateDisplay = "";

                    if (event.EventStartDate) {
                        const startDate = new Date(event.EventStartDate).toLocaleDateString('en-US', formatOptions);
                        dateDisplay = startDate;
                        if (event.EventEndDate && event.EventEndDate !== event.EventStartDate) {
                            const endDate = new Date(event.EventEndDate).toLocaleDateString('en-US', formatOptions);
                            dateDisplay = `${startDate} - ${endDate}`;
                        }
                    }

                    return (
                        // RESPONSIVE FIX: Added col-12 so it takes full width on phone
                        <div key={event.EventID} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100 border-0">
                                <div style={{ position: 'relative', height: '200px' }}>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/api/upload/${event.EventPhoto}`}
                                        alt="Event"
                                        className="card-img-top"
                                        style={{ height: "100%", width: "100%", objectFit: "cover", borderTopLeftRadius: 'calc(0.375rem - 1px)', borderTopRightRadius: 'calc(0.375rem - 1px)' }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <span className="badge bg-light text-dark shadow-sm opacity-90">
                                            {event.EventDept}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-dark mb-3">{event.EventName}</h5>
                                    
                                    <div className="mb-3 small text-secondary">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-calendar-event me-2 text-danger"></i>
                                            <span>{dateDisplay}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-clock me-2 text-danger"></i>
                                            <span>{event.EventTime}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-geo-alt me-2 text-danger"></i>
                                            <span>{event.EventVenue}</span>
                                        </div>
                                    </div>

                                    {event.EventDenialReason && (
                                        <div className="mt-auto p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25">
                                            <small className="text-danger d-block fw-bold">Reason for Denial:</small>
                                            <small className="text-danger">{event.EventDenialReason}</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-12 text-center py-5 text-muted">
                    <i className="bi bi-calendar-x fs-1 mb-2 d-block opacity-50"></i>
                    No events found in this category.
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className='container-fluid' style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
                {/* Navbar */}
                <nav
                    className="navbar navbar-dark fixed-top d-flex justify-content-between px-3"
                    style={{ zIndex: 1050, height: '7rem', paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: '#711212ff' }}
                >
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
                <div
                    className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
                    style={{ 
                        width: '250px', 
                        zIndex: 1040, 
                        boxShadow: '2px 0 10px rgba(0,0,0,0.1)', 
                        backgroundColor: '#711212ff',
                        // RESPONSIVE FIX: If on phone and closed, move it left. If open, show it.
                        left: (window.innerWidth < 992 && !sidebarOpen) ? '-250px' : '0',
                        transition: 'left 0.3s ease-in-out'
                    }}
                >

                    {/* RESPONSIVE FIX: Added 'flex-grow-1' to make the list take available space */}
                    <ul className="nav flex-column mt-5 px-3 flex-grow-1">
                        
                        {/* Events Button with 8rem margin top */}
                        <li className="nav-item mb-3" style={{ marginTop: '8rem' }}>
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded"
                                href="/adminEvents" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                                <i className="bi bi-calendar2-event"></i> Events
                            </a>
                        </li>

                        <li className="nav-item mb-3">
                            <a
                                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded"
                                href="#"
                                onClick={handleAdminClick} 
                                style={{ cursor: "pointer" }}
                            >
                                <i className="bi bi-people-fill"></i> Admin (Accounts)
                            </a>
                        </li>

                        <li className="nav-item mt-2">
                            <small className="text-white-50 ms-3">
                                Role: {role || 'Guest'}
                            </small>
                        </li>

                        {/* --- FIX: Removed 'mt-auto' and 'marginBottom' --- */}
                        {/* --- Added 'mt-5' to position it just below the content instead of at the bottom --- */}
                        <li className="nav-item mb-2 justify-content-center d-flex" style={{ marginTop: '26rem' }}>
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded text-center" href="/admin">
                                <i className="bi bi-box-arrow-right"></i> Log out
                            </a>
                        </li>
                    </ul>
                    <img
                        src={STAT}
                        alt="Sidebar design"
                        style={{
                            position: "absolute",
                            bottom: "-4.5rem",
                            left: "50%",
                            transform: "translateX(-55%)",
                            width: "400px",
                            opacity: 0.9,
                            zIndex: -1,
                            pointerEvents: "none"
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="col-sm-12 d-flex justify-content-end mt-5">
                    <div
                        className="ms-0 ms-md-5 w-100"
                        style={{
                            marginLeft: window.innerWidth >= 992 ? '250px' : '0', // Responsive margin
                            paddingTop: '8rem',
                            paddingRight: '2rem',
                            paddingLeft: '2rem',
                            maxWidth: '1400px'
                        }}
                    >
                        {/* Add Event Card */}
                        <div className="card shadow-sm border-0 mb-5">
                            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                                <h3 className="fw-bold text-dark m-0">
                                    <i className="bi bi-plus-circle-fill me-2 text-success"></i>
                                    Create New Event
                                </h3>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={submitData}>
                                    <div className="row g-3">
                                        {/* RESPONSIVE FIX: Added col-12 to all inputs below so they stack on mobile */}
                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Event Title</label>
                                            <input type="text" className="form-control bg-light border-0" name="title" placeholder="Enter event title" required />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Start Date</label>
                                            <input type="date" className="form-control bg-light border-0" name="startDate" required />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">End Date <span className="fw-normal text-muted text-lowercase">(optional)</span></label>
                                            <input type="date" className="form-control bg-light border-0" name="endDate" />
                                        </div>
                                        
                                        <div className="col-12 col-md-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Venue</label>
                                            <input type="text" className="form-control bg-light border-0" name="venue" placeholder="Campus Venue" required />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Department</label>
                                            <select className="form-select bg-light border-0" name="dept" required>
                                                <option value="">Select Department</option>
                                                <option value="UA">UA</option>
                                                <option value="CCIS">CCIS</option>
                                                <option value="CBA">CBA</option>
                                                <option value="CTE">CTE</option>
                                                <option value="CCJE">CCJE</option>
                                                <option value="CAS">CAS</option>
                                                <option value="CEA">CEA</option>
                                                <option value="CCMS">CMS</option>
                                                <option value="CIT">CIT</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Time</label>
                                            <input type="time" className="form-control bg-light border-0" name="time" required />
                                        </div>
                                        <div className="col-12 col-md-3">
                                             <label className="form-label fw-bold small text-uppercase text-muted">Cover Photo</label>
                                             <input type="file" className="form-control bg-light border-0" accept=".jpg, .jpeg, image/jpeg" name="photo" required />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
                                            <textarea className="form-control bg-light border-0" name="description" placeholder="Write a brief description..." rows="3" required />
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
                                            style={{ backgroundColor: '#711212', borderColor: '#711212' }}
                                        >
                                            <i className="bi bi-send-fill me-2"></i> 
                                            {role === 'admin' ? 'Create & Approve' : 'Submit for Review'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* View Events Section */}
                        <div className="card shadow-sm border-0 mb-5">
                             <div className="card-header bg-white border-bottom pt-4 px-4 pb-0">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="fw-bold text-dark m-0">Event Dashboard</h4>
                                </div>
                                <ul className="nav nav-tabs card-header-tabs">
                                    {["submitted", "approved", "denied"].map((tab) => (
                                        <li className="nav-item" key={tab}>
                                            <button
                                                className={`nav-link border-0 ${activeTab === tab ? "active fw-bold text-primary border-bottom border-primary border-3" : "text-muted"}`}
                                                style={activeTab === tab ? { color: '#711212', borderColor: '#711212' } : {}}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="card-body p-4 bg-light bg-opacity-25">
                                {activeTab === "submitted" && renderEvents(submittedEvents)}
                                {activeTab === "approved" && renderEvents(approvedEvents)}
                                {activeTab === "denied" && renderEvents(deniedEvents)}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}