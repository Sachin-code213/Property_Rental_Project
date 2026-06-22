import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../Components/PropertyCard'; // Double check your folder case (components vs Components)

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For Search Filter
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/properties');
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties", err);
      }
    };

    fetchProperties();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Logic for filtering properties by location
  const filteredProperties = properties.filter(p => 
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* HEADER SECTION */}
      <header className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom shadow-sm p-3 bg-white rounded">
        <div>
          <h2 className="fw-bold text-primary">RentalHub</h2>
          <p className="text-muted mb-0">Welcome, <strong>{user?.name}</strong> <span className="badge bg-secondary">{user?.role}</span></p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Tenant' && (
            <button className="btn btn-outline-dark" onClick={() => navigate('/payments')}>History</button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* TENANT VIEW */}
{user?.role === 'Tenant' ? (
  <section>
    {/* SEARCH AND HEADER */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="fw-bold">Marketplace</h4>
      <div className="w-50">
        <input 
          type="text" 
          className="form-control shadow-sm" 
          placeholder="🔍 Search by city or title..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* SECTION 1: AVAILABLE PROPERTIES */}
    <div className="mb-5">
      <h5 className="text-primary mb-3"><i className="bi bi-house-door me-2"></i>Available for Rent</h5>
      <div className="row">
        {filteredProperties.filter(p => p.status === 'Available').length > 0 ? (
          filteredProperties.filter(p => p.status === 'Available').map(p => (
            <PropertyCard key={p.id} property={p} />
          ))
        ) : (
          <div className="col-12 text-center py-4 bg-light rounded">
            <p className="text-muted mb-0">No new properties found matching your search.</p>
          </div>
        )}
      </div>
    </div>

    {/* SECTION 2: MY BOOKINGS (Where "Report Issue" button will live) */}
    {/* SECTION 2: MY BOOKINGS */}
<div className="p-4 bg-light rounded border shadow-sm">
  <h5 className="fw-bold mb-4 text-dark">
    <i className="bi bi-key me-2"></i>My Rented Properties & Actions
  </h5>
  <div className="row">
    {/* 💡 TIP: Ensure your MySQL status is exactly 'Booked'. 
        If it's lowercase 'booked' in the DB, this filter will return 0. */}
    {/* Change this line: */}
{properties.filter(p => p.status?.toLowerCase() === 'booked').length > 0 ? (
  properties.filter(p => p.status?.toLowerCase() === 'booked').map(p => (
    <PropertyCard key={p.id} property={p} />
  ))
) : (
  <p className="text-muted">No rented properties found.</p>
)}
  </div>
</div>
  </section>
) : (
  /* ... LANDLORD VIEW ... */

        /* OWNER / LANDLORD VIEW */
        <section className="text-center py-5 bg-light rounded border">
          <h4 className="fw-bold">Landlord Dashboard</h4>
          <p className="text-muted">Manage your listings, track payments, and view maintenance requests.</p>
          <div className="mt-4 d-flex justify-content-center gap-3">
            <button className="btn btn-primary btn-lg shadow" onClick={() => navigate('/add-property')}>
              + Add New Property
            </button>
            
<button 
  className="btn btn-info btn-lg text-white shadow" 
  onClick={() => navigate('/owner-requests')}
>
  View Requests
</button>
<button className="btn btn-success btn-lg shadow" onClick={() => navigate('/owner-bookings')}>
  View Bookings
</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;