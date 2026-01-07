import './index.scss';
import MenubarLanding from '../MenubarLanding';
import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Calendar } from 'primereact/calendar';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar as CalendarIcon, 
    Building, 
    Home, 
    Lock, 
    ArrowRight, 
    ArrowLeft, 
    Check 
} from 'lucide-react';

/**
 * SignUp Component - Redesigned
 * 
 * A modern, clean signup form that matches the homepage and login page design.
 * Features a multi-step process with improved UX and visual consistency.
 */

export default function SignUp() {
    const [currentStep, setCurrentStep] = useState(0);
    const [date, setDate] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { error } = useContext(AuthContext);

    const [isStudentAccount, setIsStudentAccount] = useState(true);
    const [realName, setRealName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [schoolDistrict, setSchoolDistrict] = useState('');
    const [schoolEmail, setSchoolEmail] = useState('');
    const [userName, setUserName] = useState('');

    const steps = [
        { title: 'Personal Info', description: 'Tell us about yourself' },
        { title: 'School Info', description: 'Your educational background' },
        { title: 'Account Info', description: 'Create your account' }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setPasswordError('');
        setLoading(true);

        const formData = {
            real_name: realName,
            personal_email: personalEmail,
            phone_number: String(phoneNumber),
            birth_date: date ? date.toISOString().split('T')[0] : null,
            school_name: schoolName,
            school_district: schoolDistrict,
            school_email: schoolEmail,
            account_username: userName,
            password,
            is_teacher: !isStudentAccount,
            profile_img_url: 'https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg',
        };

        try {
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                throw new Error(errorMessage || 'Failed to register user.');
            }

            navigate('/signin', { state: { isFirstTime: true } });
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderPersonalInfo = () => (
        <div className="form-step">
            <div className="input-group">
                <div className="input-field">
                    <User className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Mail className="input-icon" size={20} />
                    <input
                        type="email"
                        placeholder="Personal Email"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Phone className="input-icon" size={20} />
                    <input
                        type="tel"
                        placeholder="(999) 999-9999"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field calendar-field">
                    <CalendarIcon className="input-icon" size={20} />
                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        placeholder="Birth Date"
                        dateFormat="mm/dd/yy"
                        showIcon={false}
                        className="primereact-calendar"
                        maxDate={new Date()}
                        yearRange="1900:2024"
                        yearNavigator
                        monthNavigator
                    />
                </div>
            </div>
        </div>
    );

    const renderSchoolInfo = () => (
        <div className="form-step">
            <div className="input-group">
                <div className="input-field">
                    <Building className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="School Name"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Home className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="School District"
                        value={schoolDistrict}
                        onChange={(e) => setSchoolDistrict(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Mail className="input-icon" size={20} />
                    <input
                        type="email"
                        placeholder="School Email"
                        value={schoolEmail}
                        onChange={(e) => setSchoolEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>
        </div>
    );

    const renderAccountInfo = () => (
        <div className="form-step">
            <div className="input-group">
                <div className="input-field">
                    <User className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Lock className="input-icon" size={20} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <Lock className="input-icon" size={20} />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            {passwordError && (
                <div className="error-message">{passwordError}</div>
            )}

            <div className="account-type-selector">
                <div className="selector-label">Account Type</div>
                <div className="selector-buttons">
                    <button
                        type="button"
                        className={`selector-btn ${isStudentAccount ? 'active' : ''}`}
                        onClick={() => setIsStudentAccount(true)}
                    >
                        Student Account
                    </button>
                    <button
                        type="button"
                        className={`selector-btn ${!isStudentAccount ? 'active' : ''}`}
                        onClick={() => setIsStudentAccount(false)}
                    >
                        Employer Account
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderPersonalInfo();
            case 1:
                return renderSchoolInfo();
            case 2:
                return renderAccountInfo();
            default:
                return renderPersonalInfo();
        }
    };

    return (
        <div className="signup-page">
            <MenubarLanding />
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <h1>Create Your Account</h1>
                        <p>Join SkillBridge to connect with opportunities</p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="progress-indicator">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`progress-step ${index <= currentStep ? 'active' : ''}`}
                            >
                                <div className="step-number">
                                    {index < currentStep ? <Check size={16} /> : index + 1}
                                </div>
                                <div className="step-info">
                                    <div className="step-title">{step.title}</div>
                                    <div className="step-description">{step.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="form-container">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="form-navigation">
                        {currentStep > 0 && (
                            <button
                                type="button"
                                className="nav-btn secondary"
                                onClick={prevStep}
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        )}

                        <div className="nav-spacer"></div>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                className="nav-btn primary"
                                onClick={nextStep}
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={`nav-btn primary ${loading ? 'loading' : ''}`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : (
                                    <>
                                        Create Account
                                        <Check size={18} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Sign In Link */}
                    <div className="signup-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/signin" className="signin-link">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}