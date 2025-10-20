import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/style.css";
import UALOGO from "./assets/Ualogo.png";
import FBLOGO from "./assets/fblogo.png";
import INSTALOGO from "./assets/instalogo.png";
import STAT from "./assets/stat.png";

export default function Calendars() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

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
      {/* ===== NAVBAR ===== */}
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

        {/* ===== SIDEBAR ===== */}
        <div
          className={`border-end text-light position-fixed top-0 start-0 h-100 sidebar d-flex flex-column ${
            sidebarOpen ? "show" : ""
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
                href="/DepartmentCalendar"
              >
                <i className="bi bi-calendar2-week"></i> Dept. Calendar
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
            <li className="nav-item mb-2">
              <a
                className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg"
                href="/contactUs"
              >
                <i className="bi bi-telephone-fill"></i> Contact Us
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
        className="container-fluid calendar- col-lg-10"
        style={{ marginLeft: "250px", paddingTop: "9rem", paddingBottom: "4rem" }}
      >
        {/* LEGEND */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-3" style={{ color: "#711212" }}>
            Department Color Legend
          </h2>
          <div className="d-flex flex-wrap justify-content-center gap-4">
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
              <div key={dept} className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: color,
                    borderRadius: "4px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                ></div>
                <span style={{ fontWeight: "500", color: "#333" }}>{dept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="row justify-content-center px-4">
          {/* LEFT: CALENDAR */}
          <div className="col-lg-7 mb-4">
            <div
              className="card shadow p-4 border-0"
              style={{
                borderRadius: "20px",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="text-center fw-bold mb-3"
                style={{
                  color: "#711212",
                  fontSize: "1.5rem",
                  borderBottom: "2px solid #711212",
                  paddingBottom: "10px",
                }}
              >
                Calendar
              </div>
              <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={({ date, view }) => {
                  const type = view === "month" ? getEventType(date) : null;
                  return type ? <div className={`event-dot ${type}`}></div> : null;
                }}
              />
              <p className="text-center mt-3 fw-semibold">
                Selected: {date.toDateString()}
              </p>
              {selectedEvents.length > 0 ? (
                <ul className="list-unstyled text-center">
                  {selectedEvents.map((event, i) => (
                    <li key={i} className="text-danger">
                      📌 {event.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted">No events for this date.</p>
              )}
            </div>
          </div>

          {/* RIGHT: UPCOMING EVENTS */}
          <div className="col-lg-4">
            <h4 className="fw-bold text-center mb-3" style={{ color: "#711212" }}>
              Upcoming Events
            </h4>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card mb-3 border-0"
                style={{
                  height: "10rem",
                  backgroundColor: "#ea7b7b",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-white">
                  <h5 className="fw-bold mb-2">Event Title {i}</h5>
                  <p className="mb-0">Date: August {i * 5 + 15}, 2025</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
