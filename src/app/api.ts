/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchReminders(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/reminders/${elderId}`);
  if (!response.ok) throw new Error('Error cargando recordatorios');
  return response.json();
}

export async function addReminder(data: { elder_id: string; actividad: string; recordatorio_dia: number; hora: string }) {
  const response = await fetch(`${API_BASE_URL}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Error al guardar recordatorio');
  }
  return response.json();
}

export async function registerUser(data: { nombre: string; email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: data.nombre,
      rol: 'CAREGIVER',
      email: data.email,
      password: data.password,
      pin_vinculacion: 'CASA10',
      nombre_persona_a_cuidar: 'Manuel'
    })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Error en el registro');
  }
  return response.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Correo o contraseña incorrectos');
  }
  return response.json();
}

export async function fetchDashboard(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/analytics/dashboard/${elderId}`);
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
}

export async function fetchTimeline(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/analytics/timeline/${elderId}`);
  if (!response.ok) throw new Error('Failed to fetch timeline data');
  return response.json();
}

export async function fetchPatterns(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/analytics/patterns/${elderId}`);
  if (!response.ok) throw new Error('Failed to fetch patterns data');
  return response.json();
}

export async function fetchMedications(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/medications/elder/${elderId}`);
  if (!response.ok) throw new Error('Failed to fetch medications data');
  return response.json();
}

export async function addMedication(medicationData: { elder_id: string, name: string, dose: string, schedule: string }) {
  const response = await fetch(`${API_BASE_URL}/medications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(medicationData)
  });
  if (!response.ok) throw new Error('Failed to add medication');
  return response.json();
}

export async function fetchSettings(elderId: string) {
  const response = await fetch(`${API_BASE_URL}/users/${elderId}/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
}

export async function fetchUserByEmail(email: string) {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

export async function updateSettings(elderId: string, settings: any) {
  const response = await fetch(`${API_BASE_URL}/users/${elderId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  if (!response.ok) throw new Error('Failed to update settings');
  return response.json();
}
