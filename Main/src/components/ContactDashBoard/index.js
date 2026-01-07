import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Routes, Route } from 'react-router-dom';
import React, { createContext } from 'react';
import DashBoardLayout from './DashBoardLayout';
import DashBoardContact from "./DashBoardContact";
import DashBoardFAQ from "./DashBoardFAQ";
// import LicensingDashboard from "./DashboardLicensing";
// import DevelopmentLicensing from "./DashboardLicensing";
import DevelopmentTechnologies from "./DashboardLicensing";

/**
 * This code defines the `ContactDashBoard` component, which uses React Router to manage 
 * different dashboard sections (Statistic, Contact, and FAQ) within a `ThemeContext` 
 * provider set to a dark theme. It includes various routes for navigation and 
 * incorporates PrimeReact and PrimeIcons CSS for styling. The routes are nested 
 * inside `DashBoardLayout` for a consistent layout structure.
 */
export const ThemeContext = createContext('light');

const ContactDashBoard = () => {
    return (
        <ThemeContext.Provider value="dark">
            <Routes>
                <Route path="/" element={<DashBoardLayout />}>
                    <Route index element={<DashBoardContact />} />
                    <Route path="DashBoardFAQ" element={<DashBoardFAQ />} />
                    <Route path="DashboardTech" element={<DevelopmentTechnologies />} />
                </Route>
            </Routes>
        </ThemeContext.Provider>
    );
};

export default ContactDashBoard;
