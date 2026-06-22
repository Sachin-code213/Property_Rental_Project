import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Added missing import

const PropertyCard = ({ property }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); // 2. Initialize navigate

  // 3. Updated handleBooking to go to Checkout page
  const handleBooking = () => {
    // We pass the property details as "state" so the Checkout page knows the price/title
    navigate('/checkout', { state: property });
  };

  // 4. Maintenance Request Logic
  const handleReportIssue = async () => {
    const issue = prompt("Please describe the maintenance issue (e.g., Leaking tap, Broken window):");
    
    if (issue) {
      try {
        const res = await axios.post('http://localhost:5000/api/maintenance', {
          property_id: property.id,
          tenant_id: user.id,
          description: issue
        });
        alert(res.data.message);
      } catch (err) {
        alert("Failed to send request.");
      }
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between">
             <h5 className="card-title text-primary fw-bold">{property.title}</h5>
             <span className="badge bg-light text-dark">{property.location}</span>
          </div>
          <p className="card-text text-muted small">{property.description}</p>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="h4 mb-0 text-success">${property.price}</span>
            
            {user?.role === 'Tenant' && (
              <>
                {property.status === 'Available' ? (
                  <button className="btn btn-success" onClick={handleBooking}>
                    Book & Pay
                  </button>
                ) : (
                 <button className="btn btn-outline-warning btn-sm" onClick={handleReportIssue}>
  <i className="bi bi-exclamation-triangle me-1"></i> Report Issue
</button>
                )}
              </>
            )}

            {user?.role === 'Owner' && (
              <span className={`badge ${property.status === 'Available' ? 'bg-success' : 'bg-danger'}`}>
                {property.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;