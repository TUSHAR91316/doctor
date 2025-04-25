import { Doctor, ConsultationType } from '../types/doctor';

interface FilterOptions {
  search?: string;
  consultationType?: ConsultationType | '';
  specialties?: string[];
  sortBy?: string;
  page?: number;
  perPage?: number;
}

// Fetch doctors from the API
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Filter and sort doctors on the frontend
export const filterAndSortDoctors = (
  doctors: Doctor[],
  options: FilterOptions = {}
): { doctors: Doctor[]; totalCount: number } => {
  const {
    search = '',
    consultationType = '',
    specialties = [],
    sortBy = '',
    page = 1,
    perPage = 5
  } = options;
  
  let filtered = [...doctors];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(doctor => 
      doctor.name.toLowerCase().includes(searchLower) || 
      doctor.specialty.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply consultation type filter
  if (consultationType) {
    filtered = filtered.filter(doctor => 
      doctor.consultationTypes.includes(consultationType as ConsultationType)
    );
  }
  
  // Apply specialties filter
  if (specialties.length > 0) {
    filtered = filtered.filter(doctor => 
      specialties.includes(doctor.specialty)
    );
  }
  
  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'fees_low_to_high':
        filtered.sort((a, b) => a.fees - b.fees);
        break;
      case 'fees_high_to_low':
        filtered.sort((a, b) => b.fees - a.fees);
        break;
      case 'experience_high_to_low':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      default:
        break;
    }
  }
  
  // Get total count before pagination
  const totalCount = filtered.length;
  
  // Apply pagination
  const startIndex = (page - 1) * perPage;
  const paginatedResults = filtered.slice(startIndex, startIndex + perPage);
  
  return {
    doctors: paginatedResults,
    totalCount
  };
};

// Search doctors for autocomplete
export const searchDoctors = async (query: string, allDoctors: Doctor[]): Promise<string[]> => {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  
  // Get unique doctor names that match the query
  const matches = allDoctors
    .filter(doctor => doctor.name.toLowerCase().includes(queryLower))
    .map(doctor => doctor.name);
  
  // Return unique names
  return Array.from(new Set(matches)).slice(0, 5);
};