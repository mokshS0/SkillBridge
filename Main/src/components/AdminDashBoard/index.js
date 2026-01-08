import './index.scss'
import MenuInterior from '../MenuInterior'
import AddPostBar from '../Interior/AddPostBar'
import React, { useState, useEffect } from 'react'
import { authUtils } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { apiBaseUrl } from '../../config/config'
import {
  Users,
  LogOut,
  ChartLine,
  List,
  GraduationCap,
  BookOpen,
  UserCog,
} from 'lucide-react'

const AdminDashBoard = () => {
  const [activeView, setActiveView] = useState('admin')
  const [selectedSection, setSelectedSection] = useState('dashboard')
  const [userList, setUserList] = useState([])
  const [pendingJobPost, setPendingJobPost] = useState([])
  const [jobPosts, setJobPosts] = useState([])
  const [dialogVisible, setDialogVisible] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authUtils.authenticatedRequest(
          `${apiBaseUrl}/users`
        )
        setUserList(response)
        console.log('User List:', response)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUsers()
  }, [])

  const unapprovedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/job_postings/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }
      const pendingData = await response.json()

      const formattedPendingPosts = pendingData.map((job) => {
        const user = userList.find((u) => u.user_id === job.user_id) || {}
        console.log('PENDING User:', user)
        return {
          id: job.job_id,
          posterAvatar:
            user.profile_img_url ||
            'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
          posterUsername: user.account_username || 'Unknown User',
          posterSchool: user.school_name || 'Unknown School',
          jobTitle: job.job_title,
          jobDescription: job.job_description,
          filters: job.job_type_tag.concat(job.industry_tag),
          googleFormLink: job.job_signup_form || '#',
        }
      })

      setPendingJobPost(formattedPendingPosts)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchJobPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/job_postings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch job postings.')
      }

      const jobDataArray = await response.json()

      const formattedJobPosts = jobDataArray
        .map((jobData) => {
          const user = userList.find((u) => u.user_id === jobData.user_id) || {}

          return {
            id: jobData.job_id,
            posterAvatar:
              user.profile_img_url ||
              'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
            posterUsername: user?.account_username || 'Unknown',
            posterSchool: user?.school_name || 'Unknown School',
            jobTitle: jobData.job_title || 'Default Job Title',
            jobDescription:
              jobData.job_description || 'Default Job Description',
            filters: jobData.job_type_tag.concat(jobData.industry_tag),
            googleFormLink: jobData.job_signup_form || '#',
            isApproved: jobData.isApproved,
          }
        })
        .filter((job) => job.isApproved)

      setJobPosts(formattedJobPosts)
    } catch (error) {
      console.error('Error fetching job postings:', error)
    }
  }

  useEffect(() => {
    unapprovedPosts()
    fetchJobPost()
  }, [userList])

  const [dashboardStats, setDashboardStats] = useState({
    totalJobPosts: 0,
    pendingApproval: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    const updateDashboardStats = () => {
      const totalJobPosts = jobPosts.length
      const pendingApproval = pendingJobPost.length
      const totalUsers = userList.length

      setDashboardStats({
        totalJobPosts,
        pendingApproval,
        totalUsers,
      })
    }

    updateDashboardStats()
  }, [pendingJobPost, jobPosts, userList])

  const handleApprove = (id) => {
    console.log('Approve post:', id)
  }

  const handleDecline = (id) => {
    console.log('Decline post:', id)
  }

  const handleEdit = (id) => {
    console.log('Edit post:', id)
  }

  const handleDelete = (id) => {
    console.log('Delete post:', id)
  }

  const handleOpenConfirmation = (jobIndex) => {
    setJobToDelete(jobIndex)
    setShowConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setJobToDelete(null)
    setShowConfirmation(false)
  }
  const [jobToApprove, setJobToApprove] = useState(null)
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false)

  const ApproveConfirmation = (jobIndex) => {
    setJobToApprove(jobIndex)
    setShowApproveConfirmation(true)
  }

  const ApproveCloseConfirmation = () => {
    setJobToApprove(null)
    setShowApproveConfirmation(false)
  }

  const handleConfirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        console.log('Deleting job post:', jobToDelete)
        const jobId = jobToDelete

        if (!jobId) throw new Error('Job ID not found.')

        const token = localStorage.getItem('token');
        const response = await fetch(
          `${apiBaseUrl}/job_postings/${jobId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to delete job post.')
        }

        setPendingJobPost((prevPosts) =>
          prevPosts.filter((post) => post.id !== jobId)
        )

        await fetchJobPost()
        await unapprovedPosts() // Refresh pending list
      } catch (error) {
        console.error('Error deleting job:', error)
      } finally {
        setShowConfirmation(false)
        setJobToDelete(null)
      }
    }
  }

  const handleApprovePost = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/job_postings/${jobId}/toggle-approval`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isApproved: true }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to approve job post.')
      }

      setPendingJobPost((prevPosts) =>
        prevPosts.filter((post) => post.id !== jobId)
      )
      await fetchJobPost()
      await unapprovedPosts() // Refresh pending list
    } catch (error) {
      console.error('Error approving job post:', error)
    } finally {
      setShowApproveConfirmation(false)
      setJobToApprove(null)
    }
  }

  const [activeDelete, setActiveDelete] = useState(null)
  const [activeConfirmation, setActiveConfirmation] = useState(false)

  const deleteActiveConfirmation = (jobIndex) => {
    setActiveDelete(jobIndex)
    setActiveConfirmation(true)
  }

  const ActiveCloseConfirmation = () => {
    setActiveDelete(null)
    setActiveConfirmation(false)
  }

  const handleDeletePost = async () => {
    if (activeDelete !== null) {
      try {
        console.log('Deleting job post at index:', activeDelete)
        const jobId = activeDelete

        if (!jobId) throw new Error('Job ID not found.')

        const token = localStorage.getItem('token');
        const response = await fetch(
          `${apiBaseUrl}/job_postings/${jobId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to delete job post.')
        }

        setPendingJobPost((prevPosts) =>
          prevPosts.filter((post) => post.id !== jobId)
        )
        setJobPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== jobId)
        )

        await fetchJobPost()
        await unapprovedPosts() // Refresh pending list
      } catch (error) {
        console.error('Error deleting job:', error)
      } finally {
        setActiveConfirmation(false)
        setActiveDelete(null)
      }
    }
  }

  // Render Dashboard Panel
  const renderDashboard = () => (
    <div className='admin-dash-view-container'>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{dashboardStats.totalJobPosts}</div>
          <div className="stat-title">Total Job Posts</div>
        </div>
        <div className="stat-card pink">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{dashboardStats.pendingApproval}</div>
          <div className="stat-title">Pending Approval</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-value">{dashboardStats.totalUsers}</div>
          <div className="stat-title">Total Users</div>
        </div>
      </div>
      {/* Content Sections */}
      <div className="content-grid">
        {/* Pending Job Posts */}
        <div className="content-section">
          <div className="section-header">
            <h2>Pending Job Posts</h2>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setSelectedSection('posts')
              }}
              className="view-all"
            >
                View All →
            </a>
          </div>
          <div className="posts-list">
            {pendingJobPost.slice(0, 2).map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="user-info">
                    <Avatar
                      image={
                        post?.posterAvatar ||
                        'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                      }
                      size="large"
                      shape="circle"
                      className="mr-2"
                    />{' '}
                    <div className="user-details">
                      <h4>{post.posterUsername}</h4>
                      <p>
                        {post.posterSchool} •{' '}
                        <span className="status pending">Pending</span>
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="job-title">{post.jobTitle}</h3>
                <p className="job-description">{post.jobDescription}</p>
                <div className="tags">
                  {post.filters.map((tag, index) => (
                    <span
                      key={index}
                      className={`tag ${tag.toLowerCase().replace('-', '')}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="post-actions">
                  <button
                    className="approve-btn"
                    onClick={() => ApproveConfirmation(post.id)}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleOpenConfirmation(post.id)}
                  >
                    ✗ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Active Job Posts */}
        <div className="content-section">
          <div className="section-header">
            <h2>Active Job Posts</h2>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setSelectedSection('posts')
              }}
              className="view-all"
            >
              {' '}
              View All →
            </a>
          </div>
          <div className="posts-list">
            {jobPosts.slice(0, 2).map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="user-info">
                    <Avatar
                      image={
                        post?.posterAvatar ||
                        'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                      }
                      size="large"
                      shape="circle"
                      className="mr-2"
                    />
                    <div className="user-details">
                      <h4>{post.posterUsername}</h4>
                      <p>
                        {post.posterSchool} •{' '}
                        <span className="status active">Active</span>
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="job-title">{post.jobTitle}</h3>
                <p className="job-description">{post.jobDescription}</p>
                <div className="tags">
                  {post.filters.map((tag, index) => (
                    <span
                      key={index}
                      className={`tag ${tag.toLowerCase().replace('-', '')}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="post-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteActiveConfirmation(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Render Manage Posts Panel
  const renderManagePosts = () => (
    <div className='admin-dash-view-container'>
      <div className="manage-posts-panel">
        <div className="panel-header">
          <h2>Manage Posts</h2>
          <p>Review and manage all job posts in your system</p>
        </div>
        <div className="posts-sections">
          {/* All Pending Posts */}
          <div className="content-section full-width">
            <div className="section-header">
              <h3>Pending Approval ({pendingJobPost.length})</h3>
            </div>
            <div className="posts-list">
              {pendingJobPost.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <Avatar
                        image={
                          post?.posterAvatar ||
                          'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                        }
                        size="large"
                        shape="circle"
                        className="mr-2"
                      />
                      <div className="user-details">
                        <h4>{post.posterUsername}</h4>
                        <p>
                          {post.posterSchool} •{' '}
                          <span className="status pending">Pending</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="job-title">{post.jobTitle}</h3>
                  <p className="job-description">{post.jobDescription}</p>
                  <div className="tags">
                    {post.filters.map((tag, index) => (
                      <span
                        key={index}
                        className={`tag ${tag.toLowerCase().replace('-', '')}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="post-actions">
                    <button
                      className="approve-btn"
                      onClick={() => ApproveConfirmation(post.id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => handleOpenConfirmation(post.id)}
                    >
                      ✗ Decline
                    </button>
                  </div>
                </div>
              ))}
              {pendingJobPost.length === 0 && (
                <div className="empty-state">
                  <p>No pending posts to review</p>
                </div>
              )}
            </div>
          </div>
          {/* All Active Posts */}
          <div className="content-section full-width">
            <div className="section-header">
              <h3>Active Posts ({jobPosts.length})</h3>
            </div>
            <div className="posts-list">
              {jobPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <Avatar
                        image={
                          post?.posterAvatar ||
                          'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                        }
                        size="large"
                        shape="circle"
                        className="mr-2"
                      />
                      <div className="user-details">
                        <h4>{post.posterUsername}</h4>
                        <p>
                          {post.posterSchool} •{' '}
                          <span className="status active">Active</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="job-title">{post.jobTitle}</h3>
                  <p className="job-description">{post.jobDescription}</p>
                  <div className="tags">
                    {post.filters.map((tag, index) => (
                      <span
                        key={index}
                        className={`tag ${tag.toLowerCase().replace('-', '')}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="post-actions">
                    <button
                      className="delete-btn"
                      onClick={() => deleteActiveConfirmation(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {jobPosts.length === 0 && (
                <div className="empty-state">
                  <p>No active posts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render User Management Panel
  const renderUserManagement = () => (
    <div className='admin-dash-view-container'>
      <div className="user-management-panel">
        <div className="panel-header">
          <h2>User Management</h2>
          <p>Manage all users in your system</p>
        </div>
        <div className="users-section">
          <div className="content-section full-width">
            <div className="section-header">
              <h3>All Users ({userList.length})</h3>
              <div className="user-stats">
                <span className="stat-badge">
                  Teachers: {userList.filter((user) => user.is_teacher).length}
                </span>
                <span className="stat-badge">
                  Students: {userList.filter((user) => !user.is_teacher).length}
                </span>
              </div>
            </div>
            <div className="users-grid">
              {userList.map((user) => (
                <div key={user.user_id} className="user-card">
                  <div className="user-header">
                    <Avatar
                      image={
                        user.profile_img_url ||
                        'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                      }
                      size="large"
                      shape="circle"
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <h4>{user.account_username}</h4>
                      <p className="user-email">{user.account_email}</p>
                      <span className={`user-type ${user.account_type}`}>
                        {user.account_type?.charAt(0).toUpperCase() +
                          user.account_type?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="user-details">
                    <p>
                      <strong>School:</strong>{' '}
                      {user.school_name || 'Not specified'}
                    </p>
                    <p>
                      <strong>Real Name:</strong>{' '}
                      {user.real_name || 'Not specified'}
                    </p>
                  </div>
                  <div className="user-actions">
                    {/* <button className="edit-btn">Edit User</button> */}
                    <button className="delete-btn">Deactivate</button>
                  </div>
                </div>
              ))}
              {userList.length === 0 && (
                <div className="empty-state">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Function to render the appropriate panel based on selectedSection
  const renderMainContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard()
      case 'posts':
        return renderManagePosts()
      case 'users':
        return renderUserManagement()
      default:
        return renderDashboard()
    }
  }

  // For student preview (stays on Interior page)
    const handleStudentPreview = () => {
        navigate('/interior', { state: { previewMode: 'student' } });
    };

    // For teacher preview (goes to TeacherDashboard)
    const handleTeacherPreview = () => {
        navigate('/interior', { state: { previewMode: 'teacher' } });
    };

  return (
    <div className='admin-dash-view-container'>
      <MenuInterior />
      <div className="admin-panel">
        {/* Sidebar */}
        <div className="sidebar-admin">
          <div className="admin-profile">
            <div className="avatar">AD</div>
            <div className="admin-info">
              <h3>Admin Panel</h3>
              <p>System Administrator</p>
            </div>
          </div>
          <div className="quick-stats">
            <div className="stat-box pending">
              <div className="stat-number">
                {dashboardStats.pendingApproval}
              </div>
              <div className="stat-label">Pending Posts</div>
            </div>
            <div className="stat-box active">
              <div className="stat-number">{dashboardStats.totalJobPosts}</div>
              <div className="stat-label">Active Posts</div>
            </div>
          </div>
          <div className="view-switcher">
            <h4>Switch View</h4>
            <div
              className={`view-option ${
                activeView === 'admin' ? 'active' : ''
              }`}
              onClick={() => setActiveView('admin')}
            >
              <span className="icon">
                <UserCog />
              </span>
              Admin View
            </div>
            <div
              className={`view-option ${
                activeView === 'teacher' ? 'active' : ''
              }`}
              onClick={() => handleTeacherPreview()}
            >
              <span className="icon">
                <GraduationCap />
              </span>
              Teacher View
            </div>
            <div
              className={`view-option ${
                activeView === 'student' ? 'active' : ''
              }`}
              onClick={() => handleStudentPreview()}
            >
              <span className="icon">
                <BookOpen />
              </span>
              Student View
            </div>
          </div>
          <div className="navigation">
            <div
              className={`nav-item ${
                selectedSection === 'dashboard' ? 'active' : ''
              }`}
              onClick={() => setSelectedSection('dashboard')}
            >
              <span className="icon">
                <ChartLine />
              </span>
              Dashboard
            </div>
            <div
              className={`nav-item ${
                selectedSection === 'posts' ? 'active' : ''
              }`}
              onClick={() => setSelectedSection('posts')}
            >
              <span className="icon">
                <List />
              </span>
              Manage Posts
            </div>
            <div
              className={`nav-item ${
                selectedSection === 'users' ? 'active' : ''
              }`}
              onClick={() => setSelectedSection('users')}
            >
              <span className="icon">
                <Users />
              </span>
              User Management
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              authUtils.logout()
              navigate('/')
            }}
          >
            <span className="icon">
              <LogOut />
            </span>
            Log Out
          </button>
        </div>
        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <div className="welcome-section">
              <h1>Welcome back, Admin! 👋</h1>
              <p>Here's what's happening with your platform today.</p>
            </div>
            <button
              className="add-post-btn"
              onClick={() => setDialogVisible(true)}
            >
              Add New Post
            </button>
          </div>

          {/* Dynamic Content Based on Selected Section */}
          {renderMainContent()}

          <AddPostBar
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            addJobPost={(newJobPost) => {
              console.log('New job posted:', newJobPost)
            }}
          />

          <Dialog
            header="Confirm Deletion"
            visible={showConfirmation}
            style={{ width: '400px' }}
            onHide={handleCloseConfirmation}
            footer={
              <div>
                <Button
                  label="No"
                  icon="pi pi-times"
                  onClick={handleCloseConfirmation}
                  className="p-button-text"
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  onClick={handleConfirmDelete}
                  className="p-button-danger"
                />
              </div>
            }
          >
            <p>Are you sure you want to delete this job post?</p>
          </Dialog>

          <Dialog
            header="Confirm Approval"
            visible={showApproveConfirmation}
            style={{ width: '400px' }}
            onHide={ApproveCloseConfirmation}
            footer={
              <div>
                <Button
                  label="No"
                  icon="pi pi-times"
                  onClick={ApproveCloseConfirmation}
                  className="p-button-text"
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  onClick={() => handleApprovePost(jobToApprove)}
                  className="p-button-success"
                />
              </div>
            }
          />

          <Dialog
            header="Confirm Deletion"
            visible={activeConfirmation}
            style={{ width: '400px' }}
            onHide={ActiveCloseConfirmation}
            footer={
              <div>
                <Button
                  label="No"
                  icon="pi pi-times"
                  onClick={ActiveCloseConfirmation}
                  className="p-button-text"
                />
                <Button
                  label="Yes"
                  icon="pi pi-check"
                  onClick={handleDeletePost}
                  className="p-button-danger"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard
