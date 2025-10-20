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
import { useNavigate } from 'react-router-dom';



export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate()

  const viewMore = () => {
    navigate('/events');
  }

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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/chats">
                <i className="bi bi-chat-dots-fill"></i> Chat
              </a>
            </li>
            <li className="nav-item">
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
                        <button className="btn btn-bs-light btn-sm " type="button" aria-expanded="false" data-bs-toggle="modal" data-bs-target="#exampleModal"
                          style={{ transition: "all 0.3s ease-in-out" }}>
                          View details
                        </button>

                        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Campus Innovation Fair 2025</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                🎉 Event Name: Campus Innovation Fair 2025 <br /> <br />

                                📅 Date & Time: September 18, 2025 — 9:00 AM to 6:00 PM <br /> <br />

                                📍 Venue: University Grand Hall & Outdoor Courtyard <br /> <br />

                                📝 Description: <br />
                                The Campus Innovation Fair 2025 showcases the creativity and talent of students across all departments. From tech start-ups and engineering prototypes to art exhibits and cultural performances, this event is a celebration of innovation and collaboration.

                                Students, faculty, and industry professionals are invited to exchange ideas, build connections, and discover new opportunities. <br /> <br />

                                🎤 Highlights: <br />

                                Keynote speech by Dr. Amelia Cruz, AI Researcher at MIT <br />

                                Student pitch competition with ₱20,000 prize <br />

                                Interactive robotics and VR gaming booths <br />

                                Art and design gallery by Fine Arts students <br />

                                Food stalls featuring international cuisines <br /> <br />

                                👥 Organized by: University Student Council in partnership with the Office of Student Affairs <br /> <br />

                                🎟️ Admission: Free for all students and faculty; ₱100 for external guests <br />
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
        <div className="row d-flex justify-content-end mt-5 mb-5">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div style={{ marginLeft: "10px", fontWeight: "bold", fontFamily: "San-Serif" }}>
              <h1>Ongoing Events</h1>
            </div>
            <div className="card mt-5" style={{ height: '15rem', backgroundColor: '#ebebebff' }}>
              <div className="card-body d-flex justify-content-center align-items-center">
                Events
              </div>
            </div>

            <div className="card mt-3 mb-5" style={{ height: '15rem', backgroundColor: '#ebebebff' }}>
              <div className="card-body d-flex justify-content-center align-items-center">
                Events
              </div>
            </div>
          </div>
          <div className="col-sm-10 col-md-6 col-lg-6 text-start d-flex justify-content-center" style={{
            fontFamily: "San-Serif",
          }}>
            <h1><a style={{ fontSize: "5rem" }}>DUNGAW</a><br />Web System <br /><br />
              <a style={{ fontSize: '1.5rem', }}>
                Smart Campus companion. Stay updated with events,<br />
                discovercourse promotions, get instant help through <br />
                Everything you need, all in one place.our built-in chat.
              </a></h1>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12" style={{ padding: "none" }}>
            <footer style={{
              height: 'clamp(10rem, 15vw, 20rem)', transform: "translateX(-0.7rem)",
              width: '100vw',
              backgroundColor: "#711212ff",
            }}>
            </footer>
          </div>
        </div>
      </div>

    </>
  );
}
