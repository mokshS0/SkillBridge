import React, { useEffect, useRef } from 'react';
import './index.scss';
import heroGuy from '../../assets/img/heroGuy2.png';
import MenuBarLanding from '../MenubarLanding';
import { Link } from 'react-router-dom';
import cardSection from './HomeCard';
/**
 * The `Hero` component represents the hero section of the landing page.
 * It includes a navigation menu, main heading, tagline, and call-to-action buttons.
 * The component features a modern design with smooth animations and responsive layout.
 */
const Hero = () => {
    const firstLoad = useRef(true);
    
    useEffect(() => {
        if (firstLoad.current) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            firstLoad.current = false;
        }
    }, []);

    return (
        <section className="hero-section-wrapper">
            <MenuBarLanding />
            <div className="hero-section">                
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">SkillBridge</h1>
                            <p className="hero-subtitle">Empowering Students, Enabling Employers</p>
                
                            <div className="hero-buttons">
                                <Link to="/signUp" className="btn btn-primary">
                                    Join Now
                                </Link>
                                <Link to="/signIn" className="btn btn-secondary">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                
                        <div className="hero-image">
                            <img src={heroGuy} alt="Professional using laptop" className="hero-img" />
                            <div className="hero-accent-circle"></div>
                        </div>
                    </div>
                </div>
                <div>
                    {cardSection()}
                </div>
            </div>
        </section>
    );
};

export default Hero;