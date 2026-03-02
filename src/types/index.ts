export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Appointment {
  id: string;
  userId: string;
  date: string; 
  time: string;
  doctorId: string;
  doctorName?: string; 
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  description?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
}
export {};