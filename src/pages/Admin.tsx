import React, { useState } from 'react';

const API_BASE = '/api/admin';

function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        fetchDashboard(data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (jwt?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${jwt || token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDashboard(data.data);
      } else {
        setError(data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (token && !dashboard) {
      fetchDashboard();
    }
    // eslint-disable-next-line
  }, [token]);

  const handleLogout = () => {
    setToken('');
    setDashboard(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginData.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: 10 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </div>
    );
  }

  if (loading && !dashboard) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {dashboard && (
        <div>
          <h3>Statistics</h3>
          <pre style={{ background: '#f6f8fa', padding: 16, borderRadius: 8 }}>
            {JSON.stringify(dashboard.statistics, null, 2)}
          </pre>
          <h3>Recent Bookings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentBookings && dashboard.recentBookings.length > 0 ? (
                dashboard.recentBookings.map((b: any) => (
                  <tr key={b._id}>
                    <td>{b.guest_name}</td>
                    <td>{b.room?.name || '-'}</td>
                    <td>{new Date(b.check_in_date).toLocaleDateString()}</td>
                    <td>{new Date(b.check_out_date).toLocaleDateString()}</td>
                    <td>{b.status}</td>
                    <td>{b.total_amount}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6}>No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel; 