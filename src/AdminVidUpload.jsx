import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import STAT from './assets/stat.png';
import Loop from './Loop';
import axios from 'axios';
import Tick from './Tick';

// Imports for downloads
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// --- Styles for Upload Zone & Loading Overlay ---
const ReportStyles = () => (
    <style>{`
        .sidebar { transition: all 0.3s ease; }
        .nav-link:hover { background-color: rgba(255, 255, 255, 0.1); }
        .main-content { margin-left: 250px; padding-top: 8rem; transition: all 0.3s ease; }
        @media (max-width: 991.98px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.show { transform: translateX(0); }
            .main-content { margin-left: 0; }
        }
        .upload-zone { 
            border: 2px dashed #711212; 
            background-color: #f8f9fa; 
            cursor: pointer; 
            transition: 0.3s; 
            min-height: 200px;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
        }
        .upload-zone:hover { background-color: #e9ecef; border-color: #5a0e0e; }
        .loading-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.8); z-index: 2000;
            display: flex; justify-content: center; align-items: center; flex-direction: column;
        }
        /* Video Card Styles */
        .video-card { transition: transform 0.2s; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .video-card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }
    `}</style>
);

export default function AdminUploadVideo() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // --- Upload Logic States ---
    const [title, setTitle] = useState('');
    const [college, setCollege] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); 
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showTick, setShowTick] = useState(false); // STATE FOR TICK

    const [videoList, setVideoList] = useState([]);

    // --- ADDED FOR UPDATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState(null);

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:4435/api/videos');
            setVideoList(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // --- ADDED: DELETE HANDLER ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                await axios.delete(`http://localhost:4435/api/videos/${id}`);
                setMessage({ type: 'success', text: 'Video deleted successfully!' });
                fetchVideos();
            } catch (error) {
                setMessage({ type: 'danger', text: 'Failed to delete video.' });
            }
        }
    };

    // --- ADDED: EDIT HANDLER ---
    const handleEditClick = (video) => {
        setIsEditing(true);
        setCurrentVideoId(video.id);
        setTitle(video.title);
        setCollege(video.college);
        setDescription(video.description);
        setPreviewUrl(video.videoBase64);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 35 * 1024 * 1024; 
            if (file.size > maxSize) {
                 setMessage({ type: 'danger', text: 'File is too large! Please use a video under 35MB.' });
                 return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditing && !selectedFile) {
            setMessage({ type: 'danger', text: 'Please select a video file.' });
            return;
        }

        setIsLoading(true);
        setUploadProgress(10); 

        try {
            let base64Video = previewUrl; 
            if (selectedFile) {
                setUploadProgress(30); 
                base64Video = await convertToBase64(selectedFile);
                setUploadProgress(60); 
            }

            const payload = {
                title,
                college,
                description,
                videoBase64: base64Video 
            };

            if (isEditing) {
                await axios.put(`http://localhost:4435/api/videos/${currentVideoId}`, payload);
                setMessage({ type: 'success', text: 'Video updated successfully!' });
            } else {
                await axios.post('http://localhost:4435/api/upload-video', payload);
                setMessage({ type: 'success', text: 'Video successfully stored in database!' });
            }

            setUploadProgress(100);
            setShowTick(true); // SHOW TICK ON SUCCESS

            // AUTO RELOAD AFTER 2 SECONDS
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'danger', text: 'Operation failed. Check console logs.' });
            setIsLoading(false);
        }
    };

    return (
        <>
            <ReportStyles />

            {/* TICK OVERLAY */}
            {showTick && <Tick />}

            {isLoading && !showTick && (
                <div className="loading-overlay">
                    <div className="spinner-border text-danger" style={{width: '3rem', height: '3rem'}} role="status"></div>
                    <h5 className="mt-3 text-danger fw-bold">Processing... {uploadProgress}%</h5>
                </div>
            )}

            <div className='container-fluid p-0'>
                {/* Navbar */}
                <nav className="navbar navbar-dark fixed-top d-flex justify-content-between px-3 shadow-sm"
                    style={{ zIndex: 1050, height: '7rem', paddingTop: '1rem', paddingBottom: '1rem', backgroundColor: '#711212' }}>
                    <div className="d-flex align-items-center">
                        <img src={UALOGO} className="ua-logo me-2" alt="UA logo" style={{ width: "50px" }} />
                        <div className="text-white">
                            <div className="fw-bold ua-text fs-5">University of Antique</div>
                            <div className="smc-text" style={{ fontSize: '0.9rem' }}>Sibalom Main Campus</div>
                        </div>
                    </div>
                    <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                </nav>

                {/* Sidebar */}
                <div className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
                    style={{ width: "250px", zIndex: 1040, backgroundColor: "#711212ff" }}>
                    <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
                        <img src={UALOGO} alt="UA logo" style={{ width: "40px" }} />
                        <div>
                            <div className="fw-bold" style={{ fontSize: "1.1rem" }}>University of Antique</div>
                            <div className="text-muted" style={{ fontSize: "0.85rem" }}>Sibalom Campus</div>
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
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/uploadVideo" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                                <i className="bi bi-upload"></i> Upload Video
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
                            <a className="nav-link text-light px-3 py-2 d-flex align-items-center gap-2" href="/event-scanner">
                                <i className="bi bi-qr-code-scan"></i> Scanner
                            </a>
                        </li>
                        <li className="nav-item mb-2 justify-content-center d-flex" style={{ marginTop: "20rem" }} >
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded text-center" href="/admin">
                                <i className="bi bi-box-arrow-right"></i> Log out
                            </a>
                        </li>
                    </ul>
                    <img src={STAT} alt="Sidebar design" style={{ position: "absolute", bottom: "-4.5rem", left: "50%", transform: "translateX(-55%)", width: "400px", opacity: 0.9, zIndex: -1 }} />
                </div>

                {/* Main Content Area */}
                <main className="main-content px-4 mb-5">
                    <div className="container-fluid">
                        <h2 className="mb-4 text-dark fw-bold border-bottom pb-2">
                            {isEditing ? "Update Promotional Video" : "Upload Promotional Video"}
                        </h2>

                        {message.text && (
                            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                {message.text}
                                <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                            </div>
                        )}

                        <div className="card shadow-sm border-0 mb-5">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Video Title</label>
                                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. CCS Week Highlights" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">College / Department</label>
                                            <select className="form-select" value={college} onChange={(e) => setCollege(e.target.value)} required>
                                                <option value="">Select College...</option>
                                                <option value="CCS">College of Computer Studies</option>
                                                <option value="CBA">College of Business Administration</option>
                                                <option value="CTE">College of Teacher Education</option>
                                                <option value="COE">College of Engineering</option>
                                                <option value="CAS">College of Arts and Sciences</option>
                                                <option value="CCJE">College of Criminal Justice Education</option>
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Video File (Max 35MB)</label>
                                            <div className="upload-zone rounded position-relative">
                                                <input 
                                                    type="file" 
                                                    id="videoInput"
                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
                                                    style={{ cursor: 'pointer' }}
                                                    accept="video/*" 
                                                    onChange={handleFileChange}
                                                    required={!isEditing} 
                                                />
                                                {!previewUrl ? (
                                                    <div className="text-center">
                                                        <i className="bi bi-cloud-arrow-up fs-1 text-secondary"></i>
                                                        <p className="mt-2 text-muted">Click or Drag Video Here</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center w-100">
                                                        <p className="text-success fw-bold mb-2">{selectedFile ? `Selected: ${selectedFile.name}` : 'Current Video'}</p>
                                                        <video src={previewUrl} style={{maxHeight: '200px', borderRadius: '5px'}} controls />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Description</label>
                                            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of the event..."></textarea>
                                        </div>

                                        <div className="col-12 text-end mt-4">
                                            {isEditing && (
                                                <button type="button" className="btn btn-secondary me-2 px-4" onClick={() => {
                                                    setIsEditing(false);
                                                    setTitle('');
                                                    setCollege('');
                                                    setDescription('');
                                                    setPreviewUrl(null);
                                                    setSelectedFile(null);
                                                }}>Cancel</button>
                                            )}
                                            <button type="submit" className="btn btn-lg text-white px-5" disabled={isLoading} style={{ backgroundColor: '#711212' }}>
                                                {isLoading ? 'Processing...' : (isEditing ? 'Update' : 'Upload')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* --- VIDEO LIST SECTION --- */}
                        <div className="mt-5">
                            <h3 className="mb-4 text-dark fw-bold border-bottom pb-2">
                                <i className="bi bi-collection-play me-2"></i> Recently Uploaded Videos
                            </h3>

                            {videoList.length === 0 ? (
                                <div className="text-center py-5 bg-light rounded">
                                    <i className="bi bi-camera-video-off fs-1 text-muted"></i>
                                    <p className="text-muted mt-2">No videos uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {videoList.map((video, index) => (
                                        <div className="col-md-6 col-lg-4" key={index}>
                                            <div className="card video-card h-100">
                                                <div className="ratio ratio-16x9">
                                                    <video 
                                                        src={video.videoBase64} 
                                                        controls 
                                                        className="card-img-top"
                                                        style={{ objectFit: 'cover', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <span className="badge bg-danger">{video.college}</span>
                                                    </div>
                                                    <h5 className="card-title fw-bold text-dark">{video.title}</h5>
                                                    <p className="card-text text-muted small">
                                                        {video.description || "No description provided."}
                                                    </p>
                                                    <div className="d-flex gap-2 mt-3">
                                                        <button className="btn btn-sm btn-outline-primary flex-grow-1" onClick={() => handleEditClick(video)}>
                                                            <i className="bi bi-pencil"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger flex-grow-1" onClick={() => handleDelete(video.id)}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}