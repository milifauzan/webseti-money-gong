export type UserRole = 'owner' | 'visitor';

export type TransactionType = 'income' | 'expense';

export type ScheduleStatus = 'Direncanakan' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';

export interface CashTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  transaction_date: string;
  description: string;
  balance_after: number;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  position: string;
  description: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_balance: number;
  total_income: number;
  total_expense: number;
  member_count: number;
  upcoming_schedule_count: number;
  total_transactions: number;
}

export type ActiveTab = 'beranda' | 'uang_kas' | 'kenali_kami' | 'rencana_jadwal' | 'riwayat_kas' | 'kelola_data';
