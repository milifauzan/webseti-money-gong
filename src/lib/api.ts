import { CashTransaction, Member, Schedule, DashboardStats } from '../types';

const TOKEN_KEY = 'money_gong_token';
const ROLE_KEY = 'money_gong_role';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredRole(): 'owner' | 'visitor' | null {
  return (localStorage.getItem(ROLE_KEY) as 'owner' | 'visitor') || null;
}

export function setStoredRole(role: 'owner' | 'visitor' | null) {
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginOwner(username: string, password: string): Promise<{ token: string; role: 'owner' }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: String(username).trim(),
        password: String(password).trim(),
      }),
    });

    let json: any = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await res.json();
    } else {
      const text = await res.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = { success: false, message: `Respon server (${res.status}): Terjadi kendala jaringan atau server.` };
      }
    }

    if (!res.ok || !json?.success) {
      throw new Error(json?.message || 'Username atau password salah.');
    }

    setStoredToken(json.token);
    setStoredRole('owner');
    return { token: json.token, role: 'owner' };
  } catch (err: any) {
    throw new Error(err?.message || 'Gagal terhubung ke server. Periksa koneksi internet Anda.');
  }
}

export async function verifyAuth(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (json.valid) {
      return true;
    }
    setStoredToken(null);
    return false;
  } catch (err) {
    return false;
  }
}

export async function logoutApi(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      // ignore
    }
  }
  setStoredToken(null);
  setStoredRole(null);
}

// Stats
export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch('/api/stats');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat memuat data statistik.');
  }
  return json.data;
}

// Cash summary & transactions
export async function fetchCashSummary(): Promise<{ total_balance: number; total_income: number; total_expense: number; transaction_count: number }> {
  const res = await fetch('/api/cash/summary');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat memuat ringkasan kas.');
  }
  return json.data;
}

export async function fetchTransactions(): Promise<CashTransaction[]> {
  const res = await fetch('/api/cash/transactions');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat memuat riwayat kas.');
  }
  return json.data;
}

export async function createTransaction(data: {
  type: 'income' | 'expense';
  amount: number;
  transaction_date: string;
  description: string;
}): Promise<{ transaction: CashTransaction; summary: any }> {
  const res = await fetch('/api/cash/transactions', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return { transaction: json.data, summary: json.summary };
}

export async function updateTransaction(
  id: string,
  data: {
    type: 'income' | 'expense';
    amount: number;
    transaction_date: string;
    description: string;
  }
): Promise<{ transaction: CashTransaction; summary: any }> {
  const res = await fetch(`/api/cash/transactions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return { transaction: json.data, summary: json.summary };
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/cash/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menghapus data.');
  }
}

// Members
export async function fetchMembers(): Promise<Member[]> {
  const res = await fetch('/api/members');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat memuat data anggota.');
  }
  return json.data;
}

export async function createMember(data: { name: string; position: string; description: string }): Promise<Member> {
  const res = await fetch('/api/members', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return json.data;
}

export async function updateMember(id: string, data: { name: string; position: string; description: string }): Promise<Member> {
  const res = await fetch(`/api/members/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return json.data;
}

export async function deleteMember(id: string): Promise<void> {
  const res = await fetch(`/api/members/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menghapus data.');
  }
}

export async function uploadMemberPhoto(id: string, file: File): Promise<Member> {
  const formData = new FormData();
  formData.append('photo', file);

  const token = getStoredToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api/members/${id}/photo`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Foto gagal diupload. Silakan coba lagi.');
  }
  return json.data;
}

export async function deleteMemberPhoto(id: string): Promise<Member> {
  const res = await fetch(`/api/members/${id}/photo`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menghapus foto.');
  }
  return json.data;
}

// Schedules
export async function fetchSchedules(): Promise<Schedule[]> {
  const res = await fetch('/api/schedules');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat memuat rencana jadwal.');
  }
  return json.data;
}

export async function createSchedule(data: {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: Schedule['status'];
}): Promise<Schedule> {
  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return json.data;
}

export async function updateSchedule(
  id: string,
  data: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    status: Schedule['status'];
  }
): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menyimpan data.');
  }
  return json.data;
}

export async function deleteSchedule(id: string): Promise<void> {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan saat menghapus data.');
  }
}
