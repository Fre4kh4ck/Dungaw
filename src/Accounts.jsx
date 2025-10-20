import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../css/style.css";
import UALOGO from './assets/Ualogo.png';
import FBLOGO from './assets/fblogo.png';
import INSTALOGO from './assets/instalogo.png';
import STAT from './assets/stat.png';

import EditAccount, { FillAccountForm } from './Actions/EditAccount'
import AddAccount from './Actions/AddAccount';
import DeleteAccount, { SetAccountId } from './Actions/DeleteAccount'


export default function Accounts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  
  // Fix: define searchKeyword state
  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchButton = async () => {
  try {
    const res = await axios.post('http://dungaw.ua:4435/account/search', {
      keyword: searchKeyword.trim(),
    });

    setAccounts(Array.isArray(res.data) ? res.data : [res.data]);
  } catch (err) {
    console.error('Search failed:', err);
  }
};                                                        



  useEffect(() => {
    axios.get('http://dungaw.ua:4435/accounts/order/id')
      .then((res) => {
        console.log('Fetched data:', res.data);
        setAccounts(Array.isArray(res.data) ? res.data : [res.data]);
      })
      .catch((err) => {
        console.error('Error fetching accounts:', err);
      });
  }, []);


  return (
    <>
      < AddAccount />
      < EditAccount />
      < DeleteAccount />
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

        {/* SIDEBAR */}
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

            <li className="nav-item mb-5">
              <a className="nav-link d-flex align-items-center gap-2 text-light px-3 py-2 rounded hover-bg" href="/events"
                style={{
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <i className="bi bi-people-fill"></i> Accounts
              </a>
            </li>


            <li className="nav-item mb-2 justify-content-center d-flex" style={{ marginTop: '30rem' }}>
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

        {/* MAIN CONTENT */}
        <div className='row justify-content-end' style={{ marginTop: '13rem' }}>
          <div className='col-12 col-sm-12 col-md-10 col-lg-10 p-4' style={{ background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 className="text-center mb-5">Manage Account</h2>

            <form className="mb-3">
              <div className="row">
                <div className="col-8 col-sm-8 col-md-6 col-lg-4">
                  <input
                    id='searchUsers'
                    type="text"
                    className="form-control"
                    placeholder="Search by Department or Role..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                <div className="col-2 col-sm-2 col-md-2 col-lg-1">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={handleSearchButton}
                  >
                    Search
                  </button>
                </div>

                <div className="col-2 col-sm-2 col-md-3 col-lg-2">
                  <button
                    type="button"
                    className="btn btn-success btn-block"
                    data-bs-toggle='modal'
                    data-bs-target='#addUser'
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>


            {/* Accounts Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Department</th>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length > 0 ? (
                    accounts.map((acc, index) => (
                      <tr key={acc.account_id}>
                        <td>{index + 1}</td>
                        <td>{acc.account_name}</td>
                        <td>{acc.account_username}</td>
                        <td>{acc.account_password}</td>
                        <td>{acc.account_type}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#editUser"
                            onClick={() =>
                              FillAccountForm(
                                acc.account_username,
                                acc.account_password,
                                acc.account_id
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            data-bs-toggle='modal'
                            data-bs-target='#deleteUser'
                            onClick={() => SetAccountId(acc.account_id)}
                          >
                            Delete
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
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
    </>
  );
}
