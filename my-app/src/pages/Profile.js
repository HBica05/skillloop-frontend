import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', location: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    axios.get(`${API_BASE}/api/profile/me/`)
      .then(({ data }) => {
        setProfile(data);
        setForm({ bio: data.bio || '', location: data.location || '' });
      })
      .catch(() => showToast('Could not load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (form.bio.length > 500) errs.bio = 'Bio must be under 500 characters.';
    if (form.location.length > 120) errs.location = 'Location must be under 120 characters.';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const { data } = await axios.patch(`${API_BASE}/api/profile/me/`, form);
      setProfile(data);
      setEditing(false);
      showToast('Profile updated!');
    } catch {
      showToast('Could not save profile.');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <main style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 className="mb-4">{profile?.username}'s Profile</h1>
      {toast && <div className="alert alert-success" role="alert">{toast}</div>}
      {!editing ? (
        <div className="card mb-4">
          <div className="card-body">
            <p><strong>Bio:</strong> {profile?.bio || <span className="text-muted">No bio yet.</span>}</p>
            <p><strong>Location:</strong> {profile?.location || <span className="text-muted">Not set.</span>}</p>
            <button className="btn btn-outline-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="card mb-4">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea id="bio" name="bio" rows={3}
                className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
              {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input id="location" name="location"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary"
                onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </form>
      )}
      <h2 className="mb-3">My Skills</h2>
      {profile?.skills?.length === 0 && <p className="text-muted">No skills listed yet.</p>}
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {profile?.skills?.map(({ id, title, category, level }) => (
          <div className="col" key={id}>
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title">{title}</h6>
                <div className="d-flex gap-2">
                  {category && <span className="badge bg-secondary">{category}</span>}
                  {level && <span className="badge bg-info text-dark">{level}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Profile;