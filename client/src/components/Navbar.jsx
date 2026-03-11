import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ✍️ BlogApp
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/create" className="btn btn-outline">Write</Link>
            <Link to={`/profile/${user.username}`} className="navbar-username">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="btn btn-dark">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-dark">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;