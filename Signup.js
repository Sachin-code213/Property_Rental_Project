import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Tenant' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', formData);
      alert("Registration Successful! Please Login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-center fw-bold text-primary mb-4">Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="Enter Name" required
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" className="form-control" placeholder="Enter Email" required
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Min 6 characters" required
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="mb-4">
            <label>I am a:</label>
            <select className="form-select" onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="Tenant">Tenant (Searching for home)</option>
              <option value="Owner">Owner (Listing properties)</option>
            </select>
          </div>
          <button className="btn btn-primary w-100 py-2 mb-3 shadow-sm">Sign Up</button>
          <p className="text-center small">Already have an account? <Link to="/">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;