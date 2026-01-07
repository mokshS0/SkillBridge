import './index.scss';
import MenubarLanding from '../MenubarLanding';
import React, { useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authUtils } from '../../utils/auth';
import { Toast } from 'primereact/toast';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
    const toast = useRef(null);
    const location = useLocation()
    const hasShownToast = useRef(false); 
    const firstLoad = useRef(true);

    // New state for password visibility
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (firstLoad.current) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            firstLoad.current = false;
        }
    }, []);

    useEffect(() => {
        if (location.state?.isFirstTime && toast.current && !hasShownToast.current) {
            toast.current.show({
                severity: 'info',
                summary: 'Welcome!',
                detail: 'Sign in with your new account',
                life: 3000,
                position: 'top-center'
            });
            hasShownToast.current = true; 
        }
    }, [location.state?.isFirstTime]);

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error_message, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage('Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            const result = await authUtils.login(username, password);
            
            if (result.success) {
                setErrorMessage('');
                // If you need to store additional user data
                if (result.data.user) {
                    localStorage.setItem('user', JSON.stringify(result.data.user));
                }
                navigate('/Interior');
            } else {
                setErrorMessage(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press for form submission
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (username.length > 0 && password.length > 0) {
                handleLogin();
            }
        }
    };

    return (
        <section className='signin-section-wrapper'>
            <MenubarLanding />

            <div className="signin-container">
                <Toast ref={toast} />
            
                {/* Background with gradient overlay */}
                <div className="signin-background">
                    <div className="gradient-overlay"></div>
                </div>
                {/* Main content */}
                <div className="signin-content">
                    <div className="signin-card">
                        {/* Header */}
                        <div className="signin-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to continue to SkillBridge</p>
                        </div>
                        {/* Form */}
                        <div className="signin-form">
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            {error_message && (
                                <div className="error-message" role="alert">
                                    {error_message}
                                </div>
                            )}
                            <button
                                type="button"
                                className={`signin-button ${loading ? 'loading' : ''}`}
                                onClick={handleLogin}
                                disabled={loading || !username || !password}
                                aria-label={loading ? "Signing in..." : "Sign in"}
                            >
                                {loading ? (
                                    <div className="loading-spinner" aria-hidden="true"></div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                        {/* Footer */}
                        <div className="signin-footer">
                            <div className="divider">
                                <span>or</span>
                            </div>
                            <p>
                                Don't have an account?{' '}
                                <Link to="/signup" className="signup-link">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                    {/* Side illustration - similar to home page */}
                    <div className="signin-illustration">
                        <div className="illustration-card">
                            <div className="card-header">
                                <div className="profile-icon" aria-hidden="true"></div>
                                <div className="profile-info">
                                    <div className="profile-name" aria-hidden="true"></div>
                                    <div className="profile-role" aria-hidden="true"></div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="content-line long" aria-hidden="true"></div>
                                <div className="content-line medium" aria-hidden="true"></div>
                                <div className="content-line short" aria-hidden="true"></div>
                            </div>
                            <div className="card-footer">
                                <div className="footer-dot active" aria-hidden="true"></div>
                                <div className="footer-dot" aria-hidden="true"></div>
                                <div className="footer-dot" aria-hidden="true"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}