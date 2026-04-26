import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    setError('');
    if (!loginData.username || !loginData.password) {
      return setError('Please enter username and password.');
    }
    setLoading(true);
    try {
      const { data } = await loginUser(loginData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (!signupData.username || !signupData.password) {
      return setError('Please fill in all fields.');
    }
    setLoading(true);
    try {
      await registerUser(signupData);
      setSuccess('Account created! You can now log in.');
      setSignupData({ username: '', password: '' });
      setShowSignup(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4" style={{ width: '480px' }}>
          <h2 className="text-center mb-1">Student Management System</h2>
          <h5 className="text-center text-muted mb-4">Login</h5>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <input
            type="text"
            className="form-control my-2"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password"
            className="form-control my-2"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <hr />

          <button
            className="btn btn-secondary w-100"
            onClick={() => { setShowSignup(!showSignup); setError(''); setSuccess(''); }}
          >
            {showSignup ? 'Cancel' : 'Create Account'}
          </button>

          {showSignup && (
            <div className="mt-3">
              <h6 className="text-center">Create an Account</h6>
              <input
                type="text"
                className="form-control my-2"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              />
              <input
                type="password"
                className="form-control my-2"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
              <button className="btn btn-success w-100" onClick={handleRegister} disabled={loading}>
                {loading ? 'Creating…' : 'Sign Up'}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center p-3">
        <p className="mb-0">Sinhgad Institute of Business Administration And Research (SIBAR), Kondhwa</p>
        <p className="mb-0">Name: Awais Sadik Pathan | MCA | Roll No: 30</p>
      </footer>
    </div>
  );
}

export default Login;
