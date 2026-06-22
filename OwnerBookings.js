import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bookings/owner/${user.id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  }, [user.id]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h3>Current Bookings</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back</button>
      </div>
      <div className="card shadow border-0">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Property</th>
              <th>Tenant Name</th>
              <th>Rent Paid</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map(b => (
                <tr key={b.booking_id}>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.tenant_name} ({b.tenant_email})</td>
                  <td className="text-success fw-bold">${b.price}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-4">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerBookings;