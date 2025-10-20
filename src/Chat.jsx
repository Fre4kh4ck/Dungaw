import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png'
import INSTALOGO from './assets/instalogo.png'
import STAT from './assets/stat.png'
import BG1 from './assets/bg1.jpeg'

export default function Chats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [showChat, setShowChat] = useState(false);

  return (
    <>
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
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 active fw-semibold text-light border-light px-3 py-2"
                href="/home"
              >
                <i className="bi bi-house-door-fill"></i> Home
              </a>

            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/calendar">
                <i className="bi bi-calendar-event-fill"></i> Calendar
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/DepartmentCalendar">
                <i className="bi bi-calendar-event-fill"></i> Dept. Calendar
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events">
                <i className="bi bi-calendar2-event"></i> Events
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/chats" style={{
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}>
                <i className="bi bi-chat-dots-fill" ></i> Chat
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/contactUs">
                <i className="bi bi-telephone-fill"></i> Contact Us
              </a>
            </li>

            <li className="nav-item mb-2 d-flex justify-content-center gap-2">
              <a
                className="nav-link d-flex align-items-center text-light rounded hover-bg p-0"
                href="https://sims.antiquespride.edu.ph/aims/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }}
                  src={UALOGO}
                  alt="UA Logo"
                />
              </a>
              <a
                className="nav-link d-flex align-items-center text-light rounded hover-bg p-0"
                href="https://www.facebook.com/universityofantique"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }}
                  src={FBLOGO}
                  alt="UA Logo"
                />
              </a>

              <a
                className="nav-link d-flex align-items-center text-light rounded hover-bg p-0"
                href="https://www.instagram.com/universityofantique/?fbclid=IwY2xjawMThI5leHRuA2FlbQIxMABicmlkETFMOW9WR05lSk9ueUw5RHBjAR7U41Nmb8qnG_IxwM0zmmnbWLV13iKSy_JXJbqFTwEQSK79Ex9E-oXkSv0lbg_aem_EssSasxkd1zOZ-PRRDld3g#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  style={{ width: '2rem', marginTop: "clamp(14rem, 17vw, 30rem)" }}
                  src={INSTALOGO}
                  alt="UA Logo"
                />
              </a>
            </li>

            <li className="nav-item mb-2 justify-content-center d-flex">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center" href="/login">
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
      </div>

      <div className="container-fluid">
      <div className="row d-flex justify-content-end gap-3">

        {/* LEFT SIDE */}
        <div
          className="col-sm-12 col-md-12 col-lg-4 shadow-lg d-grid justify-content-center"
          style={{
            marginTop: "8rem",
            maxHeight: "46rem",
            overflowY: "auto",
          }}
        >
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="card border-1 p-1 mb-2"
              style={{
                width: "33rem",
                maxWidth: "94vw",
                height: "clamp(19rem, 25vw, 23rem)",
              }}
            >
              <img
                src={BG1}
                className="card-img-top rounded-top-4"
                alt="Mastering First Aid"
              />
              <div className="card-body">
                <p className="text-muted mb-1">Sat, 23 Aug • Café 9:04</p>
                <h5 className="card-title fw-bold">
                  Mastering First Aid Batch 15
                </h5>
                <p className="text-muted mb-2">4+ Interested</p>

                <button
                  className="btn btn-outline-danger d-flex align-items-center gap-2"
                  onClick={() => setShowChat(true)}
                >
                  <i className="bi bi-inbox-fill"></i> View Chats
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE (Desktop only) */}
        <div
          className="col-lg-6 d-none d-lg-block"
          style={{ marginTop: "7rem" }}
        >
          <div className="card shadow-lg border-1" style={{ width: "50rem" }}>
            <div className="card-body" style={{ height: "45.5rem" }}>
              <h5 className="fw-bold">Chat Window</h5>
              <p className="text-muted">Always visible on PC</p>
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            zIndex: 1050,
          }}
        >
          <div
            className="card shadow-lg border-0"
            style={{
              width: "90%",
              maxWidth: "25rem",
              height: "80%",
              borderRadius: "1rem",
            }}
          >
            <div className="card-body d-flex flex-column">
              <button
                className="btn btn-sm btn-outline-secondary align-self-end mb-2"
                onClick={() => setShowChat(false)}
              >
                Close
              </button>
              <h5 className="fw-bold">Chat Window</h5>
              <p className="text-muted">This is the chat area (mobile view).</p>
              <div className="flex-grow-1 border rounded p-2 overflow-auto">
               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
