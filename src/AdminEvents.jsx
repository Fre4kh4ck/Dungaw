import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png';
import INSTALOGO from './assets/instalogo.png';
import STAT from './assets/stat.png';

export default function AdminHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const submitData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("time", e.target.time.value);
    formData.append("date", e.target.date.value);
    formData.append("venue", e.target.venue.value);
    formData.append("description", e.target.description.value);
    formData.append("photo", e.target.photo.files[0]);
    formData.append("dept", e.target.dept.value); 

    try {
      await axios.post("http://dungaw.ua:4435/addevent/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Event added successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to add event");
    }
  };

  return (
    <>
      <div className='container-fluid'>
        {/* 🔴 Navbar */}
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

        {/* 🔴 Sidebar */}
        <div
          className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""}`}
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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded"
                href="/adminEvents" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                <i className="bi bi-calendar2-event"></i> Events
              </a>
            </li>
            <li className="nav-item mb-5">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded" href="/accounts">
                <i className="bi bi-people-fill"></i> Accounts
              </a>
            </li>
            <li className="nav-item mb-2 d-flex justify-content-center gap-2">
              <a className="nav-link p-0" href="https://sims.antiquespride.edu.ph/aims/" target="_blank" rel="noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(16rem, 19vw, 25rem)" }} src={UALOGO} alt="UA Logo" />
              </a>
              <a className="nav-link p-0" href="https://www.facebook.com/universityofantique" target="_blank" rel="noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(16rem, 19vw, 25rem)" }} src={FBLOGO} alt="FB Logo" />
              </a>
              <a className="nav-link p-0" href="https://www.instagram.com/universityofantique/" target="_blank" rel="noreferrer">
                <img style={{ width: '2rem', marginTop: "clamp(16rem, 19vw, 25rem)" }} src={INSTALOGO} alt="IG Logo" />
              </a>
            </li>
            <li className="nav-item mb-2 justify-content-center d-flex">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded text-center" href="/login">
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

        
        <div className="col-sm-12 d-flex justify-content-end mt-5">
          <div
            className="ms-0 ms-md-5 w-100"
            style={{
              marginLeft: '250px',
              paddingTop: '8rem',
              paddingRight: '2rem',
              paddingLeft: '2rem',
              maxWidth: '1400px'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark">Submit Event</h3>
            </div>

            <div className="card shadow-sm border-0 mb-4 w-100">
              <div className="card-body">
                <form onSubmit={submitData}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Event Title</label>
                      <input type="text" className="form-control" name="title" placeholder="Enter event title" required />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Date</label>
                      <input type="date" className="form-control" name="date" required />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Time</label>
                      <input type="time" className="form-control" name="time" required />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">Venue</label>
                      <input type="text" className="form-control" name="venue" placeholder="Enter venue" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">Department</label>
                      <select className="form-select" name="dept" required>
                        <option value="">Select Department</option>
                        <option value="CITCS">UA CAMPUS</option>
                        <option value="COE">CTE</option>
                        <option value="CAS">CAS</option>
                        <option value="CAF">CEA</option>
                        <option value="CBA">CCIS</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <textarea className="form-control" name="description" placeholder="Enter event description" rows="3" required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Event Photo</label>
                    <input type="file" className="form-control" accept="image/*" name="photo" required />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-danger px-4 py-2 fw-bold"
                      style={{ backgroundColor: '#711212ff', border: 'none' }}
                    >
                      <i className="bi bi-send-fill me-2"></i> Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
