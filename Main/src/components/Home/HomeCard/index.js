import React from 'react';
import './index.scss';
import { GraduationCap, Building2, TrendingUp, Users, Briefcase, CheckCircle, PenTool } from 'lucide-react';
import ChartActiveUser from '../../../assets/img/ChartActiveUser.png';
import DrawnLine from '../../../assets/img/DrawnLine.png';
import PieIndustry from '../../../assets/img/successCog.png';

/**
 * The `CardSection` component displays the main content section of the landing page.
 * It includes feature cards, statistics, and charts to showcase SkillBridge's impact.
 * The component uses a modern card-based layout with responsive design.
 */
const CardSection = () => {
    const features = [
        {
            title: "Student Opportunities",
            description: "Connect with employers and find internships, part-time jobs, and entry-level positions tailored for students. Build your career from day one.",
            icon: GraduationCap
        },
        {
            title: "Employer Solutions", 
            description: "Access a pool of talented students ready to bring fresh perspectives to your organization. Post jobs and find the perfect candidates for your team.",
            icon: Building2
        },
        {
            title: "Career Growth",
            description: "Get access to resume building tools, interview preparation resources, and career guidance to help you succeed in your professional journey.",
            icon: TrendingUp
        }
    ];

    const stats = [
        {
            icon: Users,
            value: "+80,000",
            label: "Active Users",
            color: "green"
        },
        {
            icon: Briefcase, 
            value: "+25,000",
            label: "Opportunities Posted",
            color: "blue"
        },
        {
            icon: CheckCircle,
            value: "+15,000", 
            label: "Successful Matches",
            color: "red"
        },
        {
            icon: PenTool,
            value: "+22,500",
            label: "Applications Filled", 
            color: "orange"
        }
    ];

    return (
        <section className="heroCardWrap card-section">
            {/* Feature Cards */}
            <div className="features-container">
                <div className="section-header">
                    <h2>Why Choose SkillBridge?</h2>
                    <p>Connecting students with opportunities and employers with talent</p>
                </div>
                
                <div className="features-grid">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <IconComponent size={32} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Statistics Section */}
            <div className="stats-section">
                <div className="stats-container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <div key={index} className={`stat-card bg-${stat.color}`}>
                                    <div className="stat-icon">
                                        <IconComponent size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-value">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="analytics-container">
                <div className="analytics-grid">
                    <div className="chart-main">
                        <div className="chart-card">
                            <img src={ChartActiveUser} alt="Active User Growth Chart" />
                        </div>
                    </div>
                    
                    <div className="charts-secondary">
                        <div className="chart-grid">
                            <div className="chart-card chart-opportunities">
                                <div className="chart-text">
                                    <span className="chart-label">Opportunities:</span>
                                    <span className="chart-value">25,000+</span>
                                </div>
                                <img src={DrawnLine} alt="Opportunities Growth" className="chart-line" />
                            </div>
                            
                            <div className="chart-card">
                                <div className='successCog-Wrap'><img src={PieIndustry} alt="Industry Distribution" className='successCog'/></div>
                            </div>
                        </div>
                        
                        <div className="schools-stat">
                            <div className="schools-content">
                                <p className="schools-text">SkillBridge is used in</p>
                                <div className="schools-number">3K+</div>
                                <p className="schools-text">schools nationwide</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CardSection;