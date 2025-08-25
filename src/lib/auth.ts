export type Role = 'ADMIN' | 'REVIEWER';
export type User = { id:number; firstName:string; lastName:string; email:string; role:Role };
type AuthPayload = { access_token: string; user: User };

const KEY = 'baldecash.auth';

export function saveAuth(data: AuthPayload){ localStorage.setItem(KEY, JSON.stringify(data)); }
export function getAuth(): AuthPayload | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as AuthPayload : null;
}
export function getToken(){ return getAuth()?.access_token ?? null; }
export function getUser(){ return getAuth()?.user ?? null; }
export function clearAuth(){ localStorage.removeItem(KEY); }
