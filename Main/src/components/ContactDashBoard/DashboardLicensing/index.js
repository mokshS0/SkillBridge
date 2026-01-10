import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import './index.scss';

const DevelopmentTechnologies = () => {
    const technologies = [
        {
            id: 1,
            name: 'React',
            provider: 'Meta',
            category: 'Frontend',
            status: 'Core',
            level: 'Production',
            features: ['Components', 'Hooks', 'Router', 'State Management'],
            version: '18.3.1',
            icon: 'pi pi-facebook',
            color: '#61DAFB',
            docsUrl: 'https://react.dev'
        },
        {
            id: 2,
            name: 'React Router',
            provider: 'Remix',
            category: 'Frontend',
            status: 'Core',
            level: 'Production',
            features: ['Routing', 'Navigation', 'Protected Routes', 'Dynamic Routes'],
            version: '7.0.2',
            icon: 'pi pi-route',
            color: '#CA4245',
            docsUrl: 'https://reactrouter.com/'
        },
        {
            id: 3,
            name: 'PrimeReact',
            provider: 'PrimeTek',
            category: 'UI Framework',
            status: 'Core',
            level: 'Production',
            features: ['UI Components', 'Themes', 'Templates', 'Icons'],
            version: '10.9.1',
            icon: 'pi pi-prime',
            color: '#6366F1',
            docsUrl: 'https://primereact.org/documentation/'
        },
        {
            id: 4,
            name: 'Node.js',
            provider: 'OpenJS Foundation',
            category: 'Backend',
            status: 'Core',
            level: 'Production',
            features: ['Runtime Environment', 'NPM', 'Express', 'API Development'],
            version: '18.x',
            icon: 'pi pi-server',
            color: '#339933',
            docsUrl: 'https://nodejs.org/docs/latest-v18.x/api/'
        },
        {
            id: 5,
            name: 'Express.js',
            provider: 'OpenJS Foundation',
            category: 'Backend Framework',
            status: 'Core',
            level: 'Production',
            features: ['Routing', 'Middleware', 'API Development', 'Server Management'],
            version: '4.18.2',
            icon: 'pi pi-server',
            color: '#000000',
            docsUrl: 'https://expressjs.com/'
        },
        {
            id: 6,
            name: 'MongoDB',
            provider: 'MongoDB Inc.',
            category: 'Database',
            status: 'Core',
            level: 'Production',
            features: ['NoSQL Database', 'Mongoose ODM', 'Atlas Cloud', 'Data Modeling'],
            version: '7.5.0 (Mongoose)',
            icon: 'pi pi-database',
            color: '#47A248',
            docsUrl: 'https://www.mongodb.com/docs/'
        },
        {
            id: 7,
            name: 'JWT',
            provider: 'IETF',
            category: 'Authentication',
            status: 'Core',
            level: 'Production',
            features: ['Token Authentication', 'Secure Auth', 'Session Management', 'API Security'],
            version: '9.0.2',
            icon: 'pi pi-lock',
            color: '#000000',
            docsUrl: 'https://jwt.io/'
        },
        {
            id: 8,
            name: 'Google Gemini AI',
            provider: 'Google',
            category: 'AI Services',
            status: 'Core',
            level: 'Production',
            features: ['Bio Generation', 'Job Recommendations', 'Chat Assistant', 'NLP'],
            version: 'Latest',
            icon: 'pi pi-bolt',
            color: '#4285F4',
            docsUrl: 'https://ai.google.dev/'
        },
        {
            id: 9,
            name: 'Axios',
            provider: 'Open Source',
            category: 'HTTP Client',
            status: 'Core',
            level: 'Production',
            features: ['HTTP Requests', 'Interceptors', 'Promise-based', 'Error Handling'],
            version: '1.7.9',
            icon: 'pi pi-cloud-upload',
            color: '#5A29E4',
            docsUrl: 'https://axios-http.com/docs/intro'
        },
        {
            id: 10,
            name: 'SCSS/SASS',
            provider: 'Sass Team',
            category: 'Styling',
            status: 'Core',
            level: 'Production',
            features: ['CSS Preprocessor', 'Variables', 'Nesting', 'Mixins'],
            version: 'Latest',
            icon: 'pi pi-palette',
            color: '#CF649A',
            docsUrl: 'https://sass-lang.com/documentation'
        },
        {
            id: 11,
            name: 'Vercel',
            provider: 'Vercel',
            category: 'Deployment',
            status: 'Core',
            level: 'Production',
            features: ['Frontend Hosting', 'Auto-Deploy', 'CDN', 'SSL'],
            version: 'Latest',
            icon: 'pi pi-cloud',
            color: '#000000',
            docsUrl: 'https://vercel.com/docs'
        },
        {
            id: 12,
            name: 'Railway',
            provider: 'Railway',
            category: 'Deployment',
            status: 'Core',
            level: 'Production',
            features: ['Backend Hosting', 'Auto-Deploy', 'Database', 'Monitoring'],
            version: 'Latest',
            icon: 'pi pi-cloud',
            color: '#0B0D0E',
            docsUrl: 'https://docs.railway.app/'
        },
        {
            id: 13,
            name: 'MongoDB Atlas',
            provider: 'MongoDB Inc.',
            category: 'Database',
            status: 'Core',
            level: 'Production',
            features: ['Cloud Database', 'Auto-Scaling', 'Backups', 'Security'],
            version: 'Latest',
            icon: 'pi pi-cloud',
            color: '#47A248',
            docsUrl: 'https://www.mongodb.com/cloud/atlas'
        },
        {
            id: 14,
            name: 'bcryptjs',
            provider: 'Open Source',
            category: 'Security',
            status: 'Core',
            level: 'Production',
            features: ['Password Hashing', 'Salt Rounds', 'Secure Storage', 'Authentication'],
            version: '2.4.3',
            icon: 'pi pi-shield',
            color: '#F7931E',
            docsUrl: 'https://www.npmjs.com/package/bcryptjs'
        },
        {
            id: 15,
            name: 'GitHub',
            provider: 'Microsoft',
            category: 'Version Control',
            status: 'Core',
            level: 'Production',
            features: ['Repository Hosting', 'Version Control', 'CI/CD', 'Collaboration'],
            version: 'Latest',
            icon: 'pi pi-github',
            color: '#181717',
            docsUrl: 'https://docs.github.com/'
        }
    ];
    

    const getStatusSeverity = (status) => {
        switch (status.toLowerCase()) {
            case 'core':
                return 'success';
            case 'development':
                return 'info';
            case 'deprecated':
                return 'danger';
            default:
                return 'info';
        }
    };

    return (
        <div className="development-technologies">
            <div className="technologies-header">
                <h1>Development Technologies</h1>
                <p>Core technologies and tools used in building this project</p>
            </div>

            <div className="grid">
                {technologies.map((tech) => (
                    <div key={tech.id} className="col-12 md:col-6 xl:col-3">
                        <div className='card'>
                            <Card className="technology-card">
                                <div className="tech-header" style={{ '--tech-color': tech.color }}>
                                    <div className="tech-icon">
                                        <i className={tech.icon}></i>
                                    </div>
                                    <Badge value={tech.status} severity={getStatusSeverity(tech.status)} />
                                </div>
                                <div className="tech-body">
                                    <h2>{tech.name}</h2>
                                    <div className="tech-provider">
                                        <span>Provided by</span>
                                        <strong>{tech.provider}</strong>
                                    </div>
                                    <div className="tech-details">
                                        <div className="detail-item">
                                            <i className="pi pi-tag"></i>
                                            <span>{tech.category}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="pi pi-code"></i>
                                            <span>Version {tech.version}</span>
                                        </div>
                                    </div>
                                    <div className="tech-features">
                                        {tech.features.map((feature, index) => (
                                            <span key={index} className="feature-tag">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="tech-level">
                                        <span>Usage Level:</span>
                                        <code>{tech.level}</code>
                                    </div>
                                </div>
                                <div className="tech-footer">
                                    <Button
                                        label="View Documentation"
                                        icon="pi pi-external-link"
                                        className="p-button-outlined"
                                        onClick={() => window.open(tech.docsUrl, '_blank')}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DevelopmentTechnologies;
