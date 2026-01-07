import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import "./index.scss";

const PendingPost = ({ posterAvatar, posterUsername, posterSchool, jobTitle, jobDescription, filters, jobId, onApprove, onDelete }) => {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate(`/accountpage`, { state: { userid: jobId } });
  };

  return (
    <div className="job-post-container">
      <div className="job-post-header">
        <div className="poster-info">
          <Avatar image={posterAvatar} shape="circle" size="large" className="poster-avatar" onClick={handleAvatarClick} />
          <div className="poster-details">
            <div className="poster-username">{posterUsername}</div>
            <div className="poster-school">{posterSchool} (Pending)</div>
          </div>
        </div>
        <div className="pending-actions">
          <Button icon="pi pi-check" className="p-button-rounded p-button-success" tooltip="Approve Post" onClick={() => onApprove(jobId)} />
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger" tooltip="Delete Post" onClick={() => onDelete(jobId)} />
        </div>
      </div>
      <div className="job-title">{jobTitle}</div>
      <div className="job-description">{jobDescription}</div>
      <div className="job-filters">
        {Array.isArray(filters) && filters.map((filter, index) => (
          <Chip key={index} label={filter} className="p-mr-2" />
        ))}
      </div>
    </div>
  );
};

export default PendingPost;
