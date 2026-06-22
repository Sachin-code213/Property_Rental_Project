import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Attempting to connect to backend...");
      const res = await axios.post('http://localhost:5000/api/login', { 
        email: email.trim(), 
        password: password.trim() 
      });

      console.log("Login Success:", res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      console.error("Full Error Object:", err);
      
      if (!err.response) {
        alert("Login Failed: Cannot connect to Backend. Is your server running on port 5000?");
      } else {
        alert("Login Failed: " + (err.response.data.message || "Invalid Credentials"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
        <h3 className="text-center mb-4 text-primary">Rental Portal</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="tenant@test.com"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="password123"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Checking..." : "Sign In"}
          </button>
        </form>

        {/* 2. Link now works because it is imported */}
        <p className="text-center mt-3 mb-0">
          Don't have an account? <Link to="/Signup" className="text-decoration-none">Sign Up here</Link>
        </p>

        <div className="mt-4 text-center text-muted" style={{ fontSize: '0.8rem' }}>
          Test with: <strong>tenant@test.com</strong> / <strong>password123</strong>
        </div>
      </div>
    </div>
  );
};

export default Login;