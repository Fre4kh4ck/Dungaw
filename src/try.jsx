import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Optional: Import your logos/styles if this is your main Home file
import "../css/style.css"; 

export default function Try() {
    const [latestVideo, setLatestVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH VIDEO LOGIC ---
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                // ✅ Make sure the port matches your backend (4435)
                const response = await axios.get('http://localhost:4435/api/latest-video');

                if (response.data.success) {
                    console.log("Video fetched:", response.data.data); // Check console to see if it works
                    setLatestVideo(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching video:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, []);

    return (
        <div className="container-fluid p-4">
            
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h1 className="fw-bold text-dark">Welcome to University of Antique</h1>
                    <p className="text-muted">Sibalom Main Campus</p>
                </div>
            </div>

            {/* --- VIDEO SECTION START --- */}
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="card shadow border-0 overflow-hidden">
                        
                        {/* 1. Loading State */}
                        {loading && (
                            <div className="text-center py-5 bg-light">
                                <div className="spinner-border text-danger" role="status"></div>
                                <p className="mt-2 text-muted fw-bold">Loading Campus Updates...</p>
                            </div>
                        )}

                        {/* 2. Video Player */}
                        {!loading && latestVideo && (
                            <>
                                <div className="ratio ratio-16x9 bg-black">
                                    {/* ⚠️ CRITICAL: 
                                      We use 'latestVideo.video_data' because that is the column name 
                                      shown in your database screenshot. 
                                    */}
                                    <video 
                                        controls 
                                        autoPlay 
                                        muted 
                                        src={latestVideo.video_data} 
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className="card-title fw-bold mb-0 text-danger">{latestVideo.title}</h4>
                                        <span className="badge bg-danger">{latestVideo.college}</span>
                                    </div>
                                    <p className="card-text text-secondary">{latestVideo.description}</p>
                                    <small className="text-muted">
                                        Posted on: {new Date(latestVideo.uploaded_at || Date.now()).toLocaleDateString()}
                                    </small>
                                </div>
                            </>
                        )}

                        {/* 3. Empty State (No video found) */}
                        {!loading && !latestVideo && (
                            <div className="text-center py-5 bg-light">
                                <i className="bi bi-camera-video-off fs-1 text-muted"></i>
                                <p className="mt-2 text-muted">No promotional videos available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* --- VIDEO SECTION END --- */}

        </div>
    );
}