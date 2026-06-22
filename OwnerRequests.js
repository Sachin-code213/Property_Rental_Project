import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

useEffect(() => {
    const fetchRequests = async () => {
        try {
            // Ensure you are using user.id from localStorage
            const res = await axios.get(`http://localhost:5000/api/maintenance/owner/${user.id}`);
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests", err);
        }
    };
    fetchRequests();
}, [user.id]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Maintenance Requests</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back</button>
      </div>
      
      <div className="card shadow border-0">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Property</th>
              <th>Issue Description</th>
              <th>Status</th>
              <th>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.title}</strong></td>
                  <td>{r.description}</td>
                  <td><span className="badge bg-warning text-dark">{r.status}</span></td>
                  <td>{new Date(r.request_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-4 text-muted">No maintenance requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerRequests;