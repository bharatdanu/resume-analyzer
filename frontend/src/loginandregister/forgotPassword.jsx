import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { api } from './api';

export default function ForgotPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formdata, setFormData] = useState({
        username: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();

    const getval = (event) => {
        setFormData({
            ...formdata,
            [event.target.name]: event.target.value,
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formdata.newPassword !== formdata.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await api.post("/forgot-password/", {
                username: formdata.username,
                email: formdata.email,
                new_password: formdata.newPassword,
            });
            toast.success("Password reset successfully. Please login.");
            navigate("/");
        }
        catch (error) {
            const detail = error.response?.data?.error;
            if (Array.isArray(detail)) {
                setError(detail.join(" "));
            } else if (detail) {
                setError(detail);
            } else if (error.response?.status === 404) {
                setError("Password reset endpoint was not found. Please update and reload the backend.");
            } else if (!error.response) {
                setError("Cannot reach the backend. Check the backend URL and CORS settings.");
            } else {
                setError("Password reset failed. Please check the account details.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-vh-100 bg-light d-flex align-items-center py-5">
            <div className="container">
                <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "460px" }}>
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold mb-2">Forgot Password</h1>
                            <p className="text-secondary mb-0">Confirm your account details and set a new password</p>
                        </div>

                        <form onSubmit={handlesubmit}>
                            {error && (
                                <div className="alert alert-danger py-2">{error}</div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="username" className="form-label fw-semibold">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    onChange={getval}
                                    required
                                    autoComplete="username"
                                    value={formdata.username}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    onChange={getval}
                                    required
                                    autoComplete="email"
                                    value={formdata.email}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label fw-semibold">New password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        name="newPassword"
                                        className="form-control"
                                        onChange={getval}
                                        value={formdata.newPassword}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-control"
                                    onChange={getval}
                                    value={formdata.confirmPassword}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>

                        <p className="text-center text-secondary mt-4 mb-0">
                            Remember your password? <Link to="/" className="fw-semibold text-decoration-none">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
