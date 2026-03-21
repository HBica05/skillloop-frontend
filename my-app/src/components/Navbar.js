import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          SkillLoop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink end to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <NavLink to="/skills" className="nav-link">
                    Skills
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/exchanges" className="nav-link">
                    Exchanges
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile/me" className="nav-link">
                    My Profile
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right — auth state (criteria 4.7: login state always visible) */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">
                    👋 {currentUser.username}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className="btn btn-outline-light ms-2"
                  >
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;