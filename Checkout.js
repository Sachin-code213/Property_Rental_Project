import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Replace with your actual Public Key
const stripePromise = loadStripe('pk_test_51TKKefBUeTdpq3gLcJGWX7utFWKAYdBaXVa82nFE5mGXXoNxbzaa0qgEiP2vNTK8kzrItK59haoIhA48v9NSKLrw00QyxxI1Tl');

const CheckoutForm = ({ property, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Custom styling for Stripe Card Input
  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': { color: '#aab7c4' },
      },
      invalid: { color: '#fa755a', iconColor: '#fa755a' },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1. Get Client Secret from Backend
      const { data: { clientSecret } } = await axios.post('http://localhost:5000/api/create-payment-intent', {
        amount: property.price
      });

      // 2. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        // 3. Update our DB
        await axios.post('http://localhost:5000/api/book', {
          property_id: property.id,
          tenant_id: user.id,
          amount: property.price
        });
        
        alert("🎉 Payment Successful! Your stay is booked.");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert("Payment Error. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      <h5 className="mb-4 fw-bold">Payment Details</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label text-muted small uppercase fw-bold">Card Information</label>
          <div className="p-3 border rounded bg-light">
            <CardElement options={cardStyle} />
          </div>
        </div>

        <button 
          className="btn btn-primary w-100 py-3 fw-bold shadow-sm" 
          disabled={!stripe || loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            `Pay $${property.price}`
          )}
        </button>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-shield-lock-fill me-1"></i> Secured by Stripe
          </small>
        </div>
      </form>
    </div>
  );
};

const Checkout = () => {
  const { state } = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!state) return <div className="text-center mt-5">No property selected.</div>;

  return (
    <div className="container mt-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h2 className="fw-bold mb-4 text-center">Complete Your Booking</h2>
          
          {/* Order Summary */}
          <div className="card border-0 bg-light p-4 mb-4">
            <h6 className="text-muted text-uppercase mb-3 small fw-bold">Property Summary</h6>
            <h4 className="fw-bold text-primary">{state.title}</h4>
            <p className="text-muted mb-1"><i className="bi bi-geo-alt me-2"></i>{state.location}</p>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Security Deposit (Refundable)</span>
              <span>$0.00</span>
            </div>
            <div className="d-flex justify-content-between mt-2 h5 fw-bold">
              <span>Total to Pay</span>
              <span className="text-success">${state.price}</span>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm property={state} user={user} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
/*Card Number: 4242 4242 4242 4242

Expiry Date: Any date in the future (e.g., 12/30)

CVC: Any 3 digits (e.g., 123)

Zip Code: Any 5 digits (e.g., 90210)
backend cmd : npx nodemon server.js
frontent: npm start*/