import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/properties', {
                owner_id: user.id,
                title,
                price,
                location,
                description
            });
            alert("Property Added Successfully!");
            navigate('/dashboard');
        } catch (err) {
            alert("Error adding property");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h3>Post a New Property</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Title</label>
                        <input type="text" className="form-control" onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Price ($)</label>
                            <input type="number" className="form-control" onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Location</label>
                            <input type="text" className="form-control" onChange={e => setLocation(e.target.value)} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label>Description</label>
                        <textarea className="form-control" rows="3" onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">List Property</button>
                    <button type="button" className="btn btn-link" onClick={() => navigate('/dashboard')}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;