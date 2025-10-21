import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import CCSMP4 from './assets/CCSVid.mp4';
import FBLOGO from './assets/fblogo.png'
import INSTALOGO from './assets/instalogo.png'
import STAT from './assets/stat.png'
import CCSLOGO from './assets/CCSLOGO.png'
import BG2 from './assets/bg2.jpg'
import CBALOGO from './assets/CBALOGO.png'
import { useNavigate } from 'react-router-dom';
import CCSVID from './assets/CCSMP4.mp4'
import HMVID from './assets/HMVID.mp4'
import axios from 'axios';
import Loop from './Loop'



export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate()
  const [data, sendData] = useState([]);


  const viewMore = () => {
    navigate('/events');
  }


  const FetchEvents = async () => {
    try {
      const res = await axios.get("http://dungaw.ua:4435/events");
      sendData(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    FetchEvents();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const events = [
    { date: new Date(2025, 7, 20), type: "school" },
    { date: new Date(2025, 7, 25), type: "personal" },
    { date: new Date(2025, 7, 31), type: "important" }
  ];


  const getEventType = (date) => {
    const found = events.find(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
    return found ? found.type : null;
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
  };

  const handleDateChange = (value) => {
    setDate(value);
    setSelectedEvents(getEventsForDate(value));
  };

  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    setSelectedEvents(getEventsForDate(new Date()));
  }, []);

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
          style={{ width: '250px', zIndex: 1040, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', backgroundColor: '#711212ff', position: 'relative', overflow: 'hidden' }}
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
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events">
                <i className="bi bi-calendar2-event"></i> Events
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/chats">
                <i className="bi bi-chat-dots-fill"></i> Chat
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
        <div className="row justify-content-end" style={{ marginTop: 'clamp(8rem, 10vw, 9.3rem)' }}>
          <div className="col-sm-12 col-md-10 col-lg-10 me-lg-3 " style={{ overflow: "hidden", maxWidth: "100rem", marginRight: "0" }}>
            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={BG2} className="d-block w-100 rounded-4" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={BG2} className="d-block w-100 rounded-4" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={BG2} className="d-block w-100 rounded-4" alt="..." />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid"  >
        <div className="row justify-content-end mt-lg-5" style={{ marginTop: '2rem' }}>
          <div className="col-sm-12 col-md-6 col-lg-6">

            <div className="mt-lg-5" style={{ marginTop: "2rem", marginBottom: "2rem", fontWeight: "bold", fontFamily: "San-Serif" }}><h1>DISCOVER DIFFERENT COURSES</h1></div>

            <div className="container my-4">
              <div className="row g-4">

                {/* Card 1 */}
                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#9d0504",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    ></div>
                    <video
                      src={CCSVID}
                      controls
                      style={{ width: "100%", borderRadius: "0 0 16px 16px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={CCSLOGO}
                        alt=""
                        style={{ width: "3rem", marginRight: "0.75rem" }}
                      />
                      <p className="card-text mb-0">
                        CCIS
                      </p>

                      <div className="btn-group ms-4 border border-card rounded">
                        <button className="btn btn-bs-light btn-sm " type="button" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#exampleModal"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>

                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabIndex="-1"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

                              {/* Header */}
                              <div>
                                <button
                                  type="button"
                                  className="btn-close btn-close-white"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                  color="danger"
                                ></button>
                              </div>

                              {/* Body */}
                              <div
                                className="modal-body p-5"
                                style={{
                                  background:
                                    "linear-gradient(145deg, #ffffff, #f7f5f5 90%)",
                                }}
                              >
                                <div
                                  className="p-4 rounded-4"
                                  style={{
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderLeft: "6px solid #7a1113",
                                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <h4
                                    className="fw-bold mb-3"
                                    style={{ color: "#7a1113", letterSpacing: "0.5px" }}
                                  >
                                    College of Computing and Information Sciences (CCIS)
                                  </h4>

                                  <p
                                    className="fs-6 text-secondary mb-3"
                                    style={{ lineHeight: "1.8", textAlign: "justify" }}
                                  >
                                    At the <strong>College of Computing and Information Sciences</strong>,
                                    innovation starts with you. Step into the world of technology, where
                                    ideas become systems, and passion turns into progress.
                                  </p>

                                  <p
                                    className="fs-6 text-secondary mb-3"
                                    style={{ lineHeight: "1.8", textAlign: "justify" }}
                                  >
                                    From programming and cybersecurity to data science and AI, we
                                    prepare you to lead the digital age.{" "}
                                    <span className="fw-semibold" style={{ color: "#7a1113" }}>
                                      Think smart. Code bold. Innovate without limits.
                                    </span>
                                  </p>

                                  <div className="text-end mt-4">
                                    <span
                                      className="fw-bold"
                                      style={{ color: "#7a1113", fontSize: "1.05rem" }}
                                    >
                                      The future is written in code — and it begins here, at CCIS. 🚀
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer */}
                              <div
                                className="modal-footer d-flex justify-content-between align-items-center px-4"
                                style={{
                                  backgroundColor: "#faf9f7",
                                  borderTop: "2px solid rgba(0,0,0,0.05)",
                                }}
                              >
                                <small className="text-muted">
                                  © 2025 University of Antique — College of Computing and Information Sciences
                                </small>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger px-4 fw-semibold"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>

                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#9d0504", // red accent line
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    ></div>
                    <video
                      src={HMVID}
                      controls
                      style={{ width: "100%", borderRadius: "0 0 16px 16px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={CBALOGO}
                        alt=""
                        style={{ width: "2.8rem", marginRight: "0.75rem" }}
                      />
                      <p className="card-text mb-0">
                        CBA
                      </p>
                      <div className="btn-group ms-4 border border-card rounded">
                        <button className="btn btn-bs-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#9d0504", // red accent line
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    ></div>
                    <video
                      src={CCSMP4}
                      controls
                      style={{ width: "100%", borderRadius: "0 0 16px 16px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={CCSLOGO}
                        alt=""
                        style={{ width: "3rem", marginRight: "0.75rem" }}
                      />
                      <p className="card-text mb-0">
                        CCIS
                      </p>
                      <div className="btn-group ms-4 border border-card rounded">
                        <button className="btn btn-bs-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#9d0504", // red accent line
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    ></div>
                    <video
                      src={CCSMP4}
                      controls
                      style={{ width: "100%", borderRadius: "0 0 16px 16px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={CCSLOGO}
                        alt=""
                        style={{ width: "3rem", marginRight: "0.75rem" }}
                      />
                      <p className="card-text mb-0">
                        CCIS
                      </p>
                      <div className="btn-group ms-4 border border-card rounded">
                        <button className="btn btn-bs-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0" style={{ borderRadius: "16px" }}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#9d0504", // red accent line
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    ></div>
                    <video
                      src={CCSMP4}
                      controls
                      style={{ width: "100%", borderRadius: "0 0 16px 16px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={CCSLOGO}
                        alt=""
                        style={{ width: "3rem", marginRight: "0.75rem" }}
                      />
                      <p className="card-text mb-0">
                        CCIS
                      </p>
                      <div className="btn-group ms-4 border border-card rounded">
                        <button className="btn btn-bs-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
                  <button onClick={viewMore}
                    className="btn-bs-light d-flex align-items-center justify-content-center text-center mt-lg-5"
                    style={{
                      width: "clamp(120px, 30vw, 120px)",
                      height: "clamp(50px, 6vw, 60px)",
                      border: "1px solid #e6e6e6ff",
                      borderRadius: "8px",
                      fontSize: "clamp(0.7rem, 1vw, 1rem)",
                      lineHeight: "1rem",
                      transition: "all 0.3s ease-in-out"

                    }}
                  >
                    View more
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="container d-flex justify-content-center" style={{ marginBottom: "5rem" }}>
              <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>



                {/* Calendar */}
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  tileContent={({ date, view }) => {
                    const type = view === "month" ? getEventType(date) : null;
                    return type ? <div className={`event-dot ${type}`}></div> : null;
                  }}
                />

                {/* Selected Date */}
                <p className="text-center mt-3">
                  <strong>Selected:</strong> {date.toDateString()}
                </p>

                {/* Event Details */}
                {selectedEvents.length > 0 ? (
                  <div className="event-list mt-3">
                    <h6>📌 Events:</h6>
                    <ul>
                      {selectedEvents.map((event, index) => (
                        <li key={index} className={`event-item ${event.type}`}>
                          <span className="dot asdas"></span> {event.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-center text-muted mt-3">No events today.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-start mt-5 mb-5">
          {/* ====== EVENTS CARD SECTION (LEFT SIDE) ====== */}
          <div className="col-sm-12 col-md-6 col-lg-4 d-flex flex-column align-items-start">
            <h1 className="mb-4 mt-sm-5" style={{ fontFamily: 'sanSerif'}}>Upcoming Events</h1>

            {data && data.length > 0 ? (
              data.slice(0, 3).map((event, index) => (
                <div key={index} className="w-100 d-flex justify-content-start mb-4">
                  <div className="card shadow-lg border-0 rounded-4" style={{ width: "22rem" }}>
                    <img
                      src={event.EventPhoto}
                      className="card-img-top rounded-top-4"
                      alt={event.EventName}
                      height={100}
                    />
                    <div className="card-body">
                      <p className="text-muted mb-1">
                        {new Date(event.EventDate).toDateString()} • {event.EventVenue},{" "}
                        {event.EventTime}
                      </p>
                      <h5 className="card-title fw-bold">{event.EventName}</h5>
                      <p className="text-muted mb-2">4+ Interested</p>
                      <a href="#" className="btn btn-outline-danger d-flex align-items-center gap-2">
                        <i className="bi bi-people-fill"></i> Join
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>Loading...</h1>
            )}
          </div>


          <div
            className="col-sm-12 col-md-6 col-lg-4 text-start d-flex justify-content-center flex-column"
            style={{ fontFamily: "San-Serif" }}
          >
            <h1>
              <a style={{ fontSize: "5rem" }}>DUNGAW</a>
              <br />
              Web System
              <br />
              <br />
              <a style={{ fontSize: "1.5rem" }}>
                Smart Campus companion. Stay updated with events,
                <br />
                discover course promotions, get instant help through
                <br />
                everything you need, all in one place our built-in chat.
              </a>
            </h1>
          </div>
        </div>
      </div>


      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12" style={{ padding: "none" }}>
            <footer
              style={{
                height: "clamp(10rem, 15vw, 20rem)",
                transform: "translateX(-0.7rem)",
                width: "100vw",
                backgroundColor: "#711212ff",
              }}
            ></footer>
          </div>
        </div>
      </div>


    </>
  );
}
