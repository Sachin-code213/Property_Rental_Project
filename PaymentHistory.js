import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`http://localhost:5000/api/payments/tenant/${user.id}`)
      .then(res => setPayments(res.data));
  }, [user.id]);

  return (
    <div className="container mt-5">
      <h3>Your Payment History</h3>
      <table className="table mt-4 table-striped">
        <thead>
          <tr>
            <th>Property</th><th>Amount</th><th>Date</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td><td>${p.amount}</td>
              <td>{new Date(p.payment_date).toLocaleDateString()}</td>
              <td><span className="badge bg-success">{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;