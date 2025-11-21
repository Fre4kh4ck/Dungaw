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
    
    // ✅ State to track if Captcha is verified
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const RECAPTCHA_SITE_KEY = "6LcroxMsAAAAAJAyVxfx79pyHg21Y4i8m4MNNoKN"; 

    const handleCredentialResponse = async (response) => {
        try {
            console.log("GOOGLE RESPONSE:", response);
            const idToken = response?.credential;

            if (!idToken) {
                alert("Google token missing.");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
                credentials: "include"
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            const userToSave = { ...data.user, role: data.user.role || 'student' };
            localStorage.setItem("user", JSON.stringify(userToSave));

            navigate("/home");
        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Login error — see console.");
        }
    };

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
        console.log("Captcha value:", value);
        if (value) {
            setCaptchaVerified(true);
        } else {
            setCaptchaVerified(false);
        }
    };

    useEffect(() => {
        if (window.google && googleDivRef.current) {
            window.google.accounts.id.initialize({
                client_id: '934203088661-jtnhip516m0nfqb14sdbkmuntqcuu1r5.apps.googleusercontent.com',
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(googleDivRef.current, {
                theme: 'outline',
                size: 'large',
                width: '300',
            });
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row" style={{ height: '100vh' }}>
                {/* Left Side */}
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
                        course promotions, get instant help through our built in chat. <br /> <br />
                        Everything you need, all in one place.
                    </h3>
                </div>
                
                {/* Right Side (Login Form) */}
                <div
                    className="col-lg-5 col-sm-12 order-1 order-lg-2 d-flex justify-content-center align-items-center position-relative"
                    style={{ minHeight: '100vh', overflow: 'hidden' }}
                >
                    {/* Background Layer */}
                    <div
                        style={{
                            backgroundImage: `url(${BG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            filter: 'blur(8px)',
                            position: 'absolute',
                            top: '-10px',
                            left: '-10px',
                            width: 'calc(100% + 20px)',
                            height: 'calc(100% + 20px)',
                            zIndex: 0
                        }}
                    ></div>

                    {/* Foreground Content */}
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
                            
                            {/* ✅ RECAPTCHA COMPONENT (Moved to top) */}
                            <div className="mb-4">
                                <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={onCaptchaChange}
                                    theme="light"
                                />
                            </div>

                            {/* ✅ WRAPPER FOR GOOGLE LOGIN */}
                            {/* This div intercepts clicks if captcha is not verified */}
                            <div 
                                style={{
                                    pointerEvents: captchaVerified ? 'auto' : 'none', // 🔒 Blocks clicks
                                    opacity: captchaVerified ? 1 : 0.5,               // 🔒 Dims the button
                                    filter: captchaVerified ? 'none' : 'grayscale(100%)', // 🔒 Makes it grey
                                    transition: 'all 0.3s ease',
                                    cursor: captchaVerified ? 'pointer' : 'not-allowed'
                                }}
                                title={captchaVerified ? "Sign in with Google" : "Please verify you are not a robot first"}
                            >
                                <div ref={googleDivRef}></div>
                            </div>

                            {/* Guest Login Button */}
                            <button
                                className={`btn mt-4 text-white ${captchaVerified ? 'btn-outline-danger' : 'btn-secondary'}`}
                                onClick={handleGuestLogin}
                                disabled={!captchaVerified} 
                                style={{ 
                                    cursor: captchaVerified ? 'pointer' : 'not-allowed',
                                    opacity: captchaVerified ? 1 : 0.7,
                                    width: '300px' // Matching Google Button width
                                }}
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}