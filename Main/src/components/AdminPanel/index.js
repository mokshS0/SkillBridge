import './index.scss';
import React, { useState, useEffect, useContext } from 'react';
import MenuInterior from '../MenuInterior';
import 'primeicons/primeicons.css';
import { AuthContext } from '../../context/AuthContext';
import JobPost from '../Interior/JobPost';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { authUtils } from '../../utils/auth';
import ApplicationCard from '../Interior/ApplicationCard';
import axios from 'axios';
import TeacherAppCard from '../Interior/AppCardTeacher';
import PendingPost from '../UserPosts/pendingPost';
import { apiBaseUrl } from '../../config/config';

export default function AdminPanel() {
    // const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(authUtils.getStoredUserData())
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [applications, setApplications] = useState([]);
    const [pendingJobPost, setPendingJobPost] = useState([]);
    const [teacherApps, setTeacherApps] = useState([]);
    const [jobPosts, setJobPosts] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authUtils.authenticatedRequest(`${apiBaseUrl}/users`);
                setUserList(response);
                console.log('User List:', response);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    const fetchApplications = async () => {
        try {
            // First get all job postings by this user
            const jobsResponse = await axios.get(`${apiBaseUrl}/job_postings`);
            const userJobs = jobsResponse.data.filter(job => job.user_id === userData.user_id);
            
            // Get applications for each job
            const allApplications = [];
            for (const job of userJobs) {
                const applicationsResponse = await axios.get(`${apiBaseUrl}/applications/job/${job.job_id}`);
                // Add job title to each application for context
                const applicationsWithJobInfo = applicationsResponse.data.map(app => ({
                    ...app,
                    job_title: job.job_title
                }));
                allApplications.push(...applicationsWithJobInfo);
            }

            setTeacherApps(allApplications);
            console.log('Teacher applications loaded:', allApplications);
        } catch (err) {
            console.log(err)
        }
    };

    const unapprovedPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/job_postings/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const pendingData = await response.json();
    
            const formattedPendingPosts = pendingData.map(job => {
                const user = userList.find(u => u.user_id === job.user_id) || {}; // Find user or default to an empty object
                console.log('PENDING User:', user);
                return {
                    id: job.job_id,
                    posterAvatar: user.profile_img_url || "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png",
                    posterUsername: user.account_username || "Unknown User", 
                    posterSchool: user.school_name || "Unknown School", 
                    jobTitle: job.job_title,
                    jobDescription: job.job_description,
                    filters: job.job_type_tag.concat(job.industry_tag),
                    googleFormLink: job.job_signup_form || '#'
                };
            });
    
            setPendingJobPost(formattedPendingPosts);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };
        
    useEffect(() => {
        if (userData.is_teacher) {
            fetchApplications();
        }
        const fetchAdminStatus = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/users/${userData.user_id}/admin-status`);
                if (response.data.isAdmin) {
                    setUserData(prevData => ({ ...prevData, isAdmin: true }));
                    unapprovedPosts(); // Call this only if the user is an admin
                }
            } catch (error) {
                console.error("Error fetching admin status:", error);
            }
        };
    
        if (userData.user_id) {
            fetchAdminStatus();
        }
    }, [userList, userData.user_id]);

    const fetchJobPost = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/job_postings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch job postings.');
            }

            const jobDataArray = await response.json();
            const userJobPosts = jobDataArray.filter((jobData) => jobData.user_id === userData?.user_id);

            const formattedJobPosts = jobDataArray.map((jobData) => {
                const user = userList.find(u => u.user_id === jobData.user_id) || {};

                return {
                    id: jobData.job_id,
                    posterAvatar: user.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                    posterUsername: user?.account_username || 'Unknown',
                    posterSchool: user?.school_name || 'Unknown School',
                    jobTitle: jobData.job_title || 'Default Job Title',
                    jobDescription: jobData.job_description || 'Default Job Description',
                    filters: jobData.job_type_tag.concat(jobData.industry_tag),
                    googleFormLink: jobData.job_signup_form || '#',
                    isApproved: jobData.isApproved,
                };
            }).filter((job) => job.isApproved);

            setJobPosts(formattedJobPosts);
        } catch (error) {
            console.error('Error fetching job postings:', error);
        }
    };

    useEffect(() => {
        if (userData.is_teacher || userData.is_admin) {
            fetchJobPost();
        }
    }, [userData]);

    useEffect(() => {
        const fetchStudentApplications = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/applications/user/${userData.user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const applicationsData = await response.json();
                setApplications(applicationsData);
                console.log('Applications loaded:', applicationsData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (!userData.is_teacher) {
            fetchStudentApplications();
        }
    }, [userData]);

    const handleOpenConfirmation = (jobIndex) => {
        setJobToDelete(jobIndex);
        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setJobToDelete(null);
        setShowConfirmation(false);
    };

    const handleConfirmDelete = async () => {
        if (jobToDelete !== null) {
            try {
                const jobId = jobPosts[jobToDelete]?.id;

                if (!jobId) throw new Error("Job ID not found.");

                const response = await fetch(`${apiBaseUrl}/job_postings/${jobId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete job post.');
                }

                setJobPosts((prevJobPosts) => prevJobPosts.filter((_, index) => index !== jobToDelete));
            } catch (error) {
                console.error("Error deleting job:", error);
            } finally {
                setShowConfirmation(false);
                setJobToDelete(null);
            }
        }
    };

    const handleApprovePost = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/job_postings/${jobId}/toggle-approval`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isApproved: true }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to approve job post.");
            }
    
            setPendingJobPost((prevPosts) => prevPosts.filter((post) => post.id !== jobId));
            await fetchJobPost();
            await unapprovedPosts(); // Refresh pending list
        } catch (error) {
            console.error("Error approving job post:", error);
        }
    };
    
    const handleDeletePost = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/job_postings/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete job post.");
            }
    
            setPendingJobPost((prevPosts) => prevPosts.filter((post) => post.id !== jobId));
            await unapprovedPosts(); // Refresh pending list
        } catch (error) {
            console.error("Error deleting job post:", error);
        }
    };
    

    return (
        <div>
            <MenuInterior />
            <div className='userPosts-wrapper-primary'>
                <div className='userPosts-wrapper-secondary' style={{ gridTemplateColumns: "1fr 1fr" }}>

                    {userData.isAdmin && pendingJobPost.length > 0 && (
                        <div>
                            <div className="userPosts-header-wrapper" style={{marginBottom: "1rem"}}>
                                <h2>Pending Job Posts</h2>
                                <i className="pi pi-hourglass"></i>
                            </div>
                            <div className="userPosts-content-wrapper">
                                {pendingJobPost.map((job, index) => (
                                    <PendingPost // Capitalized to match React component naming conventions
                                        key={index}
                                        posterAvatar={job.posterAvatar}
                                        posterUsername={job.posterUsername}
                                        posterSchool={job.posterSchool}
                                        jobTitle={job.jobTitle}
                                        jobDescription={job.jobDescription}
                                        filters={job.filters}
                                        googleFormLink={job.googleFormLink}
                                        onApprove={() => handleApprovePost(job.id)}
                                        onDelete={() => handleDeletePost(job.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <div className='userPosts-header-wrapper'>
                            <h2>
                                Admin Panel
                            </h2>
                            <i className="pi pi-send"></i>
                        </div>
    
                        <div className='content-wrap'>
                            <div className='userPosts-content-wrapper'>
                                {userData.isAdmin ? (
                                    jobPosts.length > 0 ? (
                                        jobPosts.map((job, index) => (
                                            <JobPost
                                                key={index}
                                                posterAvatar={job.posterAvatar}
                                                posterUsername={job.posterUsername}
                                                posterSchool={job.posterSchool}
                                                jobTitle={job.jobTitle}
                                                jobDescription={job.jobDescription}
                                                filters={job.filters}
                                                googleFormLink={job.googleFormLink}
                                                onDelete={() => handleOpenConfirmation(index)}
                                                showDelete={true}
                                                isTeacher={userData.is_teacher}
                                            />
                                        ))
                                    ) : (
                                        <p>No posts yet.</p>
                                    )
                                ) : (
                                    applications.length > 0 ? (
                                        applications.map((application, index) => (
                                            <ApplicationCard
                                                key={index}
                                                application={application}
                                            />
                                        ))
                                    ) : (
                                        <p>No applications yet. Go to the home page to view listings and apply!</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <Dialog
                header="Confirm Deletion"
                visible={showConfirmation}
                style={{ width: '400px' }}
                onHide={handleCloseConfirmation}
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={handleCloseConfirmation} className="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" onClick={handleConfirmDelete} className="p-button-danger" />
                    </div>
                }
            >
                <p>Are you sure you want to delete this job post?</p>
            </Dialog>
        </div>
    );
}
