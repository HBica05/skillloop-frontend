import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOURS = {
  pending: 'warning',
  accepted: 'success',
  declined: 'danger',
  completed: 'secondary',
};

const EMPTY_FORM = {
  recipient: '',
  skill_offered: '',
  skill_requested: '',
  message: '',
};

function Exchanges() {
  const { currentUser } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exRes, skillRes, profileRes] = await Promise.all([
          axios.get(`${API_BASE}/api/exchanges/`),
          axios.get(`${API_BASE}/api/skills/`),
          axios.get(`${API_BASE}/api/profiles/`),
        ]);
        setExchanges(exRes.data.results ?? exRes.data);
        setSkills(skillRes.data.results ?? skillRes.data);
        setUsers(profileRes.data.results ?? profileRes.data);
      } catch {
        setError('Could not load exchanges.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.recipient) errs.recipient = 'Please select a recipient.';
    if (!form.skill_offered) errs.skill_offered = 'Please select a skill you are offering.';
    if (!form.skill_requested) errs.skill_requested = 'Please select a skill you want.';
    return errs;
  };

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/exchanges/`, form);
      setExchanges((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      showToast('Exchange request sent!');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/exchanges/${id}/`, { status });
      setExchanges((prev) =>
        prev.map((ex) => (ex.id === id ? { ...ex, status } : ex))
      );
      showToast(`Exchange ${status}.`);
    } catch {
      showToast('Could not update exchange.');
    }
  };

  // Helper: get skill title by id
  const skillTitle = (id) => {
    const s = skills.find((sk) => sk.id === Number(id));
    return s ? s.title : `Skill #${id}`;
  };

  if (loading) return <p className="text-center mt-4">Loading exchanges...</p>;

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Exchanges</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : '+ Request Exchange'}
        </button>
      </div>

      {toast && <div className="alert alert-info" role="alert">{toast}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Create form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">New Exchange Request</h5>
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label htmlFor="recipient" className="form-label">Recipient *</label>
                <select
                  id="recipient"
                  name="recipient"
                  className={`form-select ${formErrors.recipient ? 'is-invalid' : ''}`}
                  value={form.recipient}
                  onChange={handleChange}
                >
                  <option value="">Select a user</option>
                  {users
                    .filter((u) => u.username !== currentUser?.username)
                    .map((u) => (
                      <option key={u.id} value={u.user}>{u.username}</option>
                    ))}
                </select>
                {formErrors.recipient && (
                  <div className="invalid-feedback">{formErrors.recipient}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="skill_offered" className="form-label">Skill you are offering *</label>
                <select
                  id="skill_offered"
                  name="skill_offered"
                  className={`form-select ${formErrors.skill_offered ? 'is-invalid' : ''}`}
                  value={form.skill_offered}
                  onChange={handleChange}
                >
                  <option value="">Select a skill</option>
                  {skills
                    .filter((s) => s.owner_username === currentUser?.username)
                    .map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                </select>
                {formErrors.skill_offered && (
                  <div className="invalid-feedback">{formErrors.skill_offered}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="skill_requested" className="form-label">Skill you want *</label>
                <select
                  id="skill_requested"
                  name="skill_requested"
                  className={`form-select ${formErrors.skill_requested ? 'is-invalid' : ''}`}
                  value={form.skill_requested}
                  onChange={handleChange}
                >
                  <option value="">Select a skill</option>
                  {skills
                    .filter((s) => s.owner_username !== currentUser?.username)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} (by {s.owner_username})
                      </option>
                    ))}
                </select>
                {formErrors.skill_requested && (
                  <div className="invalid-feedback">{formErrors.skill_requested}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="form-control"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Introduce yourself and explain what you'd like to exchange..."
                />
              </div>

              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exchanges list */}
      {exchanges.length === 0 && !error && (
        <p className="text-muted">No exchanges yet. Request one using the button above!</p>
      )}

      {exchanges.map(({
        id, requester_username, recipient_username,
        skill_offered, skill_requested, message, status,
      }) => (
        <div className="card mb-3" key={id}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">
                  {requester_username} ↔ {recipient_username}
                </h5>
                <p className="small text-muted mb-1">
                  Offering: <strong>{skillTitle(skill_offered)}</strong>
                  {' · '}
                  Requesting: <strong>{skillTitle(skill_requested)}</strong>
                </p>
                {message && <p className="card-text mt-1">{message}</p>}
              </div>
              <span className={`badge bg-${STATUS_COLOURS[status] || 'secondary'} ms-2`}>
                {status}
              </span>
            </div>

            {/* Only the recipient can accept/decline a pending request */}
            {status === 'pending' && recipient_username === currentUser?.username && (
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => updateStatus(id, 'accepted')}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateStatus(id, 'declined')}
                >
                  Decline
                </button>
              </div>
            )}

            {/* Requester can mark accepted exchanges as completed */}
            {status === 'accepted' && requester_username === currentUser?.username && (
              <div className="mt-3">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => updateStatus(id, 'completed')}
                >
                  Mark as completed
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default Exchanges;