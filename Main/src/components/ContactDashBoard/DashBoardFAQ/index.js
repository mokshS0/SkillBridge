import './index.scss'; // Importing global styles
import React, { useRef } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
        
/*
DashBoardFAQ Component
This component renders an FAQ section using PrimeReact's Accordion component.
It is structured into two columns, each containing multiple frequently asked questions.
*/
export default function DashBoardFAQ() {
    return (
        <div>
            {/* Section Heading */}
            <div>
                <h1 className='center font-3rem marginBottom-5rem'>Frequently Asked Questions</h1>
            </div>
            
            {/* FAQ Wrapper Container */}
            <div className='dashboardFAQ-wrapper-primary'>
                
                {/* First Column - General FAQs */}
                <div className='FAQ-columnOne-wrap'>
                    <div>
                        <Accordion activeIndex={0}>
                            <AccordionTab header="What is SkillBridge?">
                                <p className="m-0">
                                    SkillBridge is a platform designed to connect students with job opportunities by providing
                                    a seamless job posting service tailored specifically for students. Employers can post job
                                    listings, internships, and entry-level positions, while students can easily find roles that
                                    match their skills and career goals.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="How does SkillBridge work?">
                                <p className="m-0">
                                    Employers can create an account and post job opportunities on SkillBridge. Students can
                                    then search for and apply to these postings through the platform. Our advanced matching
                                    algorithms help ensure that students are connected with job opportunities that align with
                                    their skills and interests.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Who can use SkillBridge?">
                                <p className="m-0">
                                    SkillBridge is designed for both employers and students. Employers looking to find fresh
                                    talent can post job opportunities, while students seeking internships, part-time jobs, or
                                    entry-level positions can search and apply for roles.
                                </p>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </div>
                
                {/* Second Column - Additional FAQs */}
                <div className='FAQ-columnTwo-wrap'>
                    <div className="card flex justify-content-center">
                        <div className="flex flex-column h-12rem">
                            <Accordion activeIndex={0}>
                                <AccordionTab header="What types of job postings are available on SkillBridge?">
                                    <p className="m-0">
                                        SkillBridge offers a wide range of job postings, including internships, part-time jobs,
                                        and entry-level positions. These opportunities are tailored to suit the unique needs and
                                        skills of students.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="What resources does SkillBridge offer to help students in their job search?">
                                    <p className="m-0">
                                        SkillBridge provides a variety of resources to support students in their job search,
                                        including resume-building tips, interview preparation, career advice, and access to
                                        articles, webinars, and workshops focused on career development.
                                    </p>
                                </AccordionTab>
                                <AccordionTab header="How do I create an account on SkillBridge?">
                                    <p className="m-0">
                                        To create an account on SkillBridge, visit our website and click on the "Sign Up" button.
                                        Follow the prompts to enter your information and set up your profile. Once your account
                                        is created, you can start posting job opportunities or searching for jobs.
                                    </p>
                                </AccordionTab>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}