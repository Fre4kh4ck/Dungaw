import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LOGO from "../src/assets/Logo.png";
import "../css/style.css";
import { useNavigate } from 'react-router-dom';
import BG from './assets/bg.jpg'


export default function UserLogin() {
    const googleDivRef = useRef(null);
    const navigate = useNavigate();

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token:", response.credential);
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
                    <h1 className="custom-size text-white fw-bold m-0 font-serif">
                        Welcome to
                    </h1>
                    <h2 className="custom-size-1 text-white mt-3 mb-5 font-sans">
                        DUNGAW
                    </h2>
                    <h3 className="custom-size-2 text-white text-center mt-5">
                        Smart Campus companion. Stay updated with events, discover <br />
                        course promotions, get instant help through our built-in chat. <br /> <br />
                        Everything you need, all in one place.
                    </h3>
                </div>
                <div
                    className="col-lg-5 col-sm-12 order-1 order-lg-2 d-flex justify-content-center align-items-center position-relative"
                    style={{
                        minHeight: '100vh',
                        overflow: 'hidden'
                    }}
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
                            width: 'calc(100% + 20px)',   // expand to cover blurred edges
                            height: 'calc(100% + 20px)',  // expand to cover blurred edges
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
                                style={{ width: '12rem', height: 'auto', marginBottom: '8rem', marginTop: '4rem' }}
                            />
                        </div>

                        <div className="d-flex flex-column align-items-center button-container">
                            <div ref={googleDivRef}></div>

                            <button
                                className="btn btn-outline-danger guest-btn mt-4 text-white"
                                onClick={() => {
                                    console.log("Continuing as Guest...");
                                    navigate('/home');
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
