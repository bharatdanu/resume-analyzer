import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './api';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formdata, setFormData] = useState({
        uname: '',
        password: '',
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

        const success = await login({
            username: formdata.uname,
            password: formdata.password,
        });

        if (success) {
            navigate("/dashboard");
        }
    };

    const login = async (payload) => {
        try {
            const res = await api.post("/gettoken/", {
                username: payload.username,
                password: payload.password,
            });

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            return true;
        }
        catch (err) {
            console.log(err.response?.data || err);
            setError("Invalid username or password.");
            return false;
        }
    }

    return (
        <main className="min-vh-100 bg-light d-flex align-items-center py-5">
            <div className="container">
                <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "420px" }}>
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold mb-2">Login</h1>
                            <p className="text-secondary mb-0">Enter your credentials to access your account</p>
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
                                    name="uname"
                                    className="form-control"
                                    onChange={getval}
                                    required
                                    autoComplete="username"
                                    value={formdata.uname}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        onChange={getval}
                                        value={formdata.password}
                                        required
                                        autoComplete="current-password"
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

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input type="checkbox" id="remember" name="remember" className="form-check-input" />
                                    <label htmlFor="remember" className="form-check-label">Remember me</label>
                                </div>
                                <button type="button" className="btn btn-link p-0 text-decoration-none">Forgot password?</button>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-semibold">
                                Sign In
                            </button>
                        </form>

                        <p className="text-center text-secondary mt-4 mb-0">
                            Don't have an account? <Link to="/register" className="fw-semibold text-decoration-none">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
