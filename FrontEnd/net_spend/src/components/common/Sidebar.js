import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/accounts-summary', icon: '💳', label: 'Accounts' },
    { path: '/fund-transfer', icon: '💸', label: 'Transfers' },
    { path: '/payments-bills', icon: '📄', label: 'Payments' },
    { path: '/profile-management', icon: '👤', label: 'Profile' },
    { path: '/customer-support', icon: '💬', label: 'Support' },
];

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">FB</div>
                <span className="sidebar-brand">FutureBank</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
                    <span className="sidebar-icon">🚪</span>
                    <span className="sidebar-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
