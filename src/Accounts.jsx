import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "react-calendar/dist/Calendar.css";
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import STAT from './assets/stat.png';

import EditAccount, { FillAccountForm } from './Actions/EditAccount'
import AddAccount from './Actions/AddAccount';
import DeleteAccount, { SetAccountId } from './Actions/DeleteAccount'

export default function Accounts() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = () => {
    const lowerKeyword = searchKeyword.toLowerCase().trim();
    if (lowerKeyword === '') {
      setFilteredAccounts(allAccounts);
    } else {
      const filtered = allAccounts.filter((acc) => {
        const department = acc.account_name ? acc.account_name.toLowerCase() : '';
        const role = acc.account_type ? acc.account_type.toLowerCase() : '';
        return department.includes(lowerKeyword) || role.includes(lowerKeyword);
      });
      setFilteredAccounts(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchKeyword, allAccounts]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/accounts/order/id`)
      .then((res) => {
        console.log('Fetched data:', res.data);
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setAllAccounts(data);
        setFilteredAccounts(data);
      })
      .catch((err) => {
        console.error('Error fetching accounts:', err);
      });
  }, []);

  return (
    <>
      <AddAccount />
      <EditAccount />
      <DeleteAccount />
      
      <div className='container-fluid'>
        {/* --- YOUR ORIGINAL TOP NAVBAR --- */}
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

        {/* --- YOUR ORIGINAL SIDEBAR --- */}
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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/adminEvents">
                <i className="bi bi-calendar2-event"></i> Events
              </a>
            </li>

            <li className="nav-item mb-3">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events"
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <i className="bi bi-people-fill"></i> Accounts
              </a>
            </li>

            <li className="nav-item mb-3">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/userAccounts"
                
              >
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
                <i className="bi bi-card-checklist"></i> Event Reports
              </a>
            </li>

            <li className="nav-item mb-2">
              <a className="nav-link text-light px-3 py-2 d-flex align-items-center gap-2" href="/event-scanner">
                <i className="bi bi-qr-code-scan"></i> Scanner
              </a>
            </li>

            <li className="nav-item mb-2 justify-content-center d-flex" style={{ marginTop: '20rem' }}>
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg text-center" href="/admin">
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

        {/* --- MAIN CONTENT (Improved Interior Design) --- */}
        <div className='row justify-content-end' style={{ marginTop: '13rem' }}>
          <div className='col-12 col-sm-12 col-md-10 col-lg-10 p-4'>
            
            {/* Card Wrapper for cleaner look */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '10px', backgroundColor: '#fff' }}>
              <div className="card-body p-4">
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-secondary m-0">Manage Accounts</h3>
                </div>

                {/* Improved Search & Add Toolbar */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6 col-lg-5">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0"
                        placeholder="Search by Department or Role..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-7 text-md-end">
                    <button
                      className="btn btn-success px-4"
                      style={{ borderRadius: '6px' }}
                      data-bs-toggle='modal'
                      data-bs-target='#addUser'
                    >
                      <i className="bi bi-plus-lg me-2"></i> Add Account
                    </button>
                  </div>
                </div>

                {/* Modernized Table */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="bg-light">
                      <tr className="text-secondary text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                        <th className="py-3 ps-3 border-bottom-0">#</th>
                        <th className="py-3 border-bottom-0">Department</th>
                        <th className="py-3 border-bottom-0">Credentials</th>
                        <th className="py-3 border-bottom-0">Role</th>
                        <th className="py-3 border-bottom-0 text-end pe-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((acc, index) => (
                          <tr key={acc.account_id}>
                            <td className="ps-3 fw-bold text-muted">{index + 1}</td>
                            <td>
                              <span className="fw-semibold text-dark">{acc.account_name}</span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <small className="text-muted">User: <span className="text-dark">{acc.account_username}</span></small>
                                <small className="text-muted">Pass: <span className="text-dark">••••••••</span></small>
                              </div>
                            </td>
                            <td>
                              <span className={`badge rounded-pill px-3 py-2 ${acc.account_type === 'Admin' ? 'bg-primary' : 'bg-secondary'} bg-opacity-75`}>
                                {acc.account_type}
                              </span>
                            </td>
                            <td className="text-end pe-3">
                              <button
                                className="btn btn-outline-warning btn-sm me-2"
                                style={{ borderRadius: '5px' }}
                                data-bs-toggle="modal"
                                data-bs-target="#editUser"
                                onClick={() => FillAccountForm(acc.account_username, acc.account_password, acc.account_id)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: '5px' }}
                                data-bs-toggle='modal'
                                data-bs-target='#deleteUser'
                                onClick={() => SetAccountId(acc.account_id)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                            No accounts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}