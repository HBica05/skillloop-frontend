import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api/config';

const EMPTY = { title: '', description: '', category: '', level: 'beginner', is_remote: true };
const CATEGORIES = ['Music', 'Tech', 'Languages', 'Arts', 'Sport', 'Other'];

function validate({ title, description, category }) {
  const errors = {};
  if (!title.trim()) errors.title = 'Title is required.';
  if (title.trim().length > 120) errors.title = 'Title must be under 120 characters.';
  if (!description.trim()) errors.description = 'Description is required.';
  if (!category) errors.category = 'Please select a category.';
  return errors;
}

function SkillForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`${API_BASE}/api/skills/${id}/`)
        .then(({ data }) => setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          level: data.level,
          is_remote: data.is_remote,
        }))
        .catch(() => setApiError('Could not load skill.'));
    }
  }, [id, isEdit]);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setErrors({});
    setSubmitting(true);
    try {
      if (isEdit) {
        await axios.put(`${API_BASE}/api/skills/${id}/`, form);
        showToast('Skill updated!');
      } else {
        await axios.post(`${API_BASE}/api/skills/`, form);
        showToast('Skill created!');
      }
      setTimeout(() => navigate('/skills'), 1000);
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this skill? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/api/skills/${id}/`);
      navigate('/skills');
    } catch {
      setApiError('Could not delete skill.');
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>{isEdit ? 'Edit Skill' : 'Add a Skill'}</h1>
      {toast && <div className="alert alert-success" role="alert">{toast}</div>}
      {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title *</label>
          <input id="title" name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={form.title} onChange={handleChange} aria-required="true" />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea id="description" name="description" rows={4}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            value={form.description} onChange={handleChange} aria-required="true" />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category *</label>
          <select id="category" name="category"
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            value={form.category} onChange={handleChange} aria-required="true">
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="level" className="form-label">Level</label>
          <select id="level" name="level" className="form-select"
            value={form.level} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" id="is_remote" name="is_remote"
            className="form-check-input" checked={form.is_remote} onChange={handleChange} />
          <label htmlFor="is_remote" className="form-check-label">Available remotely</label>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Update Skill' : 'Create Skill'}
          </button>
          {isEdit && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete Skill
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/skills')}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default SkillForm;