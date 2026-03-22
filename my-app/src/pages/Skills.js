import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSkills from '../hooks/useSkills';

const CATEGORIES = ['', 'Music', 'Tech', 'Languages', 'Arts', 'Sport', 'Other'];

function Skills() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { skills, loading, error } = useSkills(search, category);

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Browse Skills</h1>
        {currentUser && (
          <Link to="/skills/new" className="btn btn-primary">
            + Add Skill
          </Link>
        )}
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search skills"
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c || 'All categories'}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading skills...</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!loading && !error && skills.length === 0 && (
        <p className="text-muted">No skills found. Try a different search.</p>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3" aria-live="polite">
        {skills.map(({ id, title, description, category: cat, level, is_remote, owner_username }) => (
          <div className="col" key={id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted small">{description}</p>
                <div className="d-flex gap-2 flex-wrap mb-2">
                  {cat && <span className="badge bg-secondary">{cat}</span>}
                  {level && <span className="badge bg-info text-dark">{level}</span>}
                  {is_remote && <span className="badge bg-success">Remote</span>}
                </div>
                <p className="small text-muted mb-2">By: {owner_username}</p>
              </div>
              <div className="card-footer d-flex gap-2">
                <Link to={`/skills/${id}`} className="btn btn-sm btn-outline-primary">
                  View
                </Link>
                {currentUser?.username === owner_username && (
                  <Link to={`/skills/${id}/edit`} className="btn btn-sm btn-outline-secondary">
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Skills;