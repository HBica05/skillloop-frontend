import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend endpoint
      const response = await axios.post('http://localhost:8000/dj-rest-auth/registration/', formData);
      console.log(response.data);
      alert('Registered successfully!');
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4">
            <h2 className="mb-4 text-center">Register for SkillLoop</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" name="username" id="username" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" name="email" id="email" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="password1" className="form-label">Password</label>
                <input type="password" className="form-control" name="password1" id="password1" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name="password2" id="password2" onChange={handleChange} required />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
