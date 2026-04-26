import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ onSearch, onCancelSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const username = localStorage.getItem('username') || 'User';

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCancel = () => {
    setSearchQuery('');
    onCancelSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">📚 Student Management</span>

        <form className="d-flex gap-2" onSubmit={handleSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Search by name, roll no…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: '220px' }}
          />
          <button className="btn btn-outline-light" type="submit">Search</button>
          {searchQuery && (
            <button className="btn btn-secondary" type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>

        <div className="d-flex align-items-center gap-3">
          <span className="text-light small">👤 {username}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
