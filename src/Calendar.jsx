import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/style.css";
import UALOGO from "./assets/Ualogo.png";
import STAT from "./assets/stat.png";
import FBLOGO from "./assets/fblogo.png"
import INSTALOGO from "./assets/instalogo.png"

export default function Calendars() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All Departments"); // NEW state

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const events = [
    { date: new Date(2025, 7, 20), type: "school", title: "Orientation Day" },
    { date: new Date(2025, 7, 25), type: "personal", title: "Faculty Meeting" },
    { date: new Date(2025, 7, 31), type: "important", title: "Final Exams" },
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

  useEffect(() => {
    setSelectedEvents(getEventsForDate(new Date()));
  }, []);

  return (
    <>
      {/* ===== NAVBAR (UNCHANGED) ===== */}
      <div className="container-fluid">
        <nav
          className="navbar navbar-dark fixed-top d-flex justify-content-between px-3"
          style={{
            zIndex: 1050,
            height: "7rem",
            backgroundColor: "#711212",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <div className="d-flex align-items-center">
            <img src={UALOGO} alt="UA logo" style={{ width: "50px" }} />
            <div className="text-white ms-2">
              <div className="fw-bold ua-text">University of Antique</div>
              <div style={{ fontSize: "0.85rem" }}>Sibalom Main Campus</div>
            </div>
          </div>
          <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
            ☰
          </button>
        </nav>

        {/* ===== SIDEBAR (UNCHANGED) ===== */}
        <div
          className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${sidebarOpen ? "show" : ""
            }`}
          style={{
            width: "250px",
            zIndex: 1040,
            backgroundColor: "#711212",
            boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <div className="px-4 pt-4 pb-2 border-bottom d-flex align-items-center gap-2">
            <img src={UALOGO} alt="UA" style={{ width: "40px" }} />
            <div>
              <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                University of Antique
              </div>
              <div className="text-light" style={{ fontSize: "0.85rem" }}>
                Sibalom Campus
              </div>
            </div>
          </div>

          <ul className="nav flex-column mt-5 px-3">
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg"
                href="/home"
              >
                <i className="bi bi-house-door-fill"></i> Home
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded"
                href="/calendar"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <i className="bi bi-calendar-event-fill"></i> Calendar
              </a>
            </li>

            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg"
                href="/events"
              >
                <i className="bi bi-calendar2-event"></i> Events
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg"
                href="/chats"
              >
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
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="container-fluid col-lg-10"
        style={{
          marginLeft: "250px",
          paddingTop: "9rem",
          paddingBottom: "4rem",
          display: "grid",
          justifyContent: "center",
        }}
      >
        {/* LEGEND */}
        <div className="card shadow-sm border-0 p-4 mb-5 mx-3 rounded-4">
          <h3 className="fw-bold text-center mb-4 text-primary">
            <i className="bi bi-palette2 me-2"></i>Department Color Legend
          </h3>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {[
              ["#dc3545", "CCIS"],
              ["#0d6efd", "CTE"],
              ["#198754", "COE"],
              ["#ffc107", "CAS"],
              ["#6610f2", "CBA"],
              ["#20c997", "CTEd"],
              ["#fd7e14", "CHS"],
              ["#6c757d", "CIT"],
            ].map(([color, dept]) => (
              <span
                key={dept}
                className="badge d-flex align-items-center gap-2 shadow-sm px-3 py-2 rounded-pill text-dark"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: `2px solid ${color}`,
                }}
              >
                <span
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: color,
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
                <strong>{dept}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="row justify-content-center px-4">
          {/* LEFT: CALENDAR */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <div className="text-center fw-bold mb-4 fs-4 text-danger border-bottom pb-3">
                <i className="bi bi-calendar3 me-2"></i>Academic Calendar
              </div>

              {/* ===== DEPARTMENT FILTER (DESIGN ONLY) ===== */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <label className="fw-semibold text-secondary mb-0">
                  <i className="bi bi-funnel-fill me-2 text-danger"></i>Filter by Department:
                </label>
                <select
                  className="form-select w-auto shadow-sm rounded-pill border-1"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{ minWidth: "220px" }}
                >
                  <option>All Departments</option>
                  <option>CCIS</option>
                  <option>CTE</option>
                  <option>COE</option>
                  <option>CAS</option>
                  <option>CBA</option>
                  <option>CTEd</option>
                  <option>CHS</option>
                  <option>CIT</option>
                </select>
              </div>

              {/* CALENDAR */}
              <div className="calendar-container mx-auto">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="rounded-4 border shadow-sm p-3"
                  tileContent={({ date, view }) => {
                    const type = view === "month" ? getEventType(date) : null;
                    return type ? (
                      <div
                        className="mx-auto mt-1 rounded-circle"
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor:
                            type === "school"
                              ? "#dc3545"
                              : type === "personal"
                                ? "#0d6efd"
                                : "#ffc107",
                        }}
                      ></div>
                    ) : null;
                  }}
                />
              </div>

              <div className="mt-4 text-center">
                <h6 className="fw-bold mb-2 text-secondary">
                  Selected Date: <span className="text-danger">{date.toDateString()}</span>
                </h6>
                {selectedEvents.length > 0 ? (
                  <ul className="list-unstyled">
                    {selectedEvents.map((event, i) => (
                      <li key={i} className="fw-semibold text-danger">
                        <i className="bi bi-pin-angle-fill me-2"></i>
                        {event.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted fst-italic">No events scheduled for this date.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: UPCOMING EVENTS */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold text-center mb-4 text-primary">
                <i className="bi bi-clock-history me-2"></i>Upcoming Events
              </h4>

              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card mb-3 border-0 shadow-sm rounded-4 hover-shadow transition"
                  style={{ backgroundColor: "#711212", color: "white" }}
                >
                  <div className="card-body text-center">
                    <h5 className="fw-bold mb-1">Event Title {i}</h5>
                    <p className="mb-0 small opacity-75">📅 August {i * 5 + 15}, 2025</p>
                  </div>
                </div>
              ))}
              <div className="text-center mt-3">
                <a href="/events" className="btn btn-outline-danger rounded-pill px-4">
                  View All Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
