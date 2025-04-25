import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import DoctorCard from '../components/DoctorCard';
import Pagination from '../components/Pagination';
import { fetchDoctors, filterAndSortDoctors } from '../services/doctorService';
import { FilterState, Doctor, ConsultationType } from '../types/doctor';
import { useSearchParams } from 'react-router-dom';

const DoctorsListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for all doctors from API
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    consultationType: (searchParams.get('consultationType') as ConsultationType) || '',
    specialties: searchParams.get('specialties')?.split(',').filter(Boolean) || [],
    sortBy: searchParams.get('sortBy') || '',
  });
  
  // State for temporary search input (before submitting search)
  const [searchInput, setSearchInput] = useState(filters.search);
  
  // State for filtered doctors
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const doctorsPerPage = 5;
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / doctorsPerPage);
  
  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {
      page: currentPage.toString(),
    };
    
    if (filters.search) params.search = filters.search;
    if (filters.consultationType) params.consultationType = filters.consultationType;
    if (filters.specialties.length > 0) params.specialties = filters.specialties.join(',');
    if (filters.sortBy) params.sortBy = filters.sortBy;
    
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);
  
  // Fetch all doctors on mount
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const doctors = await fetchDoctors();
        setAllDoctors(doctors);
      } catch (err) {
        setError('Failed to load doctors. Please try again.');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDoctors();
  }, []);
  
  // Apply filters when allDoctors or filters change
  useEffect(() => {
    if (allDoctors.length > 0) {
      const { doctors, totalCount } = filterAndSortDoctors(allDoctors, {
        ...filters,
        page: currentPage,
        perPage: doctorsPerPage,
      });
      
      setFilteredDoctors(doctors);
      setTotalCount(totalCount);
    }
  }, [allDoctors, filters, currentPage]);
  
  // Function to update a specific filter
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  // Function to clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      consultationType: '',
      specialties: [],
      sortBy: '',
    });
    setSearchInput('');
    setCurrentPage(1);
  };
  
  // Function to handle search submission
  const handleSearch = () => {
    handleFilterChange('search', searchInput);
  };
  
  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Active filters count for mobile display
  const activeFiltersCount = 
    (filters.consultationType ? 1 : 0) + 
    filters.specialties.length + 
    (filters.sortBy ? 1 : 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Doctors</h1>
          <p className="text-blue-100">Book appointments with the best doctors near you</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="mb-6">
          <SearchBar 
            value={searchInput} 
            onChange={setSearchInput} 
            onSearch={handleSearch}
            allDoctors={allDoctors}
          />
        </div>
        
        {/* Filter panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        {/* Active filters summary */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 text-sm">
            <span className="text-gray-600 font-medium">
              Active filters: {activeFiltersCount}
            </span>
            {filters.consultationType && (
              <span className="ml-2 text-blue-600">
                Consultation: {filters.consultationType}
              </span>
            )}
            {filters.specialties.length > 0 && (
              <span className="ml-2 text-blue-600">
                Specialties: {filters.specialties.length} selected
              </span>
            )}
            {filters.sortBy && (
              <span className="ml-2 text-blue-600">
                Sorted by: {filters.sortBy.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        )}
        
        {/* Results count */}
        {!loading && !error && (
          <div className="mb-4 text-gray-600">
            {totalCount === 0 ? (
              <p>No doctors found. Try adjusting your filters.</p>
            ) : (
              <p>Showing {Math.min(currentPage * doctorsPerPage, totalCount) - doctorsPerPage + 1} - {Math.min(currentPage * doctorsPerPage, totalCount)} of {totalCount} doctors</p>
            )}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Doctors list */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="space-y-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
        
        {/* No results state */}
        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600 font-medium">No doctors found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default DoctorsListingPage;