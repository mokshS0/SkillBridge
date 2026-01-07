import './index.scss';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import { ThemeContext } from '../../App';
import AdminDashBoard from '../AdminDashBoard';
/**
 * The `Layout` component provides a structure for the application, incorporating 
 * the current theme using the `ThemeContext`. It wraps the main content with a 
 * flexible layout that includes routing through `Outlet` for nested routes and 
 * a `Footer` component. The `EmbededForm` component is also imported but not utilized here.
 */

const Layout = () => {
  const theme = useContext(ThemeContext); 

  return (
    <div className={`layout ${theme}`}>
      <div className='App'>
        <div className='content'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
