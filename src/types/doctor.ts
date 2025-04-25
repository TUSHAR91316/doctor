export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationTypes: ConsultationType[];
  experience: number;
  rating: number;
  reviewCount: number;
  fees: number;
  qualification: string;
  imageUrl: string;
  availability: string[];
  location?: string;
}

export type ConsultationType = 'Online' | 'In-person' | 'Home Visit';

export interface FilterState {
  search: string;
  consultationType: ConsultationType | '';
  specialties: string[];
  sortBy: 'fees_low_to_high' | 'fees_high_to_low' | 'experience_high_to_low' | '';
}

export const SPECIALTIES = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'Psychiatrist',
  'Ophthalmologist',
  'Dentist',
  'ENT Specialist',
  'General Physician',
  'Urologist'
];

export const CONSULTATION_TYPES: ConsultationType[] = ['Online', 'In-person', 'Home Visit'];