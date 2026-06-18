import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { api } from './api';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formdata, setFormData] = useState({
        uname: '',
        uemail: '',
        fname: '',
        lname: '',
        password: '',
    });

    const getval = (event) => {
        setFormData({
            ...formdata,
            [event.target.name]: event.target.value,
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            username: formdata.uname,
            email: formdata.uemail,
            first_name: formdata.fname,
            last_name: formdata.lname,
            password: formdata.password,
        };

        try {
            await api.post("/register/", payload);
            toast.success("Registration successful. Please login.");
            navigate("/");
        }
        catch (error) {
            console.log(error.response?.data || error);
            toast.error("Registration failed. Please check your details.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-vh-100 bg-light d-flex align-items-center py-5">
            <div className="container">
                <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "520px" }}>
                    <div className="card-body p-4">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold mb-2">Register</h1>
                            <p className="text-secondary mb-0">Enter your details to create your account</p>
                        </div>

                        <form onSubmit={handlesubmit}>
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
                                <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="uemail"
                                    className="form-control"
                                    onChange={getval}
                                    required
                                    autoComplete="email"
                                    value={formdata.uemail}
                                />
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <label htmlFor="first_name" className="form-label fw-semibold">First name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="fname"
                                        className="form-control"
                                        onChange={getval}
                                        required
                                        autoComplete="given-name"
                                        value={formdata.fname}
                                    />
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <label htmlFor="last_name" className="form-label fw-semibold">Last name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="lname"
                                        className="form-control"
                                        onChange={getval}
                                        required
                                        autoComplete="family-name"
                                        value={formdata.lname}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
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

                            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
                                {loading ? "Creating..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center text-secondary mt-4 mb-0">
                            Already have an account? <Link to="/" className="fw-semibold text-decoration-none">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
