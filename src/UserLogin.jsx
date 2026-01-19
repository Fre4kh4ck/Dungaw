import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LOGO from "./assets/Logo.png";
import "../css/style.css";
import { useNavigate } from 'react-router-dom';
import BG from './assets/bg.jpg';
import ReCAPTCHA from "react-google-recaptcha";

export default function UserLogin() {
    const googleDivRef = useRef(null);
    const navigate = useNavigate();

    // ✅ States
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false); // New loading state

    const RECAPTCHA_SITE_KEY = "6LcroxMsAAAAAJAyVxfx79pyHg21Y4i8m4MNNoKN";
    const GOOGLE_CLIENT_ID = "934203088661-jtnhip516m0nfqb14sdbkmuntqcuu1r5.apps.googleusercontent.com";

    // ✅ Handle Google Login
    const handleCredentialResponse = async (response) => {
        setIsLoggingIn(true); // Start loading animation/blocker
        try {
            console.log("GOOGLE RESPONSE RECEIVED");
            const idToken = response?.credential;

            if (!idToken) {
                alert("Google authentication failed. Please try again.");
                setIsLoggingIn(false);
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
                credentials: "include"
            });

            const data = await res.json();

            // ✅ This catches the "Access Denied" if email is not in sib_campus_accounts
            if (!data.success) {
                alert(data.message || "Access Denied: You are not registered in the campus records.");
                setIsLoggingIn(false);
                return;
            }

            // Success! Save session
            localStorage.setItem("token", data.token);
            const userToSave = { ...data.user, role: data.user.role || 'student' };
            localStorage.setItem("user", JSON.stringify(userToSave));

            console.log("Login successful, navigating home...");
            navigate("/home");
            
        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Network error. Please check your connection to the server.");
            setIsLoggingIn(false);
        }
    };

    // ✅ Handle Guest Login
    const handleGuestLogin = () => {
        if (!captchaVerified) {
            alert("Please verify that you are not a robot.");
            return;
        }

        localStorage.removeItem("token");
        const guestUser = {
            name: "Guest Visitor",
            role: "guest"
        };
        localStorage.setItem("user", JSON.stringify(guestUser));
        navigate('/home');
    };

    const onCaptchaChange = (value) => {
        if (value) {
            setCaptchaVerified(true);
        } else {
            setCaptchaVerified(false);
        }
    };

    useEffect(() => {
        // Initialize Google Identity Services
        if (window.google && googleDivRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                cancel_on_tap_outside: false, // Prevents accidental closing
            });

            window.google.accounts.id.renderButton(googleDivRef.current, {
                theme: 'outline',
                size: 'large',
                width: '300',
            });
        }
    }, [captchaVerified]); // Re-render button logic if captcha status changes

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh' }}>
                {/* Left Side: Branding */}
                <div
                    className="col-lg-7 col-sm-12 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center"
                    style={{
                        backgroundColor: '#711212ff',
                        paddingBottom: '5rem',
                        height: '100%',
                    }}
                >
                    <h1 className="custom-size text-white fw-bold m-0 font-serif">Welcome to</h1>
                    <h2 className="custom-size-1 text-white mt-3 mb-5 font-sans">DUNGAW</h2>
                    <h3 className="custom-size-2 text-white text-center mt-5">
                        Smart Campus companion. Stay updated with events, discover <br />
                        course promotions, get instant help through our built-in chat. <br /> <br />
                        Everything you need, all in one place.
                    </h3>
                </div>

                {/* Right Side: Login Form */}
                <div
                    className="col-lg-5 col-sm-12 order-1 order-lg-2 d-flex justify-content-center align-items-center position-relative"
                    style={{ minHeight: '100vh', overflow: 'hidden' }}
                >
                    {/* Background Blur Layer */}
                    <div
                        style={{
                            backgroundImage: `url(${BG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(8px)',
                            position: 'absolute',
                            top: '-10px',
                            left: '-10px',
                            width: 'calc(100% + 20px)',
                            height: 'calc(100% + 20px)',
                            zIndex: 0
                        }}
                    ></div>

                    {/* Content Layer */}
                    <div style={{ width: '100%', maxWidth: '600px', zIndex: 1 }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src={LOGO}
                                alt="Logo"
                                className="logo-img"
                                style={{ width: '12rem', height: 'auto', marginBottom: '4rem', marginTop: '4rem' }}
                            />
                        </div>

                        <div className="d-flex flex-column align-items-center button-container">
                            
                            {/* Loading Overlay (Optional but nice) */}
                            {isLoggingIn && (
                                <div className="mb-3 text-white fw-bold bg-dark p-2 rounded">
                                    Verifying Campus Records...
                                </div>
                            )}

                            {/* RECAPTCHA */}
                            <div className="mb-4">
                                <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={onCaptchaChange}
                                    theme="light"
                                />
                            </div>

                            {/* GOOGLE LOGIN WRAPPER */}
                            <div 
                                style={{
                                    pointerEvents: (captchaVerified && !isLoggingIn) ? 'auto' : 'none',
                                    opacity: (captchaVerified && !isLoggingIn) ? 1 : 0.5,
                                    filter: captchaVerified ? 'none' : 'grayscale(100%)',
                                    transition: 'all 0.3s ease',
                                }}
                                title={captchaVerified ? "Sign in with Google" : "Verify captcha first"}
                            >
                                <div ref={googleDivRef}></div>
                            </div>

                            {/* GUEST LOGIN */}
                            <button
                                className={`btn mt-4 text-white ${captchaVerified && !isLoggingIn ? 'btn-outline-danger' : 'btn-secondary'}`}
                                onClick={handleGuestLogin}
                                disabled={!captchaVerified || isLoggingIn} 
                                style={{ 
                                    cursor: captchaVerified ? 'pointer' : 'not-allowed',
                                    width: '300px'
                                }}
                            >
                                {isLoggingIn ? "Processing..." : "Continue as Guest"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}