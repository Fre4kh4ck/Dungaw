import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import STAT from './assets/stat.png';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Scanner() {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");

    // --- ✅ NEW STATE VARIABLES ---
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [scanMode, setScanMode] = useState("IN"); // Default is "Time In"

    // Lock reference
    const isProcessingRef = useRef(false);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // --- ✅ 1. FETCH EVENTS ON LOAD ---
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // This gets the list for your dropdown
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
                setVerificationResult("Error: Could not load event list.");
                setVerificationStatus("error");
            }
        };
        fetchEvents();
    }, []);

    // --- ✅ 2. UPDATED SCANNER LOGIC ---
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-scanner",
            { qrbox: { width: 250, height: 250 }, fps: 10 },
            false
        );

        async function onScanSuccess(decodedText) {
            // Check Lock
            if (isProcessingRef.current) return;

            // Check if Event is Selected
            if (!selectedEventId) {
                setVerificationResult("⚠️ Please select an event from the list first.");
                setVerificationStatus("warning");
                return;
            }

            // Lock Process
            isProcessingRef.current = true;

            if (scanner && scanner.getState() === 2) {
                scanner.pause();
            }

            setIsLoading(true);
            setVerificationResult("");
            setVerificationStatus("");

            try {
                const qrData = JSON.parse(decodedText);

                // ✅ CONFLICT CHECK: Does Ticket Event ID match Selected Event ID?
                if (String(qrData.eventId) !== String(selectedEventId)) {
                    throw { 
                        customError: true, 
                        message: "❌ CONFLICT: This ticket belongs to a different event.", 
                        status: "error" 
                    };
                }

                // ✅ SEND REQUEST WITH 'type' (IN or OUT)
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/verify-ticket`, {
                    email: qrData.email,
                    eventId: qrData.eventId,
                    ticketId: qrData.ticketId,
                    type: scanMode // <--- Sending 'IN' or 'OUT' to backend
                });

                const { message, email, status, time } = response.data;
                let timeString = time ? ` at ${new Date(time).toLocaleTimeString()}` : "";
                
                setVerificationResult(`${message} (User: ${email})${timeString}`);
                setVerificationStatus(status);

            } catch (err) {
                if (err.customError) {
                    setVerificationResult(err.message);
                    setVerificationStatus(err.status);
                } else if (err.response) {
                    setVerificationResult(err.response.data.message);
                    setVerificationStatus(err.response.data.status || "error");
                } else if (err instanceof SyntaxError) {
                    setVerificationResult("Invalid QR Code.");
                    setVerificationStatus("error");
                } else {
                    setVerificationResult("Scan failed. Please try again.");
                    setVerificationStatus("error");
                }
            } finally {
                setIsLoading(false);
                setTimeout(() => {
                    if (scanner && scanner.getState() === 3) {
                        scanner.resume();
                    }
                    isProcessingRef.current = false;
                }, 2000);
            }
        }

        function onScanFailure(error) {
            // ignore
        }

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner on unmount.", error);
            });
        };
    }, [selectedEventId, scanMode]); // ✅ Re-run if Event or Mode changes

    const getAlertClass = () => {
        if (verificationStatus === 'success') return 'alert-success';
        if (verificationStatus === 'warning') return 'alert-warning';
        if (verificationStatus === 'error') return 'alert-danger';
        return 'd-none';
    };

    return (
        <>
            {/* ------------------------------------------------------------------- */}
            {/* ------------------- NAVBAR AND SIDEBAR (UNCHANGED) ----------------- */}
            {/* ------------------------------------------------------------------- */}
            <div className='container-fluid'>
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

                <div
                    className={` border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
                    style={{ width: '250px', zIndex: 1040, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', backgroundColor: '#711212ff' }}
                >
                    <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <img src={UALOGO} alt="UA logo" style={{ width: '40px' }} />
                        <div>
                            <div className="fw-bold" style={{ fontSize: '1.1rem' }}>University of Antique</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Sibalom Campus</div>
                        </div>
                    </div>

                    <ul className="nav flex-column mt-5 px-3">
                        <li className="nav-item mb-3">
                            <a className="nav-link text-light d-flex align-items-center gap-2 px-3 py-2 rounded" href="/adminEvents">
                                <i className="bi bi-calendar2-event"></i> Events
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a className="nav-link text-light d-flex align-items-center gap-2 px-3 py-2 rounded" href="/accounts">
                                <i className="bi bi-people-fill"></i> Accounts
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/userAccounts">
                                <i className="bi bi-google"></i> User Accounts
                            </a>
                        </li>
                        <li className="nav-item mb-3">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/manageEvents">
                                <i className="bi bi-collection"></i> Manage Events
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/admin-reports">
                                <i className="bi bi-file-earmark-bar-graph"></i> Event Reports
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link text-light px-3 py-2 d-flex align-items-center gap-2" href="/event-scanner"
                                style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                                <i className="bi bi-qr-code-scan"></i> Scanner
                            </a>
                        </li>
                        <li className="nav-item mb-2 justify-content-center d-flex" style={{ marginTop: "20rem" }}>
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center" href="/login">
                                <i className="bi bi-box-arrow-right"></i> Log out
                            </a>
                        </li>
                    </ul>

                    <img src={STAT} alt="Sidebar design"
                        style={{ position: "absolute", bottom: "-4.5rem", left: "50%", transform: "translateX(-55%)", width: "400px", opacity: 0.9, zIndex: -1, pointerEvents: "none" }}
                    />
                </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* ------------------- MAIN CONTENT AREA ----------------------------- */}
            {/* ------------------------------------------------------------------- */}
            <div className="container-fluid"
                style={{
                    marginTop: '7rem',
                    marginLeft: isLargeScreen ? "250px" : "0",
                    transition: "all 0.3s ease-in-out",
                    padding: "2rem 2rem 2rem 10rem"
                }}
            >
                <div className="row">
                    <div className="col-lg-8 col-md-10">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header text-white" style={{ backgroundColor: "#711212ff" }}>
                                <h4 className="mb-0 fw-bold"><i className="bi bi-qr-code-scan me-2"></i>Event Attendance Scanner</h4>
                            </div>
                            <div className="card-body p-4 text-center">

                                {/* ✅ 1. EVENT SELECTION DROPDOWN */}
                                <div className="mb-3 text-start">
                                    <label className="form-label fw-bold text-muted">Select Active Event:</label>
                                    <select 
                                        className="form-select border-danger" 
                                        value={selectedEventId}
                                        onChange={(e) => {
                                            setSelectedEventId(e.target.value);
                                            setVerificationResult(""); 
                                            setVerificationStatus("");
                                        }}
                                    >
                                        <option value="">-- Choose Event --</option>
                                        {events.map((ev) => (
                                            <option key={ev.EventID} value={ev.EventID}>
                                                {ev.EventName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* ✅ 2. SCAN MODE RADIO BUTTONS (IN / OUT) */}
                                <div className="mb-4 text-start p-3 rounded bg-light border">
                                    <label className="form-label fw-bold text-muted d-block">Scan Mode:</label>
                                    <div className="btn-group w-100" role="group">
                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="scanMode" 
                                            id="modeIn" 
                                            autoComplete="off"
                                            checked={scanMode === "IN"}
                                            onChange={() => setScanMode("IN")}
                                        />
                                        <label className="btn btn-outline-success fw-bold" htmlFor="modeIn">
                                            <i className="bi bi-box-arrow-in-right me-2"></i> TIME IN
                                        </label>

                                        <input 
                                            type="radio" 
                                            className="btn-check" 
                                            name="scanMode" 
                                            id="modeOut" 
                                            autoComplete="off"
                                            checked={scanMode === "OUT"}
                                            onChange={() => setScanMode("OUT")}
                                        />
                                        <label className="btn btn-outline-danger fw-bold" htmlFor="modeOut">
                                            <i className="bi bi-box-arrow-right me-2"></i> TIME OUT
                                        </label>
                                    </div>
                                    <small className="text-muted mt-2 d-block text-center">
                                        Current Mode: <span className={scanMode === "IN" ? "text-success fw-bold" : "text-danger fw-bold"}>
                                            {scanMode === "IN" ? "LOGGING IN" : "LOGGING OUT"}
                                        </span>
                                    </small>
                                </div>

                                {/* SCANNER */}
                                <div id="qr-scanner" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>

                                <hr className="my-4" />

                                <h5 className="text-muted">Scan Result</h5>
                                {isLoading ? (
                                    <div className="spinner-border text-danger" role="status">
                                        <span className="visually-hidden">Verifying...</span>
                                    </div>
                                ) : (
                                    <div className={`alert ${getAlertClass()} fw-bold fs-5 mt-3`} role="alert">
                                        {verificationResult || "Select event and mode to start..."}
                                    </div>
                                )}
                                <button
                                    className="btn text-white fw-semibold px-4 mt-3"
                                    style={{ backgroundColor: "#711212ff" }}
                                    onClick={() => window.location.reload()}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>Reset Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}