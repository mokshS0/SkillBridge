import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from '../src/context/AuthContext.js';
import { BrowserRouter } from 'react-router-dom';

/**
 * Entry point of the React application.
 *
 * This file sets up the React app, integrates key providers, and renders the root component.
 *
 * Key Components:
 * - App: The root component of the application, responsible for rendering the UI.
 * - PrimeReactProvider: A provider for PrimeReact, which supplies a UI library for React.
 * - React.StrictMode: A development mode wrapper to highlight potential issues in the app.
 * - reportWebVitals: A utility to measure and log app performance metrics.
 */

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PrimeReactProvider>
          <App />
      </PrimeReactProvider>
    </AuthProvider>
  </React.StrictMode>
);


// Measure performance and log results (e.g., console.log or send to an analytics endpoint)
reportWebVitals();