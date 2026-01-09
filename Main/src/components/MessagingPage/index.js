import React, { useState, useEffect, useRef } from 'react'
import {
  Send,
  Bot,
  User,
  GraduationCap,
  FileText,
  MessageSquare,
  Lightbulb,
  Clock,
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react'
import './index.scss'
import MenuInterior from '../MenuInterior'
import { authUtils } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'
import { apiBaseUrl } from '../../config/config'

const AIAssistantPage = () => {
  const navigate = useNavigate()
  const messagesContainerRef = useRef(null)

  // store scroll position
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const quickSuggestions = [
    { icon: <FileText />, text: "Help me improve my resume", category: "Resume", color: "blue" },
    { icon: <MessageSquare />, text: "Practice interview questions", category: "Interview", color: "green" },
    { icon: <Award />, text: "Skill development tips", category: "Skills", color: "indigo" },
    { icon: <BookOpen />, text: "Industry insights", category: "Learning", color: "emerald" },
    { icon: <GraduationCap />, text: "Education planning", category: "Education", color: "amber" }
  ]

  useEffect(() => {
    const user_info_getter = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const username = user?.username

        if (!username) {
          navigate('/sign-in')
          return
        }

        const result = await authUtils.getUserInfo(username)

        if (result.success) {
          setUserData(result.data)
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isTyping) return

    const userMessage = {
      id: Date.now(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: 'career-assistant',
          userData: userData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage = {
        id: Date.now() + 1,
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: "I apologize, but I'm having trouble connecting right now. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, errorMessage])
      setError('Failed to send message. Please try again.')

      setTimeout(() => setError(''), 5000)
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickSuggestion = (suggestion) => {
    if (isTyping) return
    setNewMessage(suggestion.text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <section className='assistant-page-container'>
      <MenuInterior />
      <div className="ai-assistant-page-wrapper">
        <div className="ai-assistant-container">
          {error && (
            <div className="message-banner error">
              <AlertCircle className="banner-icon" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="message-banner success">
              <Check className="banner-icon" />
              <span>{success}</span>
            </div>
          )}

          <div className="assistant-content">
            <div className="assistant-header">
              <div className="header-left">
                <div className="ai-avatar">
                  <div className="avatar-inner">
                    <Bot className="bot-icon" />
                    <div className="sparkles">
                      <Sparkles className="sparkle" />
                    </div>
                  </div>
                </div>
                <div className="header-info">
                  <h1 className="assistant-title">AI Career Assistant</h1>
                  <p className="assistant-subtitle">
                    <Lightbulb className="subtitle-icon" />
                    Your intelligent job search companion
                  </p>
                </div>
              </div>

              <div className="user-info">
                <div className="welcome-badge">
                  <span className="welcome-text">Welcome back!</span>
                  <span className="user-name">{userData?.account_username || 'Student'}</span>
                </div>
                <Avatar
                  image={
                    userData?.profile_img_url ||
                    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                  }
                  className="user-avatar"
                  size="large"
                  shape="circle"
                />
              </div>
            </div>

            {messages.length === 0 && (
              <div className="quick-suggestions">
                <div className="suggestions-header">
                  <h3 className="suggestions-title">
                    <Sparkles className="title-icon" />
                    Quick Start
                  </h3>
                  <p className="suggestions-subtitle">Choose a topic to begin your career journey</p>
                </div>
                <div className="suggestions-grid">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className={`suggestion-card ${suggestion.color}`}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      disabled={isTyping}
                    >
                      <div className="suggestion-icon">{suggestion.icon}</div>
                      <div className="suggestion-content">
                        <span className="suggestion-category">{suggestion.category}</span>
                        <span className="suggestion-text">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="messages-container" ref={messagesContainerRef}>
              {messages.length === 0 && !isTyping && (
                <div className="empty-state">
                  <div className="empty-state-visual">
                    <div className="empty-state-icon">
                      <MessageSquare />
                    </div>
                  </div>
                  <h3>Let's start your career conversation!</h3>
                  <p>Ask me anything about job searching, resume optimization, interview preparation, or career development strategies.</p>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-avatar">
                    {message.isUser ? <User className="user-icon" /> : <Bot className="bot-icon" />}
                  </div>
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="message-text">{message.content}</div>
                      <div className="message-timestamp">
                        <Clock className="clock-icon" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message ai-message">
                  <div className="message-avatar">
                    <Bot className="bot-icon" />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="message-input-container">
              <div className="input-wrapper">
                <div className="input-field">
                  <textarea
                    value={newMessage}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about jobs, resumes, interviews, or career advice..."
                    className="message-input"
                    rows="1"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="send-button"
                  >
                    {isTyping ? <Loader2 className="loading-icon" /> : <Send className="send-icon" />}
                  </button>
                </div>
                <div className="input-footer">
                  <p className="input-hint">
                    <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default AIAssistantPage