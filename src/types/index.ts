// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  allergies?: string[];
  medicalHistory?: string[];
  avatar?: string;
}

export interface Plant {
  id: string;
  scientificName: string;
  commonName: string;
  description: string;
  uses: string[];
  preparation: string[];
  warnings: string[];
  imageUrl: string;
  safetyLevel: 'safe' | 'caution' | 'toxic';
}

export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctorName: string;
  specialty: string;
}