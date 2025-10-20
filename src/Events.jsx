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
import Loop from './Loop';
import axios from 'axios';
import { useEffect } from 'react';
import Tick from './Tick';

export default function Events() {
    useEffect(() => {
        Tick(GetEvents);
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [data, sendData] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const FetchEvents = async () => {
        const res = await axios.get("http://dungaw.ua:4435/events");
        sendData(res.data);
    }

    const GetEvents = () => {
        return FetchEvents();
    }

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
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/calendar" >
                                <i className="bi bi-calendar-event-fill"></i> Calendar
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/DepartmentCalendar">
                                <i className="bi bi-calendar-event-fill"></i> Dept. Calendar
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events"
                                style={{
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                }}>
                                <i className="bi bi-calendar2-event"></i> Events
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/chats">
                                <i className="bi bi-chat-dots-fill"></i> Chat
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
                <div className="row d-flex justify-content-start">
                    <div
                        className="col-sm-12 col-md-12 col-lg-12 position-relative"
                        style={{ overflow: "hidden", marginTop: '6rem' }}
                    >
                        {/* Background Image */}
                        <div>
                            <img
                                src={BG1}
                                alt=""
                                style={{
                                    width: "110rem",
                                    opacity: "0.8",
                                    transform: "translateX(-10px)",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background:
                                        "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
                                }}
                            ></div>
                        </div>

                        {/* Text + Search Section */}
                        <div
                            style={{
                                position: "absolute",
                                top: "30%",
                                left: "50%",
                                transform: "translate(-50%, -30%)",
                                textAlign: "center",
                                color: "#fff",
                                width: "80%",
                                marginTop: "8rem",
                            }}
                        >
                            {/* Heading */}
                            <h1 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                                <span style={{ color: "#00AEEF" }}>Live Today.</span> Live Campus Life.
                            </h1>
                            <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                                Discover the Most Exciting Campus Events Around You
                            </p>

                            {/* Search Bar */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                    background: "#fff",
                                    borderRadius: "8px",
                                    padding: "5px 10px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search Events, Categories, Location..."
                                    style={{
                                        flex: 1,
                                        border: "none",
                                        outline: "none",
                                        padding: "10px",
                                        fontSize: "1rem",
                                        borderRadius: "5px",
                                    }}
                                />
                                <select
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        padding: "10px",
                                        fontSize: "1rem",
                                        background: "transparent",
                                    }}
                                >
                                    <option>CCIS</option>
                                    <option>CEA</option>
                                    <option>CBA</option>
                                </select>
                            </div>

                            {/* App Download */}
                            <p style={{ marginTop: "20px", fontSize: "1rem" }}>
                                DISCOVER THE <span style={{ color: "#00AEEF" }}>CAMPUS</span> {" "}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cardo justify-content-center mt-2 mb-5">
                {(
                    <Loop repeat={data.length}>
                        {(index) => (
                            <div key={index} className="">
                                <div className="container-fluid mt-4 ">
                                    <div className="card shadow-lg border-0 rounded-4 " style={{ width: "22rem", marginLeft: "clamp(1px, 2vw, 3rem)" }}>
                                        <img
                                            src={`http://dungaw.ua:4435/${data[index].EventPhoto}`}
                                            className="card-img-top rounded-top-4"
                                            alt={data[index].EventName}
                                            height={150}
                                            style={{ objectFit: "cover" }}
                                        />


                                        <div className="card-body">
                                            <p className="text-muted mb-1">{new Date().toDateString(data[index].EventDate)} •  {data[index].EventVenue}, {data[index].EventTime}</p>
                                            <h5 className="card-title fw-bold">{data[index].EventName}</h5>
                                            <p className="text-muted mb-2">4+ Interested</p>

                                            {/* Phone button */}
                                            <a href="" className="btn btn-outline-danger d-flex align-items-center gap-2">
                                                <i className="bi bi-people-fill"></i> Join
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Loop>
                ) || <h1>Loading...</h1>}
            </div>
        </>
    );
}
