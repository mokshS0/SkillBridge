import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import './index.scss';
import { useNavigate } from 'react-router-dom';

const TeacherAppCard = ({ application, onApplicationUpdate }) => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [status, setStatus] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    
    // Interview scheduling states
    const [interviewDate, setInterviewDate] = useState(null);
    const [interviewLocation, setInterviewLocation] = useState('');

    const statusOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Interview', value: 'interview' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Under Review', value: 'under_review' }
    ];

    const fetchApplicationDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch application details');
            }
            const data = await response.json();
            setStatus(data.status || data.application_status || '');
            setReviewText(data.review_feedback || '');
            // Set interview details if they exist
            if (data.interview_date) {
                setInterviewDate(new Date(data.interview_date));
            }
            setInterviewLocation(data.interview_location || '');
        } catch (error) {
            console.error('Error fetching application details:', error);
        }
    };

    const handleOpenModal = async () => {
        await fetchApplicationDetails();
        setShowReviewModal(true);
    };

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/get-user/${application.user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch student info');
                }
                const data = await response.json();
                setStudentInfo(data);
                setStudentId(data.user_id)
                console.log(data)
            } catch (error) {
                console.error('Error fetching student info:', error);
            }
        };

        fetchStudentInfo();
    }, [application.user_id]);

    const goToProfile = () => {
        // Use application.user_id directly to ensure correct profile
        const userId = application.user_id || studentId;
        navigate(`/accountpage`, { state: { userid: userId } });
    };

    const handleReviewSubmit = async () => {
        try {
            // Validate that status is selected
            if (!status) {
                alert('Please select a status before submitting the review.');
                return;
            }

            const requestBody = {
                application_status: status,
                review_feedback: reviewText || '',
                isComplete: true
            };

            if (status === 'interview') {
                if (!interviewDate) {
                    alert('Please select an interview date and time.');
                    return;
                }
                requestBody.interview_date = interviewDate;
                requestBody.interview_location = interviewLocation || '';
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update application' }));
                alert(`Error: ${errorData.message || 'Failed to update application'}`);
                throw new Error(errorData.message || 'Failed to update application');
            }
    
            const updatedApp = await response.json();
            console.log('Review submitted successfully:', updatedApp);
            
            // Update local application state with returned data
            Object.assign(application, updatedApp);
            
            setShowReviewModal(false);
            setStatus('');
            setReviewText('');
            setInterviewDate(null);
            setInterviewLocation('');
            
            // Refresh applications list
            if (onApplicationUpdate) {
            onApplicationUpdate();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(`Failed to submit review: ${error.message}`);
        }
    };
    
    const saveDraft = async () => {
        try {
            const requestBody = {
                application_status: status,
                review_feedback: reviewText,
                isComplete: false
            };

            if (status === 'interview') {
                requestBody.interview_date = interviewDate;
                requestBody.interview_location = interviewLocation;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error('Failed to save draft');
            }
    
            console.log('Draft saved successfully');
            setShowReviewModal(false);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/applications/${application.application_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete application');
            }

            console.log('Application deleted successfully');
            setShowDeleteDialog(false);
            setIsDeleted(true);
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const deleteDialogFooter = (
        <div>
            <Button 
                label="No" 
                icon="pi pi-times" 
                onClick={() => setShowDeleteDialog(false)} 
                className="p-button-text"
            />
            <Button 
                label="Yes" 
                icon="pi pi-check" 
                onClick={handleDelete} 
                className="p-button-danger" 
                autoFocus
            />
        </div>
    );
    
    const reviewModalFooter = (
        <div>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                onClick={() => setShowReviewModal(false)} 
                className="p-button-text"
            />
            <Button 
                label="Save Draft" 
                icon="pi pi-save" 
                onClick={saveDraft} 
                className="p-button-secondary mr-2 ml-2"
            />
            <Button 
                label="Submit Review" 
                icon="pi pi-check" 
                onClick={handleReviewSubmit} 
                autoFocus 
            />
        </div>
    );

    // Debug: Log application data to see what we're working with
    useEffect(() => {
        console.log('Application data in AppCardTeacher:', {
            application_id: application.application_id,
            why_interested: application.why_interested,
            relevant_skills: application.relevant_skills,
            hope_to_gain: application.hope_to_gain,
            application_data: application.application_data,
            full_application: application
        });
    }, [application]);

    if (isDeleted) {
        return null;
    }

    return (
        <>
            <Card
                title={`Job: ${application.job_title || 'Unknown Job'}`}
                subTitle={
                    <>
                        {studentInfo && `Submitted by ${studentInfo.real_name || studentInfo.account_username || 'Unknown'} on ${application.createdAt ? new Date(application.createdAt).toLocaleDateString() : application.date_applied ? new Date(application.date_applied).toLocaleDateString() : 'Unknown Date'}`}
                    </>
                }
                className="teacher-app-card"
            >
                <div className="application-content">
                    <div className="content-section">
                        <h4 className="section-title">Why Interested</h4>
                        <p className="section-text">
                            {(() => {
                                const value = application.why_interested || 
                                             (application.application_data && typeof application.application_data === 'object' ? application.application_data.why_interested : null) ||
                                             '';
                                return value || 'Not provided';
                            })()}
                        </p>
                    </div>
                    <Divider />
                    <div className="content-section">
                        <h4 className="section-title">Relevant Skills</h4>
                        <p className="section-text">
                            {(() => {
                                const value = application.relevant_skills || 
                                             (application.application_data && typeof application.application_data === 'object' ? application.application_data.relevant_skills : null) ||
                                             '';
                                return value || 'Not provided';
                            })()}
                        </p>
                    </div>
                    <Divider />
                    <div className="content-section">
                        <h4 className="section-title">Hope to Gain</h4>
                        <p className="section-text">
                            {(() => {
                                const value = application.hope_to_gain || 
                                             (application.application_data && typeof application.application_data === 'object' ? application.application_data.hope_to_gain : null) ||
                                             '';
                                return value || 'Not provided';
                            })()}
                        </p>
                    </div>
                    <Divider />
                    <div className="button-section">
                        <Button 
                            label="View Profile" 
                            icon="pi pi-search" 
                            className="p-button-warning mr-2"
                            onClick={goToProfile}
                        />
                        <Button 
                            label="Review" 
                            icon="pi pi-check" 
                            className="p-button-success mr-2"
                            onClick={handleOpenModal}
                        />
                        <Button 
                            label="Delete" 
                            icon="pi pi-trash" 
                            className="p-button-danger"
                            onClick={() => setShowDeleteDialog(true)}
                        />
                    </div>
                </div>
            </Card>

            <Dialog 
                header="Review Application" 
                visible={showReviewModal} 
                style={{ width: '70vw' }} 
                footer={reviewModalFooter}
                onHide={() => setShowReviewModal(false)}
            >
                <div className="review-form">
                    <div className="field">
                        <label htmlFor="status" className="font-bold">Status</label>
                        <Dropdown
                            id="status"
                            value={status}
                            options={statusOptions}
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Select Status"
                            className="w-full mt-2"
                        />
                    </div>

                    {/* Interview Scheduling Section - Only visible when Interview is selected */}
                    {status === 'interview' && (
                        <div className="interview-section">
                            <Divider />
                            <h4 className="interview-section-title">Schedule Interview</h4>
                            
                            <div className="field mt-3">
                                <label htmlFor="interviewDate" className="font-bold">Interview Date & Time</label>
                                <Calendar
                                    id="interviewDate"
                                    value={interviewDate}
                                    onChange={(e) => setInterviewDate(e.value)}
                                    showTime
                                    hourFormat="12"
                                    placeholder="Select date and time"
                                    className="w-full mt-2"
                                    dateFormat="mm/dd/yy"
                                    minDate={new Date()}
                                />
                            </div>
                            
                            <div className="field mt-3">
                                <label htmlFor="interviewLocation" className="font-bold">Interview Location</label>
                                <InputText
                                    id="interviewLocation"
                                    value={interviewLocation}
                                    onChange={(e) => setInterviewLocation(e.target.value)}
                                    placeholder="Enter location (e.g., Room 101, Zoom link, etc.)"
                                    className="w-full mt-2"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="field mt-4">
                        <label htmlFor="review" className="font-bold">Review Comments</label>
                        <InputTextarea
                            id="review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={8}
                            className="w-full mt-2"
                            placeholder="Enter your review comments here..."
                            autoResize
                            style={{ 
                                minHeight: '200px',
                                width: '100%',
                                maxWidth: '100%'
                            }}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog 
                visible={showDeleteDialog} 
                style={{ width: '450px' }} 
                header="Confirm Deletion" 
                modal 
                footer={deleteDialogFooter} 
                onHide={() => setShowDeleteDialog(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Are you sure you want to delete this application?</span>
                </div>
            </Dialog>
        </>
    );
};

export default TeacherAppCard;