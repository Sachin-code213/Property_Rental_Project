import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ properties: 0, bookings: 0 });

  useEffect(() => {
    // Fetch all users to display in a table
    axios.get('http://localhost:5000/api/admin/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Control Panel</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3">
            <h5>Total Users: {users.length}</h5>
          </div>
        </div>
      </div>
      <table className="table mt-4 shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;