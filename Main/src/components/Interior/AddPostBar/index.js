import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import DOMPurify from 'dompurify';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import 'quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../../../utils/auth';

export default function AddPostBar({ visible, onClose, addJobPost }) {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [error, setError] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const jobTypes = [
        'Full-time', 'Part-time', 'Internship', 'Contract', 
        'Freelance', 'Remote', 'On-site', 'Temporary', 'Volunteer', 'Seasonal', 'Apprenticeship'
    ];
    const industries = [
        'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Retail', 'Construction', 
        'Government', 'Hospitality', 'Customer Service', 'Human Resources', 'Engineering', 'Legal', 'Nonprofit', 'Other'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUserData(authUtils.getStoredUserData());
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate]);

    const resetForm = () => {
        setPostTitle('');
        setPostContent('');
        setSelectedIndustries([]);
        setSelectedJobTypes([]);
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose && onClose();
    };

    const handleSavePost = () => {
        confirmDialog({
            message: 'You are about to publish a job listing. Please ensure all information is accurate. Would you like to proceed?',
            header: 'Publish Job Listing',
            icon: 'pi pi-briefcase',
            acceptLabel: 'Yes, Publish',
            rejectLabel: 'Review Again',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-pencil',
            style: { maxWidth: '600px' },
            contentStyle: { wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' },
            accept: async () => {
                try {
                    const sanitizedContent = DOMPurify.sanitize(postContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
                    const todaySQL = new Date().toISOString().slice(0, 10);
                    const token = localStorage.getItem('token');

                    const jobData = {
                        user_id: userData.user_id,
                        job_title: postTitle,
                        job_description: sanitizedContent,
                        job_signup_form: "",
                        job_type_tag: selectedJobTypes, // Send as array, not JSON string
                        industry_tag: selectedIndustries, // Send as array, not JSON string
                        user_avatar: userData.profile_img_url,
                        date_created: todaySQL,
                    };

                    const response = await fetch('http://localhost:4000/job_postings', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Add authentication header
                        },
                        body: JSON.stringify(jobData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Failed to create job posting' }));
                        throw new Error(errorData.message || 'Failed to create job posting');
                    }

                    toast.current.show({
                        severity: 'info',
                        summary: 'Pending',
                        detail: 'Your post has been saved. An admin will approve it soon!',
                        life: 10000,
                        position: 'top-right',
                    });

                    addJobPost && addJobPost(jobData); // callback for parent if needed
                    handleClose();
                } catch (error) {
                    console.error('Job posting error:', error);
                    setError(`Error: ${error.message}`);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Failed to upload job listing',
                        life: 5000,
                        position: 'top-right',
                    });
                }
            },
            reject: () => {
                // Optional reject logic
            }
        });
    };

    const onIndustryChange = (e) => {
        if (!selectedIndustries.includes(e.value)) setSelectedIndustries([...selectedIndustries, e.value]);
    };

    const removeIndustryTag = (tag) => setSelectedIndustries(selectedIndustries.filter(i => i !== tag));

    const onJobTypeChange = (e) => {
        if (!selectedJobTypes.includes(e.value)) setSelectedJobTypes([...selectedJobTypes, e.value]);
    };

    const removeJobTypeTag = (tag) => setSelectedJobTypes(selectedJobTypes.filter(i => i !== tag));

    const renderHeader = () => (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
        </span>
    );
    const header = renderHeader();

    return (
        <>
            <Dialog header="Create a Post" visible={visible} className="addPost-Dialog" onHide={handleClose} closable style={{ width: '60%'}}>
                <div className="post-dialog">
                    <div className="p-inputgroup flex-1" style={{ marginBottom: '1.5rem' }}>
                        <span className="p-inputgroup-addon"><i className="pi pi-user"></i></span>
                        <InputText placeholder="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                    </div>

                    <Divider />

                    <div className="field">
                        <label htmlFor="content">Post Content</label>
                        <Editor value={postContent} onTextChange={(e) => setPostContent(e.htmlValue)} headerTemplate={header} style={{ height: '320px', fontSize: '19px' }} />
                    </div>

                    <Divider />

                    <div className="dropdown-tag-container">
                        <h3>Select Industry</h3>
                        <Dropdown value={null} options={industries} onChange={onIndustryChange} placeholder="Select an industry" className="industry-dropdown" />
                        <div className="selected-tags" style={{ marginTop: '0.5rem' }}>
                            {selectedIndustries.map((tag, i) => <Tag key={i} value={tag} onClick={() => removeIndustryTag(tag)} className="selected-tag" />)}
                        </div>
                    </div>

                    <Divider />

                    <div className="dropdown-tag-container">
                        <h3>Select Job Type</h3>
                        <Dropdown value={null} options={jobTypes} onChange={onJobTypeChange} placeholder="Select a job type" className="job-type-dropdown" />
                        <div className="selected-tags" style={{ marginTop: '0.5rem' }}>
                            {selectedJobTypes.map((tag, i) => <Tag key={i} value={tag} onClick={() => removeJobTypeTag(tag)} className="selected-tag" />)}
                        </div>
                    </div>

                    <Divider />

                    {error && <small className="p-error">{error}</small>}

                    <div className="dialog-footer">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={handleClose} />
                        <Button label="Save" icon="pi pi-check" className="p-button" onClick={handleSavePost} />
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    );
}
