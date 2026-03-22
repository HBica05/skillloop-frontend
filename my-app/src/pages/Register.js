import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    bio: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      // Show the first error message from any field
      if (data) {
        const firstKey = Object.keys(data)[0];
        const msg = data[firstKey];
        setError(Array.isArray(msg) ? msg[0] : msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4">
            <h2 className="mb-4 text-center">Join SkillLoop</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username"
                  name="username" value={formData.username}
                  onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email"
                  name="email" value={formData.email}
                  onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="password1" className="form-label">Password</label>
                <input type="password" className="form-control" id="password1"
                  name="password1" value={formData.password1}
                  onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="password2"
                  name="password2" value={formData.password2}
                  onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="bio" className="form-label">Bio <span className="text-muted">(optional)</span></label>
                <textarea className="form-control" id="bio" name="bio"
                  value={formData.bio} onChange={handleChange} rows={3} />
              </div>

              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location <span className="text-muted">(optional)</span></label>
                <input type="text" className="form-control" id="location"
                  name="location" value={formData.location}
                  onChange={handleChange} />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;