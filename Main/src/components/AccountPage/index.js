import React, { useRef, useState, useEffect, useContext } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'
import { Avatar } from 'primereact/avatar'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { OverlayPanel } from 'primereact/overlaypanel'
import {
  Edit,
  Contact,
  MapPin,
  Building,
  Mail,
  Briefcase,
  Award,
  Code,
  Wrench,
} from 'lucide-react'
import './index2.scss'
import { Link, useAsyncError, useNavigate, useLocation } from 'react-router-dom'
import { authUtils } from '../../utils/auth'
import { getAISuggestedBio } from './openaiBio'
import { AuthContext } from '../../context/AuthContext'
import MenuInterior from '../MenuInterior'
import HistoryCompnent from './HistoryComp'
import SkillComponent from './SkillComp'
import ProjectComponent from './ProjectComp'
import AchieveComponent from './AchieveComp'
import { apiBaseUrl } from '../../config/config'

export default function AccountPage() {
  // Context and navigation
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  // User data state
  const [userData, setUserData] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [workHistory, setWorkHistory] = useState([])
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [achievements, setAchievements] = useState([])

  // Dialog states
  const [visible, setVisible] = useState(false)
  const [editDialog, setVisibleEdit] = useState(false)
  const [workHistoryDialog, setWorkHistoryDialog] = useState(false)
  const [AvatarVisible, setAvatarVisible] = useState(false)

  // Form states
  const [userBioValue, setUserBioValue] = useState('')
  const [userNameValue, setUserNameValue] = useState('')
  const [userCityValue, setUserCityValue] = useState('')
  const [userStateValue, setUserStateValue] = useState('')
  const [userEmailValue, setUserEmailValue] = useState('')

  // AI suggestion states
  const [aiSuggestion, setAISuggestion] = useState('')
  const [loading, setLoading] = useState(false)

  // Refs
  const toast = useRef(null)
  const op = useRef(null)

  // Computed values
  const displayedWorkHistory = workHistory.slice(0, 1)
  const hasMoreWorkHistory = workHistory.length > 1

  // Scroll to top on route change
  const useScrollToTop = () => {
    const { pathname } = useLocation()
    
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])
  }

  useScrollToTop()

  // AI suggestion handler - using mock bio directly for demo
  const handleAISuggestion = async () => {
    if (!aiSuggestion.trim()) return
    setLoading(true)
    try {
      // Use mock bio directly without making network call
      const mockBio = `Experienced professional with a passion for ${aiSuggestion || 'technology'}. 
Dedicated to continuous learning and professional growth.`
      setAISuggestion(mockBio)
      
      // OLD CODE - COMMENTED OUT (uncomment to enable AI bio generation via API)
      // console.log('Generating AI bio for:', aiSuggestion)
      // const generatedBio = await getAISuggestedBio(aiSuggestion)
      // setAISuggestion(generatedBio)
    } catch (error) {
      console.error('Error generating AI bio:', error)
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate AI suggestion',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  // Data fetching functions
  const fetchHistory = async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/user_history`)
      if (!response.ok) {
        throw new Error('Failed to fetch user history.')
      }

      const historyDataArray = await response.json()
      const userHistoryData = historyDataArray.filter(
        (historyData) => historyData.user_id === userId
      )

      const workHistory = userHistoryData.map((historyData) => ({
        id: historyData.id,
        company: historyData?.company_name || '',
        role: historyData?.role || '',
        duration: historyData?.duration || '',
        description: historyData?.description || '',
      }))

      setWorkHistory(workHistory)
    } catch (error) {
      console.error('Error fetching work history:', error)
    }
  }

  const fetchSkills = async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/user_skills`)
      if (!response.ok) {
        throw new Error('Failed to fetch user skills.')
      }

      const skillsDataArray = await response.json()
      const userSkillsData = skillsDataArray.filter(
        (skillData) => skillData.user_id === userId
      )

      const formattedSkills = userSkillsData.map((skillData) => ({
        id: skillData.user_id,
        name: skillData?.skill_name || '',
        description: skillData?.skill_description || '',
      }))

      setSkills(formattedSkills)
    } catch (error) {
      console.error('Error fetching user skills:', error)
    }
  }

  const fetchProjects = async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/user_projects`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects.')
      }

      const projectDataArray = await response.json()
      const userProject = projectDataArray.filter(
        (projectData) => projectData.user_id === userId
      )

      const formattedProjects = userProject.map((projectData) => ({
        index: projectData?.user_id || 'No ID',
        name: projectData?.project_name || 'Unnamed Project',
        description: projectData?.project_description || 'No Description',
      }))

      setProjects(formattedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchAchievements = async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/user_achievements`)
      if (!response.ok) {
        throw new Error('Failed to fetch achievements.')
      }

      const achievementsDataArray = await response.json()
      const userAchievements = achievementsDataArray.filter(
        (achievement) => achievement.user_id === userId
      )

      const formattedAchievements = userAchievements.map((achievement) => ({
        id: achievement.user_id || 'No ID',
        name: achievement?.achievement_name || 'Unnamed Achievement',
        description: achievement?.achievement_description || 'No Description',
      }))

      setAchievements(formattedAchievements)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const targetUserId = location.state?.userid || authUtils.getStoredUserData().user_id
      
      const result = await authUtils.getUserById(targetUserId)
      
      if (result.success) {
        setUserData(result.data)
        
        await fetchHistory(targetUserId)
        await fetchSkills(targetUserId)
        await fetchProjects(targetUserId)
        await fetchAchievements(targetUserId)
        
        console.log('User data refreshed successfully')
      } else {
        console.error('Failed to refresh user data:', result.error)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Initialize user data
  const initializeUserData = async () => {
    try {
      if (location.state?.userid) {
        console.log(`Fetching user data for ID: ${location.state.userid}`)
        setSelectedUserId(location.state.userid)

        const result = await authUtils.getUserById(location.state.userid)
        
        if (result.success) {
          setUserData(result.data)
        } else {
          console.error('Failed to fetch user data:', result.error)
        }
      } else {
        setUserData(authUtils.getStoredUserData())
        setSelectedUserId(authUtils.getStoredUserData().user_id)
      }
    } catch (error) {
      console.error('Error initializing user data:', error)
    }
  }

  // Effects
  useEffect(() => {
    initializeUserData()
  }, [location.state?.userid])

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        await fetchHistory(userId)
        await fetchSkills(userId)
        await fetchProjects(userId)
        await fetchAchievements(userId)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (selectedUserId) {
      fetchData(selectedUserId)
    }
  }, [selectedUserId])

  // Avatar change handler
  const handleAvatarChange = (url) => {
    setUserData((prev) => ({ ...prev, profile_img_url: url }))
    setAvatarVisible(false)
  }
  // Save user info - Updated version
  const saveUserInfo = async () => {
    const updatedUserInfo = {
      real_name: userData.real_name,
      personal_email: userEmailValue || userData.personal_email,
      phone_number: userData.phone_number,
      birth_date: userData.birth_date ? new Date(userData.birth_date).toISOString().split('T')[0] : null,
      school_name: userData.school_name,
      school_district: userData.school_district,
      school_email: userData.school_email,
      account_username: userNameValue || userData.account_username,
      is_teacher: userData.is_teacher,
      city: userCityValue || userData.city,
      state: userStateValue || userData.state,
      bio: userBioValue || userData.bio,
      profile_img_url: userData.profile_img_url,
    }
    
    try {
      console.log('Updating user information:', updatedUserInfo)
      const response = await fetch(`${apiBaseUrl}/users/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserInfo),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('User information updated successfully:', result)
        
        // Update the stored auth data if this is the current user
        if (!location.state?.userid) {
          const currentStoredData = authUtils.getStoredUserData()
          const updatedStoredData = {
            ...currentStoredData,
            ...updatedUserInfo
          }
          // Assuming authUtils has a method to update stored data
          // You might need to implement this method in your authUtils
          authUtils.updateStoredUserData(updatedStoredData)
        }
        
        await refreshUserData()
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Information saved successfully',
          life: 3000
        })
        setVisibleEdit(false)
      } else {
        console.error('Failed to update user information:', response.status, response.statusText)
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save information',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Error occurred while updating user information:', error)
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving',
        life: 3000
      })
    }
  }
  const avatarChangerHeader = (
    <div className="flex items-center gap-4">
      <Avatar image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'} shape="circle" size="large" />
    </div>
  )

  if (!userData) {
    return (
      <div>
        <MenuInterior />
        <div className="account-page">
          <div className="account-container">
            <div className="hero-section">
              <div className="profile-header">
                <div className="profile-section">
                  <div className="profile-info">
                    <h1>Loading...</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='account-page-wrapper'>
      <MenuInterior />
      <div className="account-page">
        <div className="account-container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-background">
              <div className="citrus-pattern"></div>
            </div>

            <div className="profile-header">
              <div className="profile-section">
                <div className="profile-avatar">
                  <Avatar
                    image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'}
                    size="xlarge"
                    shape="circle"
                    className="avatar-main"
                  />
                </div>

                <div className="profile-info">
                  <div className="profile-main">
                    <h1 className="profile-name">
                      {userData?.real_name || userData?.account_username}
                    </h1>
                    {!location.state?.userid && (
                      <Button
                        icon={<Edit size={18} />}
                        rounded
                        className="edit-btn"
                        onClick={() => setVisibleEdit(true)}
                        tooltip="Edit Profile"
                        tooltipOptions={{ position: 'bottom' }}
                      />
                    )}
                  </div>

                  <div className="profile-details">
                    <span className="role-badge">
                      {userData?.is_teacher ? 'Teacher' : 'Student'}
                    </span>
                    <div className="location-info">
                      <Building size={18} />
                      <span>{userData?.school_name}</span>
                    </div>
                    <div className="location-info">
                      <MapPin size={18} />
                      <span>
                        {userData?.city}, {userData?.state}
                      </span>
                    </div>
                  </div>

                  <Button
                    label="Get In Touch"
                    icon={<Contact size={16} />}
                    className="contact-btn"
                    onClick={() => setVisible(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Bio Section */}
            <div className="content-card bio-card">
              <div className="card-header">
                <h2>Bio</h2>
              </div>
              <div className="card-content">
                <p>{userData?.bio || 'No bio available'}</p>
              </div>
            </div>

            {/* Work History Section */}
            <div className="content-card history-card">
              <div className="card-header">
                <div className="card-title-section">
                  <Briefcase size={20} />
                  <h2>Work History</h2>
                </div>
                {hasMoreWorkHistory && (
                  <Button
                    label="View All"
                    severity="info"
                    className="p-button-text p-button-sm"
                    onClick={() => setWorkHistoryDialog(true)}
                  />
                )}
              </div>
              <div className="card-content">
                {displayedWorkHistory.length > 0 ? (
                  displayedWorkHistory.map((job, index) => (
                    <div key={index} className="history-item">
                      <h3>{job.company}</h3>
                      <p className="job-role">{job.role}</p>
                      <p className="job-duration">{job.duration}</p>
                      <p className="job-description">{job.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No work history available</p>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {skills.length > 0 && (
              <div className="content-card skills-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <Code size={20} />
                    <h2>Skills</h2>
                  </div>
                </div>
                <div className="card-content">
                  <div className="skills-grid">
                    {skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <h3>{skill.name}</h3>
                        <p>{skill.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <div className="content-card projects-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <Wrench size={20} />
                    <h2>Projects</h2>
                  </div>
                </div>
                <div className="card-content">
                  <div className="projects-grid">
                    {projects.map((project, index) => (
                      <div key={index} className="project-item">
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
              <div className="content-card achievements-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <Award size={20} />
                    <h2>Achievements</h2>
                  </div>
                </div>
                <div className="card-content">
                  <div className="achievements-grid">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="achievement-item">
                        <h3>{achievement.name}</h3>
                        <p>{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Dialog */}
        <Dialog
          header="Contact Information"
          visible={visible}
          className="contact-dialog"
          onHide={() => setVisible(false)}
        >
          <div className="contact-content" style={{marginTop: '.75rem'}}>
            <div className="contact-item">
              <Mail size={20} />
              <span style={{marginLeft:'.75rem'}}> {userData?.personal_email}</span>
            </div>
          </div>
        </Dialog>

        {/* Work History Dialog */}
        <Dialog
          header="Complete Work History"
          visible={workHistoryDialog}
          className="work-history-dialog"
          onHide={() => setWorkHistoryDialog(false)}
          maximizable
        >
          <div className="work-history-content">
            {workHistory.map((job, index) => (
              <div key={index} className="history-item">
                <h3>{job.company}</h3>
                <p className="job-role">{job.role}</p>
                <p className="job-duration">{job.duration}</p>
                <p className="job-description">{job.description}</p>
              </div>
            ))}
          </div>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          maximizable
          className="edit-dialog"
          header="Edit Profile"
          visible={editDialog}
          onHide={() => setVisibleEdit(false)}
        >
          <div className="edit-content-wrapper">
            <div className="avatar-edit-wrap">
              <Avatar
                image={userData?.profile_img_url || 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'}
                className="avatar-edit-size"
                size="xlarge"
                shape="circle"
              />
              <Button
                icon="pi pi-user-edit"
                rounded
                severity="info"
                onClick={() => setAvatarVisible(true)}
              />

              <Dialog
                visible={AvatarVisible}
                modal
                header={avatarChangerHeader}
                onHide={() => setAvatarVisible(false)}
              >
                <h3 className="text-center">Select Avatar</h3>
                <div className="avatar-editor-wrapper">
                  {[
                    'https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg',
                    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                    'https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png',
                    'https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png',
                    'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                    'https://primefaces.org/cdn/primereact/images/avatar/xuxuefeng.png',
                    'https://primefaces.org/cdn/primereact/images/organization/walter.jpg',
                    'https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png',
                  ].map((url, index) => (
                    <Button key={index} onClick={() => handleAvatarChange(url)} style={{backgroundColor: '#f8fafc', border: 'none'}}>
                      <img src={url} alt="avatar" className="avatar-option" />
                    </Button>
                  ))}
                </div>
              </Dialog>
            </div>

            <Divider />

            <div className="userInfo-edit-wrapper">
              <h3>User Information</h3>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText
                  placeholder={userData?.account_username || 'Username'}
                  value={userNameValue}
                  onChange={(e) => setUserNameValue(e.target.value)}
                />
              </div>

              <div className="input-row">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-building"></i>
                  </span>
                  <InputText
                    placeholder={userData?.city || 'City'}
                    value={userCityValue}
                    onChange={(e) => setUserCityValue(e.target.value)}
                  />
                </div>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-building-columns"></i>
                  </span>
                  <InputText
                    placeholder={userData?.state || 'State'}
                    value={userStateValue}
                    onChange={(e) => setUserStateValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <InputText
                  placeholder={userData?.personal_email || 'Email'}
                  value={userEmailValue}
                  onChange={(e) => setUserEmailValue(e.target.value)}
                />
              </div>
            </div>

            <Divider />

            <div className="bio-edit-wrapper">
              <div className="bio-header">
                <h3>Bio</h3>
                <Button
                  label="AI Suggestion"
                  severity="info"
                  icon="pi pi-pencil"
                  onClick={(e) => {
                    op.current.toggle(e)
                    setAISuggestion(userBioValue)
                  }}
                  className="p-button-text"
                />

                <OverlayPanel ref={op} className="ai-overlay">
                  <div className="ai-suggestion-content">
                    <InputTextarea
                      placeholder="Edit your bio..."
                      autoResize
                      rows={5}
                      value={aiSuggestion}
                      onChange={(e) => setAISuggestion(e.target.value)}
                    />
                    <div className="ai-buttons">
                      <Button
                        label={loading ? 'Generating...' : 'Generate Bio'}
                        severity="info"
                        onClick={handleAISuggestion}
                        disabled={loading}
                      />
                      <Button
                        label="Use Bio"
                        severity="success"
                        onClick={() => setUserBioValue(aiSuggestion)}
                      />
                    </div>
                  </div>
                </OverlayPanel>
              </div>

              <InputTextarea
                placeholder="Enter your bio..."
                autoResize
                rows={5}
                value={userBioValue}
                onChange={(e) => setUserBioValue(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <Divider />

            <div className="history-edit-wrapper">
              <HistoryCompnent onUpdate={refreshUserData} />
            </div>

            <Divider />

            <div className="Skill-edit-wrapper">
              <SkillComponent onUpdate={refreshUserData} />
            </div>

            <Divider />

            <div className="project-edit-wrapper">
              <ProjectComponent onUpdate={refreshUserData} />
            </div>

            <Divider />

            <div className="achievement-edit-wrapper">
              <AchieveComponent onUpdate={refreshUserData} />
            </div>

            <div className="edit-actions">
              <Button
                label="Save Changes"
                severity="info"
                icon="pi pi-check"
                onClick={saveUserInfo}
              />
            </div>
          </div>
        </Dialog>

        <Toast ref={toast} />
      </div>
    </div>
  )
}