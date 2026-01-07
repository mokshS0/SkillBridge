import "./index.scss"
import React, { useEffect } from "react"
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuInterior from "../../MenuInterior";

export default function ApplicationSuccess() {
  const navigate = useNavigate();

  const useScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
  };

  useScrollToTop();

  return (
    <div>
        <MenuInterior />
        <div className="success-container">
          <Card className="success-card">
            <div className="success-content">
              <i className="pi pi-check-circle" style={{ fontSize: '3rem', color: '#4caf50' }}></i>
              <h2 >Application Submitted Successfully!</h2>
              <p>Your application has been received. We will review it and get back to you soon.</p>
              <div className="button-container">
                <Button
                  label="Back to Dashboard"
                  icon="pi pi-home"
                  onClick={() => navigate('/Interior')}
                  className="p-button-primary"
                  severity="info"
                />
                <Button
                  label="View My Applications"
                  icon="pi pi-list"
                  onClick={() => navigate('/userposts')}
                  className="p-button-secondary"
                />
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}
