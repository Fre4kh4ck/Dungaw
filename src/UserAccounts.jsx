import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import STAT from './assets/stat.png';

const API_URL = "http://localhost:4435";

export default function UserAccounts() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showValidAccounts, setShowValidAccounts] = useState(false);
  const [validAccounts, setValidAccounts] = useState([]);
  
  // Add State
  const [newEmail, setNewEmail] = useState("");
  const [newDepartment, setNewDepartment] = useState("");

  // Edit State
  const [editingUser, setEditingUser] = useState(null); 
  const [editUsername, setEditUsername] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchActivityData = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-activity`);
      setActivityData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchValidAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/sib-campus-accounts`);
      setValidAccounts(response.data);
    } catch (error) {
      console.error("Error fetching valid accounts:", error);
    }
  };

  useEffect(() => {
    fetchActivityData();
    fetchValidAccounts();
  }, []);

  // --- CREATE ---
  const handleAddEmail = async () => {
    if (!newEmail || !newDepartment) return alert("Please enter both username and department");

    const username = newEmail.split('@')[0];
    const fullEmail = `${username}@antiquespride.edu.ph`;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@antiquespride\.edu\.ph$/;
    if (!emailRegex.test(fullEmail)) {
      return alert("Invalid username format.");
    }

    try {
      await axios.post(`${API_URL}/sib-campus-accounts`, { 
        email: fullEmail, 
        department: newDepartment 
      });
      setNewEmail("");
      setNewDepartment("");
      fetchValidAccounts();
      alert("Account added to valid accounts!");
    } catch (error) {
      alert("Failed to add account. It might already exist.");
    }
  };

  // --- EDIT FUNCTIONS (FIXED) ---
  const handleEditClick = (user) => {
    const username = user.email.split('@')[0];
    setEditingUser(user); 
    setEditUsername(username);
    setEditDepartment(user.department);
  };

  const handleUpdateAccount = async () => {
    if (!editUsername || !editDepartment) return alert("Fields cannot be empty");

    const fullEmail = `${editUsername}@antiquespride.edu.ph`;

    // FIX: Replaced PUT with DELETE then POST to avoid 404 error
    try {
      // 1. Delete the OLD record first
      await axios.delete(`${API_URL}/sib-campus-accounts/${editingUser.email}`);

      // 2. Add the NEW record immediately
      await axios.post(`${API_URL}/sib-campus-accounts`, {
        email: fullEmail,
        department: editDepartment
      });
      
      setEditingUser(null); // Close modal
      fetchValidAccounts(); // Refresh list
      alert("Account updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update account. Please try again.");
    }
  };

  // --- DELETE ---
  const handleDeleteEmail = async (email) => {
    if (!window.confirm(`Delete ${email}?`)) return;
    try {
      await axios.delete(`${API_URL}/sib-campus-accounts/${email}`);
      fetchValidAccounts();
    } catch (error) {
      alert("Error deleting account");
    }
  };

  const filteredData = activityData.filter(item =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredValid = validAccounts.filter(item =>
    (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getCSVDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getCSVTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString('en-US', { hour12: true });
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Name", "Email", "Department", "Created Date", "Created Time", "Last Login Date", "Last Login Time", "Account Status"];
    const rows = filteredData.map(row => {
      return [
        `"${row.name || 'Unknown'}"`,
        `"${row.email || ''}"`,
        `"${row.department || 'N/A'}"`,
        `"${getCSVDate(row.created_at)}"`,
        `"${getCSVTime(row.created_at)}"`,
        `"${getCSVDate(row.last_signin_at)}"`,
        `"${getCSVTime(row.last_signin_at)}"`,
        "Active"
      ].join(",");
    });
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UA_Activity_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className='container-fluid bg-light' style={{ minHeight: '100vh' }}>

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
          <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>☰</button>
        </nav>

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
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/accounts">
                <i className="bi bi-people-fill"></i> Accounts
              </a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/userAccounts"
                style={{ borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
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
            src={STAT} alt="Sidebar design"
            style={{ position: "absolute", bottom: "-4.5rem", left: "50%", transform: "translateX(-55%)", width: "400px", opacity: 0.9, zIndex: -1, pointerEvents: "none" }}
          />
        </div>

        <div
          className="main-content"
          style={{
            marginLeft: '250px',
            marginTop: '8rem',
            padding: '30px',
            transition: 'margin-left 0.3s'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">{showValidAccounts ? "Registered Valid Accounts" : "User Activity Log"}</h2>
              <p className="text-muted mb-0">{showValidAccounts ? "Manage allowed campus emails." : "Monitor student and staff login sessions."}</p>
            </div>

            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm d-flex align-items-center ${showValidAccounts ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setShowValidAccounts(!showValidAccounts)}
                style={{ padding: '8px 16px', borderRadius: '6px' }}
              >
                <i className={`bi ${showValidAccounts ? 'bi-arrow-left' : 'bi-shield-check'} me-2`}></i>
                {showValidAccounts ? "View Activity Logs" : "Registered Valid Accounts"}
              </button>

              <button
                className="btn btn-success btn-sm d-flex align-items-center shadow-sm"
                onClick={handleExportCSV}
                style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '6px' }}
              >
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                Export to CSV
              </button>
            </div>
          </div>

          {showValidAccounts && (
            <div className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: '12px' }}>
              <div className="d-flex gap-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username (e.g. jmmvenegas)"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <span className="input-group-text bg-light text-muted">@antiquespride.edu.ph</span>
                </div>

                <select
                  className="form-control"
                  style={{maxWidth: '200px'}}
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  <option value="CCIS">CCIS</option>
                  <option value="CEA">CEA</option>
                  <option value="CBA">CBA</option>
                  <option value="CMS">CMS</option>
                  <option value="CCJE">CCJE</option>
                  <option value="CAS">CAS</option>
                  <option value="CTE">CTE</option>
                  <option value="CIT">CIT</option>
                </select>

                <button className="btn btn-primary px-4" onClick={handleAddEmail}>Add</button>
              </div>
            </div>
          )}

          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ height: '4px', backgroundColor: '#711212ff', width: '100%' }}></div>

            <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center border-bottom-0">
              <h5 className="mb-0 fw-bold text-secondary">
                <i className={`bi ${showValidAccounts ? 'bi-shield-lock' : 'bi-list-ul'} me-2`}></i>
                {showValidAccounts ? "Authorized Emails" : "Recent Activities"}
              </h5>

              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    {showValidAccounts ? (
                      <tr>
                        <th className="ps-4 py-3 text-uppercase text-secondary small">Authorized Email</th>
                        <th className="py-3 text-uppercase text-secondary small">Department</th>
                        <th className="py-3 text-uppercase text-secondary small">Access Level</th>
                        <th className="pe-4 py-3 text-end text-uppercase text-secondary small">Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="ps-4 py-3 text-uppercase text-secondary small">User Identity</th>
                        <th className="py-3 text-uppercase text-secondary small">Department</th>
                        <th className="py-3 text-uppercase text-secondary small">Account Created</th>
                        <th className="py-3 text-uppercase text-secondary small">Last Login</th>
                        <th className="pe-4 py-3 text-end text-uppercase text-secondary small">Status</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">Loading records...</td></tr>
                    ) : showValidAccounts ? (
                      filteredValid.map((row, index) => (
                        <tr key={index}>
                          <td className="ps-4 py-3 fw-bold">{row.email}</td>
                          <td className="py-3">{row.department || "N/A"}</td>
                          <td><span className="badge bg-primary-subtle text-primary rounded-pill px-3">Campus User</span></td>
                          <td className="pe-4 text-end">
                            <button className="btn btn-link text-primary p-0 me-3" onClick={() => handleEditClick(row)}>
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteEmail(row.email)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : filteredData.length > 0 ? (
                      filteredData.map((row, index) => {
                        const created = formatDateTime(row.created_at);
                        const lastSign = formatDateTime(row.last_signin_at);
                        return (
                          <tr key={index}>
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center">
                                {row.picture ? (
                                  <img src={row.picture} alt="user" className="rounded-circle me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                ) : (
                                  <div className="rounded-circle bg-light d-flex justify-content-center align-items-center text-secondary me-3" style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                                    {row.name ? row.name.charAt(0).toUpperCase() : "?"}
                                  </div>
                                )}
                                <div>
                                  <span className="fw-bold text-dark">{row.name || "Unknown User"}</span>
                                  <div className="small text-muted" style={{ fontSize: '0.8rem' }}>{row.email || "No email"}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                                <span className="badge bg-info-subtle text-info px-3 rounded-pill" style={{fontSize: '0.75rem'}}>
                                    {row.department || "N/A"}
                                </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="fw-medium text-dark">{created.date}</span>
                                <span className="small text-muted">{created.time}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="fw-medium text-dark">{lastSign.date}</span>
                                <span className="small text-muted">{lastSign.time}</span>
                              </div>
                            </td>
                            <td className="pe-4 text-end">
                              <span className="badge bg-success-subtle text-success rounded-pill px-3">Active</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">No records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white text-muted small py-3 border-top-0">
              Showing {showValidAccounts ? filteredValid.length : filteredData.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Account</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small text-muted">Username</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                    <span className="input-group-text bg-light text-muted">@antiquespride.edu.ph</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Department</label>
                  <select
                    className="form-control"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="CCIS">CCIS</option>
                    <option value="CEA">CEA</option>
                    <option value="CBA">CBA</option>
                    <option value="CMS">CMS</option>
                    <option value="CCJE">CCJE</option>
                    <option value="CAS">CAS</option>
                    <option value="CTE">CTE</option>
                    <option value="CIT">CIT</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateAccount}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}