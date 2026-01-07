import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { OverlayPanel } from "primereact/overlaypanel";
import "./index.scss";

const JobPost = ({ 
  posterAvatar, 
  posterUsername, 
  posterSchool, 
  jobTitle, 
  jobDescription, 
  filters, 
  googleFormLink, 
  userid, 
  onDelete, 
  showDelete, 
  jobId, 
  isTeacher,
  posterId
}) => {
  const navigate = useNavigate();
  const op = useRef(null);
  const [jobCount, setJobCount] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const fetchJobCount = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/${posterId}/job-posts/count`);
      if (!response.ok) {
        throw new Error('Failed to fetch job count');
      }
      const data = await response.json();
      setJobCount(data.total_posts);
    } catch (error) {
      console.error('Error fetching job count:', error);
      setJobCount(0);
    }
  };

  const fetchProjectCount = async () => {
    try {
      const response = await fetch(`http://localhost:4000/users/${posterId}/projects/count`);
      if (!response.ok) {
        throw new Error('Failed to fetch project count');
      }
      const data = await response.json();
      setActiveProjects(data.total_projects);
    } catch (error) {
      console.error('Error fetching project count:', error);
      setActiveProjects(0);
    }
  };

  useEffect(() => {
    if (posterId) {
      fetchJobCount();
      fetchProjectCount();
    }
  }, [posterId]);

  const handleMouseEnter = (e) => {
    setIsHovering(true);
    op.current.show(e);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTimeout(() => {
      if (!isHovering) {
        op.current.hide();
      }
    }, 300);
  };

  const handleSignUp = () => {
    if (googleFormLink && !isTeacher) {
      console.log("Google Form Link:", userid);
      navigate("/apply", { 
        state: { 
          posterUsername, 
          posterSchool, 
          jobTitle, 
          userid, 
          jobId 
        } 
      });
    } else {
      alert("No sign-up form available for this job.");
    }
  };

  const handleAvatarClick = () => {
    navigate(`/accountpage`, { state: { userid } });
  };

  return (
    <div className="job-post-container">
      <div className="job-post-header">
        <div className="poster-info">
          <div className="avatar-wrapper">
            <Avatar 
              image={posterAvatar} 
              shape="circle" 
              size="large" 
              className="poster-avatar" 
              onClick={handleAvatarClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <OverlayPanel 
              ref={op} 
              showCloseIcon={false}
              
              className="avatar-overlay"
              breakpoints={{'960px': '75vw', '640px': '100vw'}}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                op.current.hide();
              }}
            >
              <div className="profile-preview">
                <div className="preview-header">
                  <Avatar 
                    image={posterAvatar} 
                    shape="circle" 
                    size="xlarge" 
                  />
                  <div className="preview-info">
                    <h3>{posterUsername}</h3>
                    <p>{posterSchool}</p>
                    <span className="teacher-badge">Employer</span>
                  </div>
                </div>
                <div className="preview-stats">
                  <div className="stat-item">
                    <i className="pi pi-briefcase"></i>
                    <span>{jobCount} Jobs Posted</span>
                  </div>
                  <div className="stat-item">
                    <i className="pi pi-users"></i>
                    <span>{activeProjects} Active Projects</span>
                  </div>
                </div>
                <div className="preview-actions">
                  <Button 
                    label="View Profile" 
                    icon="pi pi-user" 
                    className="p-button-text" 
                    onClick={handleAvatarClick}
                  />
                </div>
              </div>
            </OverlayPanel>
          </div>
          <div className="poster-details">
            <div className="poster-username">{posterUsername}</div>
            <div className="poster-school">{posterSchool} (Employer)</div>
          </div>
        </div>
        {showDelete && (
          <Button 
            icon="pi pi-times" 
            className="p-button-rounded p-button-danger delete-button" 
            tooltip="Delete this post" 
            onClick={onDelete} 
          />
        )}
      </div>
      <div className="job-title">{jobTitle}</div>
      <div className="job-description">{jobDescription}</div>
      <div className="job-filters">
        {Array.isArray(filters) && filters.map((filter, index) => (
          <Chip key={index} label={filter} className="p-mr-2" />
        ))}
      </div>
      <div className="job-signup">
        <Button 
          label="Sign Up" 
          icon="pi pi-check" 
          className="p-button-success signup-button" 
          onClick={handleSignUp} 
        />
      </div>
    </div>
  );
};

export default JobPost;
