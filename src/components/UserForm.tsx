import { useState } from 'react';
import { type Role, type User } from '../usersApi';

type Props =
  | {
      mode: 'create';
      initial?: Partial<User>;
      submitting?: boolean;
      onSubmit: (payload: {
        firstName: string;
        lastName: string;
        email: string;
        role: Role;
        password: string; 
      }) => void;
    }
  | {
      mode: 'edit';
      initial?: Partial<User>;
      submitting?: boolean;
      onSubmit: (payload: Partial<Omit<User, 'id' | 'createdAt'>> & { password?: string }) => void;
    };

export default function UserForm(props: Props) {
  const { mode, initial, onSubmit, submitting } = props; 

  const [firstName, setFirst] = useState(initial?.firstName ?? '');
  const [lastName, setLast] = useState(initial?.lastName ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<Role>((initial?.role as Role) ?? 'REVIEWER');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = { firstName, lastName, email, role };

    if (mode === 'create') {
      if (!password.trim()) {
        alert('La contraseña es obligatoria para crear.');
        return;
      }
      onSubmit({ ...base, password }); 
      return;
    }

    if (password.trim()) {
      onSubmit({ ...base, password });
    } else {
      onSubmit({ ...base });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <input placeholder="Nombre" value={firstName} onChange={(e) => setFirst(e.target.value)} required />
      <input placeholder="Apellido" value={lastName} onChange={(e) => setLast(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="ADMIN">Administrador</option>
        <option value="REVIEWER">Revisor</option>
      </select>
      <input
        type="password"
        placeholder={mode === 'create' ? 'Contraseña (obligatoria)' : 'Contraseña (opcional)'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={mode === 'create'}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  );
}
