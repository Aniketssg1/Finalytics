import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../slices/authSlice';
import './LoginPage.css';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            {/* Brand Panel */}
            <div className="login-brand-panel">
                <div className="brand-content">
                    <div className="brand-logo">FutureBank</div>
                    <p className="brand-tagline">
                        Smart banking for a smarter future. Track, analyze, and grow your wealth.
                    </p>
                    <ul className="brand-features">
                        <li>
                            <span className="feature-icon">📊</span>
                            AI-Powered Spend Analysis
                        </li>
                        <li>
                            <span className="feature-icon">🔒</span>
                            Bank-Grade Security
                        </li>
                        <li>
                            <span className="feature-icon">⚡</span>
                            Instant Fund Transfers
                        </li>
                        <li>
                            <span className="feature-icon">📈</span>
                            Expenditure Forecasting
                        </li>
                    </ul>
                </div>
            </div>

            {/* Form Panel */}
            <div className="login-form-panel">
                <div className="login-form-container">
                    <h1>Welcome back</h1>
                    <p className="subtitle">Sign in to your FutureBank account</p>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="form-footer">
                            <button type="button" onClick={() => navigate('/forgot-password')}>
                                Forgot password?
                            </button>
                            <button type="button" onClick={() => navigate('/register')}>
                                Create account
                            </button>
                        </div>
                    </form>

                    <div className="security-tips">
                        <h4>Security Tips</h4>
                        <ul>
                            <li>Never share your credentials with anyone</li>
                            <li>Always log out after your session</li>
                            <li>Use a strong, unique password</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
