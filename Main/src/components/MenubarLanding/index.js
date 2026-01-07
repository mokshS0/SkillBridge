import React from 'react';
import './index.scss';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';

export default function MenubarLanding() {
    const navigate = useNavigate();

    // Define menu items for navigation
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/')
        },
        {
            label: 'User',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Log In',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => navigate('/signin')
                },
                {
                    label: 'Sign Up',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => navigate('/signup')
                }
            ]
        },
        {
            label: 'About',
            icon: 'pi pi-fw pi-info-circle',
            command: () => navigate('/ContactDashBoard')
        }
    ];

    // Logo component displayed at the end of the menu bar
    const end = <img alt="logo" src={logo} height="70" className="mr-2"></img>;

    return (
        <div className='menubar-height'>
            <div className='menubar-landing'>
                {/* Renders the menu bar with defined items and logo */}
                <Menubar className="border-radius-0" model={items} end={end} />
            </div>
        </div>
    );
}
