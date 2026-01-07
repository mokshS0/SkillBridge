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
            version: '18.2.0',
            icon: 'pi pi-facebook',
            color: '#61DAFB',
            docsUrl: 'https://react.dev'
        },
        {
            id: 2,
            name: 'AWS Services',
            provider: 'Amazon',
            category: 'Cloud',
            status: 'Core',
            level: 'Production',
            features: ['Hosting', 'Authentication', 'Database', 'Storage'],
            version: 'Latest',
            icon: 'pi pi-amazon',
            color: '#FF9900',
            docsUrl: 'https://aws.amazon.com/documentation/'
        },
        {
            id: 3,
            name: 'MySQL',
            provider: 'Oracle',
            category: 'Database',
            status: 'Core',
            level: 'Production',
            features: ['Data Storage', 'Queries', 'Indexing', 'Relations'],
            version: '8.0',
            icon: 'pi pi-database',
            color: '#F80000',
            docsUrl: 'https://dev.mysql.com/doc/'
        },
        {
            id: 4,
            name: 'VS Code',
            provider: 'Microsoft',
            category: 'IDE',
            status: 'Development',
            level: 'Development',
            features: ['IntelliSense', 'Debugging', 'Git Integration', 'Extensions'],
            version: 'Latest',
            icon: 'pi pi-microsoft',
            color: '#00A4EF',
            docsUrl: 'https://code.visualstudio.com/docs'
        },
        {
            id: 5,
            name: 'Render',
            provider: 'Render',
            category: 'Hosting',
            status: 'Core',
            level: 'Production',
            features: ['Web Services', 'Static Sites', 'Auto-Deploy', 'SSL'],
            version: 'Latest',
            icon: 'pi pi-cloud',
            color: '#46E3B7',
            docsUrl: 'https://render.com/docs'
        },
        {
            id: 6,
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
            id: 7,
            name: 'PrimeReact',
            provider: 'PrimeTek',
            category: 'UI Framework',
            status: 'Core',
            level: 'Production',
            features: ['UI Components', 'Themes', 'Templates', 'Icons'],
            version: '9.x',
            icon: 'pi pi-prime',
            color: '#6366F1',
            docsUrl: 'https://primereact.org/documentation/'
        },
        {
            id: 8,
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
        },
        {
            id: 9,
            name: 'OpenAI',
            provider: 'OpenAI',
            category: 'AI Services',
            status: 'Integration',
            level: 'Production',
            features: ['GPT Models', 'API Integration', 'Natural Language Processing', 'AI Assistance'],
            version: 'Latest',
            icon: 'pi pi-bolt',
            color: '#412991',
            docsUrl: 'https://platform.openai.com/docs'
        },
        {
            id: 10,
            name: 'Express.js',
            provider: 'OpenJS Foundation',
            category: 'Backend Framework',
            status: 'Core',
            level: 'Production',
            features: ['Routing', 'Middleware', 'API Development', 'Server Management'],
            version: '4.x',
            icon: 'pi pi-server',
            color: '#000000',
            docsUrl: 'https://expressjs.com/'
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
