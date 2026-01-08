import React, { useState, useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import './index.scss'
import { Divider } from 'primereact/divider'
import { apiBaseUrl } from '../../../config/config'

const ApplicationCard = ({ application }) => {
  const [jobTitle, setJobTitle] = useState('')
  const [matchingJob, setMatchingJob] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [interviewFeedback, setInterviewFeedback] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [interviewStep, setInterviewStep] = useState(0)
  const [userResponses, setUserResponses] = useState([])
  const [interviewQuestions, setInterviewQuestions] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const toast = useRef(null)
  const interviewQuestionsRef = useRef([])
  const currentStepRef = useRef(0)
  const userResponsesRef = useRef([])

  useEffect(() => {
    const fetchJobTitle = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/job_postings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch job postings')
        }
        const jobPostings = await response.json()
        const job = jobPostings.find((job) => job.job_id === application.job_id)
        if (job) {
          setJobTitle(job.job_title)
          setMatchingJob(job)
        }
      } catch (error) {
        console.error('Error fetching job title:', error)
      }
    }

    fetchJobTitle()
  }, [application.job_id])

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'accepted':
        return 'success'
      case 'interview':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'info'
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/applications/${application.application_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      )

      if (response.status === 404) {
        console.error('Application not found')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      const data = await response.json()
      setIsDeleted(true)
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }
  const startInterview = async () => {
    try {
      setIsInterviewActive(true)
      setInterviewStep(0)
      currentStepRef.current = 0
      setUserResponses([])
      userResponsesRef.current = []
      setIsProcessing(false)

      // Generate interview questions based on the job
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/interview/generate-questions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDetails: matchingJob,
            applicationDetails: {
              why_interested: application.why_interested || application.application_data?.why_interested,
              relevant_skills: application.relevant_skills || application.application_data?.relevant_skills,
              hope_to_gain: application.hope_to_gain || application.application_data?.hope_to_gain,
            },
            questionCount: 1, 
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate interview questions')
      }

      const data = await response.json()
      console.log('Generated interview questions:', data.questions)

      // Store questions in both state and ref
      setInterviewQuestions(data.questions)
      interviewQuestionsRef.current = data.questions

      // Start with the first question
      if (data.questions.length > 0) {
        setCurrentQuestion(data.questions[0])
        await speakQuestion(data.questions[0])
      } else {
        throw new Error('No questions generated')
      }
    } catch (error) {
      console.error('Error starting interview:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to start interview. Please try again.',
        life: 3000,
      })
      setIsInterviewActive(false)
    }
  }

  const speakQuestion = async (question) => {
    try {
      setIsSpeaking(true)

      // Use browser's built-in SpeechSynthesis API for TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(question)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onend = () => {
          setIsSpeaking(false)
          // Auto-start listening after question is spoken
          setTimeout(() => {
            startListening()
          }, 1000)
        }

        utterance.onerror = (e) => {
          console.error('Speech synthesis error:', e)
          setIsSpeaking(false)
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to speak question. Please check your audio settings.',
            life: 3000,
          })
          // Start listening anyway
          setTimeout(() => {
            startListening()
          }, 1000)
        }

        window.speechSynthesis.speak(utterance)
        return // Exit early when using browser TTS
      } else {
        // Fallback: try server-side TTS
        const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/interview/text-to-speech`,
        {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: question }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('TTS Error response:', errorText)
        throw new Error(
          `Failed to generate speech: ${response.status} ${errorText}`
        )
      }

        const data = await response.json()
        
        // If server says to use browser API, do that
        if (data.message && data.message.includes('SpeechSynthesis')) {
          const utterance = new SpeechSynthesisUtterance(question)
          utterance.onend = () => {
            setIsSpeaking(false)
            setTimeout(() => {
              startListening()
            }, 1000)
          }
          window.speechSynthesis.speak(utterance)
          return
        }

      const audioBlob = await response.blob()

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio response')
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // Add more detailed audio event listeners
      audio.onloadstart = () => console.log('Audio loading started')
      audio.oncanplay = () => console.log('Audio can play')
      audio.onplay = () => console.log('Audio started playing')

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl) 

        // Auto-start listening after question is spoken
        setTimeout(() => {
          startListening()
        }, 1000)
      }

      audio.onerror = (e) => {
        console.error('Audio playback error:', e)
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl) // Clean up the object URL

        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to play question audio.',
          life: 3000,
        })
      }

      // Ensure audio is loaded before playing
      audio.onloadeddata = () => {
        audio.play().catch((error) => {
          console.error('Audio play promise rejected:', error)
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)

          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail:
              'Failed to play question audio. Please check your audio settings.',
            life: 3000,
          })
        })
      }

      audio.load()
      }
    } catch (error) {
      console.error('Error in text-to-speech:', error)
      setIsSpeaking(false)

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to play question audio: ${error.message}`,
        life: 3000,
      })

      setTimeout(() => {
        console.log('TTS failed, starting to listen anyway')
        startListening()
      }, 2000)
    }
  }

  const [recordingStartTime, setRecordingStartTime] = useState(null)

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
  
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
  
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        })
        await processUserResponse(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
        setRecordingStartTime(null) // Reset the timer
      }
  
      setIsListening(true)
      const startTime = Date.now()
      setRecordingStartTime(startTime) // Set the actual start time
      mediaRecorder.start()
  
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === 'recording' &&
          Date.now() - startTime > 10000
        ) {
          // 10 seconds minimum
          stopListening()
        }
      }, 90000)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to access microphone. Please check permissions.',
        life: 3000,
      })
    }
  }

  const stopListening = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const processUserResponse = async (audioBlob) => {
    try {
      setIsProcessing(true)

      // Use ref for current step instead of state
      const currentStepIndex = currentStepRef.current

      const formData = new FormData()
      formData.append('audio', audioBlob, 'response.wav')

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/interview/speech-to-text`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to process speech')
      }

      const data = await response.json()
      const userText = data.text

      // Calculate next step from ref value
      const nextStepIndex = currentStepIndex + 1
      const totalQuestions = 1

      // Create the new response object
      const newResponse = {
        question: interviewQuestionsRef.current[currentStepIndex],
        answer: userText,
        step: currentStepIndex,
      }

      // ✅ UPDATE BOTH STATE AND REF
      const updatedResponses = [...userResponsesRef.current, newResponse]
      userResponsesRef.current = updatedResponses // Store in ref for reliability
      setUserResponses(updatedResponses) // Update state for UI

      console.log('All responses so far:', updatedResponses) // Debug log

      // Determine if we should continue or end the interview
      const shouldContinue = nextStepIndex < totalQuestions

      if (shouldContinue) {
        // Continue to next question

        const nextQuestionText = interviewQuestionsRef.current[nextStepIndex]

        if (!nextQuestionText) {
          console.error('Next question not found at index:', nextStepIndex)
          throw new Error(
            `Question ${nextStepIndex} not found in questions array`
          )
        }

        // Update ref and states for next question
        currentStepRef.current = nextStepIndex
        setInterviewStep(nextStepIndex)
        setCurrentQuestion(nextQuestionText)
        setIsProcessing(false)

        // Speak the next question after a brief delay
        setTimeout(() => {
          speakQuestion(nextQuestionText)
        }, 1000)
      } else {

        setTimeout(() => {
          endInterview(userResponsesRef.current)
        }, 1000)
      }
    } catch (error) {
      console.error('Error processing user response:', error)
      setIsProcessing(false)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process your response. Please try again.',
        life: 3000,
      })
    }
  }

  const endInterview = async (responses) => {
    try {
      console.log('Ending interview with responses:', responses) // Debug log
      setIsProcessing(true)

      // Generate feedback based on responses
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBaseUrl}/api/interview/generate-feedback`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobDetails: matchingJob,
            responses: responses,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate feedback')
      }

      const data = await response.json()

      // Store feedback and show in dialog
      setInterviewFeedback(data.feedback)
      setIsInterviewActive(false)
      setShowInterviewDialog(false)
      setIsProcessing(false)
      setShowFeedbackDialog(true)

      toast.current?.show({
        severity: 'success',
        summary: 'Interview Complete',
        detail: `Mock interview completed! You answered ${responses.length} questions.`,
        life: 5000,
      })
    } catch (error) {
      console.error('Error ending interview:', error)
      setIsInterviewActive(false)
      setShowInterviewDialog(false)
      setIsProcessing(false)

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:
          'Failed to generate feedback, but interview responses were recorded.',
        life: 3000,
      })
    }
  }

  const cancelInterview = () => {
    // Stop media recorder if recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
      console.log('Media recorder stopped during cancel interview')
    }
  
    // Stop any ongoing audio playback
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
      // Clean up object URLs to prevent memory leaks
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src)
      }
    })
  
    // Reset all interview states
    setIsInterviewActive(false)
    setIsListening(false)
    setIsSpeaking(false)
    setIsProcessing(false)
    setShowInterviewDialog(false)
    setCurrentQuestion('')
    setInterviewStep(0)
    setUserResponses([])
    setInterviewQuestions([])
    
    // Reset refs
    currentStepRef.current = 0
    userResponsesRef.current = []
    interviewQuestionsRef.current = []
  }

  const deleteDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={() => setShowDeleteDialog(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={() => {
          setShowDeleteDialog(false)
          handleDelete()
        }}
      />
    </>
  )

  const interviewDialogFooter = (
    <>
      {!isInterviewActive && (
        <Button
          label="Start Interview"
          icon="pi pi-play"
          onClick={startInterview}
          disabled={!matchingJob}
        />
      )}
      {isInterviewActive && (
        <>
          {isListening && (
            <Button
              label="Stop Recording"
              icon="pi pi-stop"
              severity="warning"
              onClick={stopListening}
            />
          )}
          <Button
            label="Cancel Interview"
            icon="pi pi-times"
            severity="danger"
            outlined
            onClick={cancelInterview}
          />
        </>
      )}
      {!isInterviewActive && (
        <Button
          label="Close"
          icon="pi pi-times"
          outlined
          onClick={() => setShowInterviewDialog(false)}
        />
      )}
    </>
  )

  const feedbackDialogFooter = (
    <>
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => setShowFeedbackDialog(false)}
      />
      <Button
        label="Start New Interview"
        icon="pi pi-refresh"
        onClick={() => {
          setShowFeedbackDialog(false)
          setShowInterviewDialog(true)
        }}
      />
    </>
  )

  if (isDeleted) {
    return null
  }

  return (
    <div className="application-card-container">
      <Toast ref={toast} />

      <div className="application-card-header">
        <div className="status-info">
          <div className="header-content">
            <h3 className="job-title">{jobTitle}</h3>
            <Tag
              value={application.application_status || 'pending'}
              severity={getStatusSeverity(application.application_status)}
            />
          </div>
          <div className="application-details">
            <div className="application-date">
              Applied: {new Date(application.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="application-content">
        <div className="content-section">
          <div className="section-title">Why Interested</div>
          <div className="section-text">{application.why_interested || application.application_data?.why_interested || 'Not provided'}</div>
        </div>

        <div className="content-section">
          <div className="section-title">Relevant Skills</div>
          <div className="section-text">{application.relevant_skills || application.application_data?.relevant_skills || 'Not provided'}</div>
        </div>

        <div className="content-section">
          <div className="section-title">Hope to Gain</div>
          <div className="section-text">{application.hope_to_gain || application.application_data?.hope_to_gain || 'Not provided'}</div>
        </div>

        <div className="content-section feedback-section">
          <div className="section-title">Feedback</div>
          <div className="section-text">
            {application.review_feedback
              ? application.review_feedback
              : 'No feedback provided.'}
          </div>
        </div>

        {(application.status === 'interview' || application.application_status === 'interview') && (
          <div className="content-section interview-section">
            <div className="section-title">Interview Details</div>
            <div className="interview-info">
              <div className="interview-detail">
                <strong>Date & Time:</strong>{' '}
                {(application.interview_date || application.interviewDate)
                  ? new Date(application.interview_date || application.interviewDate).toLocaleString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      }
                    )
                  : 'Not scheduled'}
              </div>
              <div className="interview-detail">
                <strong>Location:</strong>{' '}
                {application.interview_location || application.interviewLocation || 'Not specified'}
              </div>
            </div>
            <Button
              label="Voice Mock Interview"
              icon="pi pi-microphone"
              className="interview-practice-btn"
              onClick={() => setShowInterviewDialog(true)}
            />
          </div>
        )}

        <div className="action-section">
          <Button
            label="Delete Application"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      <Dialog
        visible={showDeleteDialog}
        style={{ width: '450px' }}
        header="Confirm Delete"
        modal
        footer={deleteDialogFooter}
        onHide={() => setShowDeleteDialog(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          <span>Are you sure you want to delete this application?</span>
        </div>
      </Dialog>

      <Dialog
        visible={showInterviewDialog}
        style={{ width: '600px' }}
        header="Voice Mock Interview"
        modal
        footer={interviewDialogFooter}
        onHide={() => !isInterviewActive && setShowInterviewDialog(false)}
        closable={!isInterviewActive}
      >
        <div className="interview-dialog-content">
          {!isInterviewActive && (
            <div className="interview-intro">
              <h4>Prepare for your interview with {jobTitle}!</h4>
              <p>
                This AI-powered mock interview will ask you 5 relevant questions
                based on the job requirements and your application. The
                interview will use voice interaction - you'll hear questions and
                respond by speaking.
              </p>
              <div className="interview-tips">
                <h5>Tips:</h5>
                <ul>
                  <li>Find a quiet environment</li>
                  <li>Speak clearly and at a normal pace</li>
                  <li>Take your time to think before responding</li>
                  <li>
                    The interview will automatically move to the next question
                    after you finish speaking
                  </li>
                  <li>You have up to 60 seconds per response</li>
                </ul>
              </div>
            </div>
          )}

          {isInterviewActive && (
            <div className="interview-active">
              <div className="interview-progress">
                <h4>Question {interviewStep + 1} of 1</h4>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((interviewStep + 1) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="current-question">
                <h5>Current Question:</h5>
                <p>{currentQuestion}</p>
              </div>
              <Divider />
              <div className="interview-status">
                {isSpeaking && (
                  <div className="status-item speaking">
                    <div className="ai-speaking-visual">
                      <div className="ai-avatar">
                        <i className="pi pi-android ai-icon"></i>
                      </div>
                      <div className="sound-waves">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                    </div>
                    <div className="speaking-text">AI is speaking...</div>
                  </div>
                )}

                {isListening && (
                  <div className="status-item listening">
                    <div className="listening-visual">
                      <div className="mic-container">
                        <i className="pi pi-microphone mic-icon"></i>
                      </div>
                      <div className="audio-levels">
                        <div className="level"></div>
                        <div className="level"></div>
                        <div className="level"></div>
                        <div className="level"></div>
                        <div className="level"></div>
                        <div className="level"></div>
                      </div>
                    </div>
                    <div className="listening-text">
                      Listening for your response... (
                      {Math.max(0, 60 - Math.floor((Date.now() - recordingStartTime) / 1000))}s remaining)
                      </div>
                  </div>
                )}

                {isProcessing && !isSpeaking && !isListening && (
                  <div className="status-item processing">
                    <div className="processing-visual">
                      <div className="processing-spinner"></div>
                    </div>
                    <div className="processing-text">
                      Processing your response...
                    </div>
                  </div>
                )}

                {!isSpeaking && !isListening && !isProcessing && (
                  <div className="status-item">
                    <span>Ready for next question...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={showFeedbackDialog}
        style={{ width: '700px', maxHeight: '80vh' }}
        header="Interview Feedback"
        modal
        footer={feedbackDialogFooter}
        onHide={() => setShowFeedbackDialog(false)}
      >
        <div className="feedback-dialog-content">
          <div className="feedback-header">
            <h4>🎉 Interview Complete!</h4>
            <p>Here's your personalized feedback based on your responses:</p>
          </div>

          <div className="feedback-content">
            <div className="feedback-text">{interviewFeedback}</div>
          </div>

          <div className="feedback-footer">
            <div className="feedback-tip">
              💡 <strong>Tip:</strong> Practice makes perfect! Feel free to take
              another mock interview to improve further.
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ApplicationCard