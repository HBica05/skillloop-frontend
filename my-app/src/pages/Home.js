import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { currentUser } = useAuth();

  return (
    <main>
      {/* Hero Section */}
      <div style={{
        width: '100%',
        minHeight: 360,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 12,
        marginBottom: '2rem',
      }}>
        {/* Mosaic background tiles */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          opacity: 0.18,
        }}>
          {['🎸','💻','🌍','🎨','⚽','🍳','📚','🎹','🔬','✂️','🎭','📷','🏄','🧮','🎺','🌱','🤝','💡'].map((emoji, i) => (
            <div key={i} style={{
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28,
            }}>{emoji}</div>
          ))}
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '2rem', color: 'white' }}>
          <h1 style={{
            fontSize: 52, fontWeight: 700, letterSpacing: 4,
            color: '#FF6B35', marginBottom: '0.5rem',
            textShadow: '0 0 40px rgba(255,107,53,0.4)',
          }}>
            SKILLOOP
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', letterSpacing: 1 }}>
            Where you learn and share your skills
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/skills" className="btn btn-warning fw-semibold px-4">
              Browse Skills
            </Link>
            {!currentUser && (
              <Link to="/register" className="btn btn-outline-light px-4">
                Join Now
              </Link>
            )}
            {currentUser && (
              <Link to="/skills/new" className="btn btn-outline-light px-4">
                + Add Your Skill
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="d-flex gap-4 justify-content-center mt-4 flex-wrap">
            <div className="text-center">
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF6B35' }}>Free</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, textTransform: 'uppercase' }}>Always</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div className="text-center">
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF6B35' }}>P2P</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, textTransform: 'uppercase' }}>Exchange</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div className="text-center">
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF6B35' }}>Open</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, textTransform: 'uppercase' }}>Community</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <h2 className="text-center mb-4">How it works</h2>
        </div>
        <div className="col-md-4 text-center">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <h5>List your skill</h5>
          <p className="text-muted">Share what you're good at — music, coding, languages, cooking and more.</p>
        </div>
        <div className="col-md-4 text-center">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <h5>Find a match</h5>
          <p className="text-muted">Browse skills others are offering and find someone to exchange with.</p>
        </div>
        <div className="col-md-4 text-center">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
          <h5>Exchange & grow</h5>
          <p className="text-muted">Request an exchange, connect, and learn something new for free.</p>
        </div>
      </div>

      {/* CTA for logged out users */}
      {!currentUser && (
        <div className="text-center p-5 rounded" style={{ background: '#f8f9fa' }}>
          <h3>Ready to start learning?</h3>
          <p className="text-muted">Join SkillLoop and exchange skills with people in your community.</p>
          <Link to="/register" className="btn btn-warning btn-lg px-5 fw-semibold">
            Get Started Free
          </Link>
        </div>
      )}
    </main>
  );
}

export default Home;