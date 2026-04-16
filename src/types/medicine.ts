export interface Schedule {
  id: string;
  medicineId: string;
  time: string;
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  schedules: Schedule[];
  logs?: Log[];
}

export interface Log {
  id: string;
  userId: string;
  medicineId: string;
  status: 'taken' | 'missed' | 'skipped';
  timestamp: string;
}

export interface DashboardStats {
  todayTotal: number;
  completed: number;
  missed: number;
  adherenceScore: number;
}
