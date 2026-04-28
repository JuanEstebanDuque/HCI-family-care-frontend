const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
