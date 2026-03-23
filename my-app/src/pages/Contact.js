import React, { useState } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.message.trim()) errs.message = 'Message is required.';
    return errs;
  };

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await axios.post(`${API_BASE}/api/contact/`, form);
      setSubmitted(true);
    } catch {
      setApiError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="container mt-5" style={{ maxWidth: 600 }}>
        <div className="alert alert-success" role="alert">
          <h4>Message sent!</h4>
          <p>Thanks for reaching out. We'll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mt-4" style={{ maxWidth: 600 }}>
      <h1>Contact Us</h1>
      <p className="text-muted mb-4">Have a question or feedback? We'd love to hear from you.</p>

      {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name *</label>
          <input id="name" name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={form.name} onChange={handleChange} aria-required="true" />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email *</label>
          <input id="email" name="email" type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={form.email} onChange={handleChange} aria-required="true" />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="subject" className="form-label">Subject *</label>
          <input id="subject" name="subject"
            className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
            value={form.subject} onChange={handleChange} aria-required="true" />
          {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea id="message" name="message" rows={5}
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            value={form.message} onChange={handleChange} aria-required="true" />
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </main>
  );
}

export default Contact;