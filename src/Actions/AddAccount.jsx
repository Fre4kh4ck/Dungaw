import React, { useState } from 'react';
import axios from 'axios';

export default function AddAccount() {
    
    // 1. Predefined list for the Department Dropdown
    const departments = [
        "College of Computer Studies (CCS)",
        "College of Business Administration (CBA)",
        "College of Arts and Sciences (CAS)",
        "College of Criminal Justice Education (CCJE)",
        "College of Teacher Education (CTE)",
        "College of Engineering (COE)",
        "Maritime Studies",
        "Registrar Office",
        "SAS Office",
        "Guidance Office",
        "Clinic",
        "Library"
    ];

    // 2. State to handle form inputs
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: ''
    });

    // --- NEW: State to toggle password visibility ---
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 3. Handle Input Changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 4. Submit Logic
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default HTML form refresh
        setLoading(true);
        setError('');

        // Generate the date string
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const creationDate = `${year}${month}${day}`;

        // Prepare payload
        const payload = {
            ...formData,
            creation: creationDate
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/accounts/post`, payload);
            console.log("User created:", payload);
            alert("User added successfully!");
            window.location.reload(); // Refresh to show new data
        } catch (err) {
            console.error("Error creating user:", err);
            setError("Failed to create user. Please check your connection or try a different username.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addUser" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    
                    {/* Header with University Red Theme */}
                    <div className="modal-header text-white" style={{ backgroundColor: '#711212' }}>
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-person-plus-fill me-2"></i> Add New User
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            
                            {error && <div className="alert alert-danger">{error}</div>}

                            {/* Role Dropdown */}
                            <div className="form-floating mb-3">
                                <select 
                                    className="form-select" 
                                    id="addRole" 
                                    name="role"
                                    value={formData.role} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Role...</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Scanner">Scanner</option>
                                </select>
                                <label htmlFor="addRole">User Role</label>
                            </div>

                            {/* Department Dropdown */}
                            <div className="form-floating mb-3">
                                <select 
                                    className="form-select" 
                                    id="addName" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Department...</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <label htmlFor="addName">Department</label>
                            </div>

                            {/* Username Input */}
                            <div className="form-floating mb-3">
                                <input 
                                    type="text"
                                    className="form-control" 
                                    id="addUsername" 
                                    name="username"
                                    placeholder="Username" 
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="addUsername">Username</label>
                            </div>

                            {/* --- UPDATED: Password Input with Eye Icon --- */}
                            <div className="input-group mb-3">
                                <div className="form-floating">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-control" 
                                        id="addPassword" 
                                        name="password"
                                        placeholder="Password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="addPassword">Password</label>
                                </div>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ zIndex: 0 }}
                                >
                                    {/* Toggles between Eye and Eye-Slash icon */}
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {/* -------------------------------------------- */}

                        </div>

                        {/* Footer Buttons */}
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button 
                                type="submit" 
                                className="btn text-white" 
                                style={{ backgroundColor: '#711212' }}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Done"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}