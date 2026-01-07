import React, { useContext, useEffect, useState } from 'react';
import './index.scss';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarComponent from '../sideBarComp';
import MenubarLanding from '../../MenubarLanding';
import MenuInterior from '../../MenuInterior';
import { AuthContext } from '../../../context/AuthContext';

const DashBoardLayout = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Or use sessionStorage or cookies
        setHasToken(!!token); // Convert token existence to boolean
    }, []);

    return (
        <div className="dashboard-container">
            {hasToken ? <MenuInterior /> : <MenubarLanding />}
            <div className="dashboard-layout">
                <SideBarComponent />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashBoardLayout;