import React from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';

/**
 * AppLayout wraps authenticated pages with the Sidebar.
 */
function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="app-content">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
