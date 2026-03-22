import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';

const STATUS_COLOURS = {
  pending: 'warning',
  accepted: 'success',
  declined: 'danger',
  completed: 'secondary',
};

function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    axios.get(`${API_BASE}/api/exchanges/`)
      .then(({ data }) => setExchanges(data.results ?? data))
      .catch(() => setError('Could not load exchanges.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/exchanges/${id}/`, { status });
      setExchanges((prev) =>
        prev.map((ex) => ex.id === id ? { ...ex, status } : ex)
      );
      showToast(`Exchange ${status}.`);
    } catch {
      showToast('Could not update exchange.');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading exchanges...</p>;

  return (
    <main>
      <h1 className="mb-4">My Exchanges</h1>
      {toast && <div className="alert alert-info" role="alert">{toast}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {exchanges.length === 0 && !error && (
        <p className="text-muted">No exchanges yet. Browse skills and request one!</p>
      )}
      {exchanges.map(({ id, requester_username, recipient_username, skill_offered, skill_requested, message, status }) => (
        <div className="card mb-3" key={id}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">
                  {requester_username} ↔ {recipient_username}
                </h5>
                <p className="small text-muted mb-1">
                  Offering skill #{skill_offered} · Requesting skill #{skill_requested}
                </p>
                {message && <p className="card-text">{message}</p>}
              </div>
              <span className={`badge bg-${STATUS_COLOURS[status] || 'secondary'} ms-2`}>
                {status}
              </span>
            </div>
            {status === 'pending' && (
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-success"
                  onClick={() => updateStatus(id, 'accepted')}>Accept</button>
                <button className="btn btn-sm btn-danger"
                  onClick={() => updateStatus(id, 'declined')}>Decline</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}

export default Exchanges;