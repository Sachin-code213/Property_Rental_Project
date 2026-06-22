
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty'; // Match the case exactly
import PaymentHistory from './pages/PaymentHistory';
import OwnerRequests from './pages/OwnerRequests';
import OwnerBookings from './pages/OwnerBookings';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/payments" element={<PaymentHistory />} />
          <Route path="/owner-requests" element={<OwnerRequests />} />
          <Route path="/owner-bookings" element={<OwnerBookings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;