import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import './index.scss';

const ViewSwitcherSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminView = () => {
    navigate('/AdminDashboard');
    setIsOpen(false);
  };

  const handleTeacherView = () => {
    navigate('/interior', { 
      state: { 
        previewMode: 'teacher',
        isAdminPreview: true 
      } 
    });
    setIsOpen(false);
  };

  const handleStudentView = () => {
    navigate('/interior', { 
      state: { 
        previewMode: 'student',
        isAdminPreview: true 
      } 
    });
    setIsOpen(false);
  };

  const getCurrentView = () => {
    const currentPath = location.pathname;
    const previewMode = location.state?.previewMode;
    
    if (currentPath === '/AdminDashboard') return 'admin';
    if (currentPath === '/TeacherDashboard') return 'teacher';
    if (previewMode === 'student') return 'student';
    return 'admin'; // default
  };

  const currentView = getCurrentView();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`view-switcher__toggle ${isOpen ? 'view-switcher__toggle--open' : ''}`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="view-switcher__overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`view-switcher__sidebar ${isOpen ? 'view-switcher__sidebar--open' : ''}`}>
        <div className="view-switcher__content">
          <h2 className="view-switcher__title">Switch View</h2>
          
          <div className="view-switcher__buttons">
            {/* Admin View */}
            <button
              onClick={handleAdminView}
              className={`view-switcher__button ${currentView === 'admin' ? 'view-switcher__button--active' : ''}`}
            >
              <Users size={20} />
              <span>Admin View</span>
            </button>

            {/* Teacher View */}
            <button
              onClick={handleTeacherView}
              className={`view-switcher__button ${currentView === 'teacher' ? 'view-switcher__button--active' : ''}`}
            >
              <GraduationCap size={20} />
              <span>Teacher View</span>
            </button>

            {/* Student View */}
            <button
              onClick={handleStudentView}
              className={`view-switcher__button ${currentView === 'student' ? 'view-switcher__button--active' : ''}`}
            >
              <BookOpen size={20} />
              <span>Student View</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSwitcherSidebar;