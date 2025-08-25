import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api';

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState('admin@baldecash.test');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuthToken(data.access_token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      nav('/', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(' • ') : (msg ?? 'Error de autenticación'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', fontFamily: 'system-ui' }}>
      <h1>Baldecash — Login</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        <button disabled={loading} type="submit" style={{ padding: 10 }}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p style={{ marginTop: 16, color: '#666' }}>
        También podés probar con cualquier <i>REVIEWER</i> de la DB.
      </p>
    </div>
  );
}
