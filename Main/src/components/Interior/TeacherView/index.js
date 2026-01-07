// src/components/TeacherDashboard.js
import { useNavigate } from 'react-router-dom'
import { authUtils } from '../../../utils/auth'
import { useLocation } from 'react-router-dom';

import MenuInterior from '../../MenuInterior'
import AddPostBar from '../AddPostBar'
import ViewSwitcherSidebar from '../../PreviewModule';

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { Avatar } from 'primereact/avatar'
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import {
  Users,
  FileText,
  Eye,
  Plus,
  Building,
  MapPin,
  LogOut,
  BadgeInfo,
  RotateCw
} from 'lucide-react'
import './index.scss'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState('')
  const location = useLocation();
  const isAdminPreview = location.state?.isAdminPreview;

  // Get user data on component mount
  useEffect(() => {
    const user_info_getter = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const username = user?.username

        if (!username) {
          // setError('No user information found');
          navigate('/sign-in')
          return
        }

        const result = await authUtils.getUserInfo(username)

        if (result.success) {
          setUserData(result.data)
          console.log('User data fetched successfully:', result.data)
        } else if (result.error.includes('Authentication failed')) {
          navigate('/sign-in')
        }
      } catch (error) {
        if (error.message.includes('Authentication failed')) {
          navigate('/sign-in')
        }
      }
    }
    user_info_getter()
  }, [navigate])

  useEffect(() => {
    if (userData && userData.user_id) {
      fetchJobPost()
      fetchApplications()
    }
  }, [userData])

  const [jobPosts, setJobPosts] = useState([])
  const [totalJobPosts, setTotalJobPosts] = useState(0)
  const [pendingLenghth, setPendingLength] = useState(0)

  const fetchJobPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/job_postings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch job postings.')
      }

      const jobDataArray = await response.json()

      const PendingJobPosts = jobDataArray.filter(
        (jobData) => jobData.user_id === userData?.user_id && !jobData.isApproved
      )

      console.log('Pending Job Posts:', PendingJobPosts);

      setPendingLength(PendingJobPosts.length);

      const userJobPosts = jobDataArray.filter(
        (jobData) => jobData.user_id === userData?.user_id && jobData.isApproved
      )

      const formattedJobPosts = userJobPosts.map((jobData) => ({
        id: jobData.job_id,
        posterAvatar:
          userData.profile_img_url ||
          'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
        posterUsername: userData?.account_username || 'Unknown',
        posterSchool: userData?.school_name || 'Unknown School',
        jobTitle: jobData.job_title || 'Default Job Title',
        jobDescription: jobData.job_description || 'Default Job Description',
        filters: jobData.job_type_tag.concat(jobData.industry_tag),
        googleFormLink: jobData.job_signup_form || '#',
        date: dayjs(jobData.date_created).fromNow() || "Unknown Date",
        
      }))

      setJobPosts(formattedJobPosts)
      const length = formattedJobPosts.length
      setTotalJobPosts(length)
    } catch (error) {
      console.error('Error fetching job postings:', error)
    }
  }

  const [applications, setApplications] = useState([])
  const [totalApplications, setTotalApplications] = useState(0)
  const [activeApplications, setActiveApplications] = useState(0)

  const fetchApplications = async () => {
    try {
      // First get all job postings by this user
      const token = localStorage.getItem('token');
      const jobsResponse = await axios.get(`http://localhost:4000/job_postings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const userJobs = jobsResponse.data.filter(
        (job) => job.user_id === userData.user_id
      )

      // Get applications for each job
      const allApplications = []
      for (const job of userJobs) {
        const applicationsResponse = await axios.get(
          `http://localhost:4000/applications/job/${job.job_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        // Add job title and flatten application_data to each application
        const applicationsWithJobInfo = applicationsResponse.data.map(
          (app) => ({
            ...app,
            job_title: job.job_title,
            why_interested: app.why_interested || app.application_data?.why_interested || '',
            relevant_skills: app.relevant_skills || app.application_data?.relevant_skills || '',
            hope_to_gain: app.hope_to_gain || app.application_data?.hope_to_gain || '',
            // Include interview fields
            interviewDate: app.interview_date || app.interviewDate,
            interviewLocation: app.interview_location || app.interviewLocation
          })
        )
        allApplications.push(...applicationsWithJobInfo)
      }

      // Count total applications
      const totalApplicationsReceived = allApplications.length

      const activeApplications = allApplications.filter(
        (application) => !application.isComplete
      ).length

      setApplications(allApplications)

      console.log('Applications:', allApplications)

      setTotalApplications(totalApplicationsReceived)
      setActiveApplications(activeApplications)
    } catch (err) {
      console.log(err)
    }
  }

  const [userList, setUserList] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authUtils.authenticatedRequest(
          'http://localhost:4000/users'
        )
        setUserList(response)
        console.log('User List:', response)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUsers()
  }, [])

  const stats = [
    {
      label: 'Total Job Posts',
      value: totalJobPosts,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Applications Received',
      value: totalApplications,
      icon: Users,
      color: 'green',
    },
    { label: 'Pending Posts', value: pendingLenghth, icon: RotateCw, color: 'purple' },
  ]

  const getJobPostsWithCounts = () => {
    if (jobPosts.length === 0 || applications.length === 0) {
      return jobPosts
    }

    // Count applications per job title
    const counts = {}
    applications.forEach((app) => {
      const title = app.job_title
      counts[title] = (counts[title] || 0) + 1
    })

    const updatedJobPosts = jobPosts.map(post => ({
      ...post,
      applications_count: counts[post.jobTitle] || 0
    }));

    setJobPosts(updatedJobPosts);
  }
  
  useEffect(() => {
    getJobPostsWithCounts()
  }, [applications])

  const [selectedApp, setSelectedApp] = useState(null)
  const [studentInfoMap, setStudentInfoMap] = useState({})
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [status, setStatus] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [deletedIds, setDeletedIds] = useState([])
  const [interviewDate, setInterviewDate] = useState(null);
  const [interviewLocation, setInterviewLocation] = useState('');

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Interview', value: 'interview' },  // Changed from 'Approved'
    { label: 'Rejected', value: 'rejected' },
    { label: 'Under Review', value: 'under_review' },
  ]

  const fetchStudentInfo = async (userId) => {
    if (studentInfoMap[userId]) return
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/get-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      setStudentInfoMap((prev) => ({ ...prev, [userId]: data }))
    } catch (err) {
      console.error('Error fetching student info:', err)
    }
  }

const fetchAppDetails = async (app) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `http://localhost:4000/applications/${app.application_id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await res.json()
    setStatus(data.status || data.application_status || '')
    setReviewText(data.review_feedback || '')
    // Add interview details
    if (data.interview_date) {
      setInterviewDate(new Date(data.interview_date));
    }
    setInterviewLocation(data.interview_location || '');
  } catch (err) {
    console.error('Error fetching application details:', err)
  }
}

  const handleOpenReview = async (app) => {
    setSelectedApp(app)
    await fetchAppDetails(app)
    setShowReviewModal(true)
  }

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
        isComplete: true,
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
      const response = await fetch(
        `http://localhost:4000/applications/${selectedApp.application_id}/status`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update application' }));
        alert(`Error: ${errorData.message || 'Failed to update application'}`);
        throw new Error(errorData.message || 'Failed to update application');
      }
      
      const updatedApp = await response.json();
      console.log('Review submitted successfully:', updatedApp);
      
      setShowReviewModal(false)
      setSelectedApp(null)
      setStatus('')
      setReviewText('')
      setInterviewDate(null)
      setInterviewLocation('')
      fetchApplications()
    } catch (err) {
      console.error('Error submitting review:', err)
      alert(`Failed to submit review: ${err.message}`);
    }
  }

  const saveDraft = async () => {
    try {
      const requestBody = {
        application_status: status,
        review_feedback: reviewText,
        isComplete: false,
      };

      // Add interview details if status is interview
      if (status === 'interview') {
        requestBody.interview_date = interviewDate;
        requestBody.interview_location = interviewLocation;
      }

      const token = localStorage.getItem('token');
      await fetch(
        `http://localhost:4000/applications/${selectedApp.application_id}/status`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        }
      )
      setShowReviewModal(false)
    } catch (err) {
      console.error('Error saving draft:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await fetch(
        `http://localhost:4000/applications/${selectedApp.application_id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      setDeletedIds((prev) => [...prev, selectedApp.application_id])
      setShowDeleteDialog(false)
    } catch (err) {
      console.error('Error deleting application:', err)
    }
  }

  const goToProfile = (userId) => {
    navigate(`/accountpage`, { state: { userid: userId } })
  }

  useEffect(() => {
    applications.forEach((app) => fetchStudentInfo(app.user_id))
  }, [applications])

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
  )

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
  )

  const [dialogVisible, setDialogVisible] = useState(false)

  return (
    <div className='teacher-dash-view-container'>
      <MenuInterior />
      {isAdminPreview && <ViewSwitcherSidebar />}

      <div className="teacher-dashboard-wrapper">
        <div className="dashboard-container">
          {/* Left Sidebar */}
          <div className="sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="flex-auto">
                  <Avatar
                    image={
                      userData?.profile_img_url ||
                      'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                    }
                    className="mr-2"
                    size="xlarge"
                    shape="circle"
                  />
                </div>
                <h2 className="profile-title">
                  {userData?.account_username || 'Loading...'}
                </h2>
                <p className="profile-subtitle">
                  {userData?.school_name || 'Loading...'}
                </p>
              </div>

              <div className="quick-stats">
                <div className="stat-item active">
                  <div className="stat-value">{totalJobPosts}</div>
                  <div className="stat-label">Active Jobs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{activeApplications}</div>
                  <div className="stat-label">Applications</div>
                </div>
              </div>
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => setDialogVisible(true)}
                >
                  <Plus size={18} />
                  Create New Job
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/contactdashboard/DashBoardFAQ')}
                >
                  <BadgeInfo size={18} />
                  FAQ
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/accountpage')}
                >
                  <Building size={18} />
                  Account Settings
                </button>
                <button
                  className="btn logout-btn"
                  onClick={() => {
                    authUtils.logout()
                    navigate('/')
                  }}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  <LogOut size={18} />
                  LogOut
                </button>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="main-content">
            {/* Header */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '2%',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
              className="dashboard-header-wrapper"
            >
              <div className="dashboard-header">
                <div className="header-content">
                  <h1 className="welcome-title">
                    Welcome back, {userData?.account_username || 'Loading...'}!
                    <span className="wave-emoji">👋</span>
                  </h1>
                  <p className="welcome-subtitle">
                    Here's what's happening with your job postings today.
                  </p>
                </div>
                <button
                  className="btn btn-post"
                  onClick={() => setDialogVisible(true)}
                >
                  <Plus size={18} />
                  Post New Job
                </button>
              </div>
              {/* Stats Cards */}
              <div className="dashboard-cards">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`stat-card ${stat.color}`}
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <div className="stat-icon">
                      <stat.icon size={24} />
                    </div>
                    <div className="stat-number">{stat.value}</div>
                    <div className="stat-title">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Content Grid */}
            <div className="content-grid">
              {/* Recent Job Posts */}
              <div className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Recent Job Posts</h2>
                  <button className="view-all-btn" onClick={() => navigate('/userposts')}>View All Jobs →</button>
                </div>

                <div className="job-posts">
                  {jobPosts.slice(0, 2).map((job) => (
                    <div key={job.job_id} className="job-card">
                      <h3 className="job-title">{job.jobTitle}</h3>
                      <div className="job-meta">
                        <span className="job-meta-item">
                          <Building size={14} />
                          Posted {job.date}
                        </span>
                        <span className="job-meta-item">
                          <MapPin size={14} />
                          {userData.state}
                        </span>
                      </div>

                      <div className="job-tags">
                        {Array.isArray(job.filters) &&
                          job.filters.map((filter) => (
                            <span key={filter} className="tag tag-green">
                              {filter}
                            </span>
                          ))}
                      </div>

                      <div className="job-stats">
                        <span className="job-stat">
                          <Users size={14} />
                          {job.applications_count} Applications
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Applications */}
              <div className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Recent Applications</h2>
                  <button className="view-all-btn" onClick={() => navigate('/userposts')}>View All →</button>
                </div>

                <div className="applications">
                  {applications
                    .filter((application) => !application.isComplete)
                    .slice(0, 1)
                    .map((app) => {
                      const applicant = userList.find(
                        (user) => user.user_id === app.user_id
                      )
                      if (deletedIds.includes(app.application_id)) return null
                      const student = studentInfoMap[app.user_id]

                      return (
                        <div
                          key={app.application_id}
                          className="application-card"
                        >
                          <div className="applicant-header">
                            <Avatar
                              image={
                                applicant?.profile_img_url ||
                                'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                              }
                              size="large"
                              shape="circle"
                              className="mr-2"
                            />
                            <div className="applicant-info">
                              <h3 className="applicant-name">
                                {applicant?.account_username || 'Unknown User'}
                              </h3>
                              <p className="applicant-position">
                                Applied for {app.job_title}
                              </p>
                            </div>
                          </div>

                          <p className="applicant-experience">
                            <strong>Reasons:</strong> "{app.why_interested}"
                            <br />
                            <strong>Skills</strong>: "{app.relevant_skills}"
                          </p>

                          <div className="application-actions">
                            <button
                              onClick={() => goToProfile(app.user_id)}
                              className="action-btn review"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleOpenReview(app)}
                              className="action-btn approve"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app)
                                setShowDeleteDialog(true)
                              }}
                              className="action-btn decline"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )
                    })}

                  <Dialog
                    header="Review Application"
                    visible={showReviewModal}
                    style={{ width: '70vw' }}
                    footer={reviewModalFooter}
                    onHide={() => setShowReviewModal(false)}
                  >
                    <div className="review-form">
                      <div className="field">
                        <label htmlFor="status" className="font-bold">
                          Status
                        </label>
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
                          <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--surface-border)' }} />
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
                        <label htmlFor="review" className="font-bold">
                          Review Comments
                        </label>
                        <InputTextarea
                          id="review"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={8}
                          className="w-full mt-2"
                          placeholder="Enter your review comments here..."
                          autoResize
                          style={{ minHeight: '200px', width: '100%' }}
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
                      <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: '2rem' }}
                      />
                      <span>
                        Are you sure you want to delete this application?
                      </span>
                    </div>
                  </Dialog>
                </div>
                <AddPostBar
                  visible={dialogVisible}
                  onClose={() => setDialogVisible(false)}
                  addJobPost={(newJobPost) => {
                    // Handle after adding job post if needed
                    console.log('New job posted:', newJobPost)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
