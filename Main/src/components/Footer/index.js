import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import { Divider } from 'primereact/divider';
import 'primeicons/primeicons.css';

export default function Footer() {
    return (
        <div className='footer-wrapper-primary'>
            <div className='footer-content-wrap grid-col-4'>
                <div>
                    <h1>SkillBridge</h1>
                    <p>
                        Connecting students with opportunities! Our platform allows students to sign up for internships, jobs, and experiences while teachers and employers can post job listings. Start exploring and take the next step in your career journey today!
                    </p>
                </div>
                <div className='cener-wrapper'>
                    <div className='foot-link-wrapper'>
                        <h1>Links</h1>
                        <div className='foot-link-repsonsive'>
                            <Link className='foot-link' to="/contactdashboard">About</Link>
                            <Link className='foot-link' to="/contactdashboard/DashBoardFAQ">FAQ</Link>
                            <Link className='foot-link' to="/signin">Sign In</Link>
                            <Link className='foot-link' to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>Contacts</h1>
                    <p>5575 State Bridge Rd, Johns Creek, GA 30022</p>
                    <p>skillbridgecorp@gmail.com</p>
                    <p>(470) 939 - 2806</p>
                </div>
                <div>
                    <h1 className='center-txt-768'>Socials</h1>
                    <div className='footer-interactive-wrapper'>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.instagram.com"><i className="pi pi-instagram" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.linkedin.com"><i className="pi pi-linkedin" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://www.facebook.com"><i className="pi pi-facebook" style={{ fontSize: '2.3rem' }}></i></Link>
                        <Link className='footer-contact-interactive' target='_blank' to="https://twitter.com"><i className="pi pi-twitter" style={{ fontSize: '2.3rem' }}></i></Link>
                    </div>
                </div>
                <Divider className='span-4 marginTop-2rem' />
                <p className="span-4 footer-copyright">© SkillBridge Corporation - 2025</p>

            </div>
        </div>
    );
}
