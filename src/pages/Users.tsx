// src/pages/Users.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import { UsersApi, type User, type Role } from '../usersApi';

export default function Users() {
  const nav = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const me = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);
  const isAdmin = me?.role === 'ADMIN';

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<null | User>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await UsersApi.list();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al cargar usuarios');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function logout() {
    setAuthToken(undefined);
    nav('/login', { replace: true });
  }

  // 👇 tipos explícitos para que coincidan con tu UsersApi
  type CreatePayload = {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string; // requerido al crear
  };

  type EditPayload = Partial<Omit<User, 'id' | 'createdAt'>> & {
    password?: string; // opcional al editar
  };

  async function handleCreate(payload: CreatePayload) {
    setSaving(true);
    try {
      await UsersApi.create(payload);
      setOpenCreate(false);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al crear');
    } finally { setSaving(false); }
  }

  async function handleEdit(payload: EditPayload) {
    if (!openEdit) return;
    setSaving(true);
    try {
      await UsersApi.update(openEdit.id, payload);
      setOpenEdit(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al actualizar');
    } finally { setSaving(false); }
  }

  async function handleDelete(u: User) {
    if (!confirm(`¿Eliminar a ${u.firstName} ${u.lastName}?`)) return;
    try {
      await UsersApi.remove(u.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al eliminar');
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <header style={{ display:'flex', gap:12, justifyContent:'space-between', alignItems:'center' }}>
        <h1>Usuarios</h1>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {me && <span style={{ color:'#666' }}>{me.email} — <b>{me.role}</b></span>}
          <button onClick={logout}>Salir</button>
        </div>
      </header>

      {isAdmin && (
        <div style={{ margin:'12px 0' }}>
          <button onClick={()=>setOpenCreate(true)}>➕ Crear usuario</button>
        </div>
      )}

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color:'crimson' }}>{error}</p>}

      {!loading && !error && (
        <table width="100%" cellPadding={8} style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>
              <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Creado</th>{isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                <td>{u.id}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                {isAdmin && (
                  <td style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>setOpenEdit(u)}>Editar</button>
                    <button onClick={()=>handleDelete(u)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Crear */}
      <Modal open={openCreate} onClose={()=>setOpenCreate(false)} title="Crear usuario">
        <UserForm mode="create" submitting={saving} onSubmit={handleCreate} />
      </Modal>

      {/* Modal Editar */}
      <Modal open={!!openEdit} onClose={()=>setOpenEdit(null)} title="Editar usuario">
        {openEdit && (
          <UserForm
            mode="edit"
            initial={openEdit}
            submitting={saving}
            onSubmit={handleEdit}
          />
        )}
      </Modal>
    </div>
  );
}
