import React from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { SPECIALTIES, CONSULTATION_TYPES, ConsultationType, FilterState } from '../types/doctor';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <Filter size={20} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Clear all filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consultation Type Filter (Single Select) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Consultation Type</h3>
          <div className="flex flex-wrap gap-2">
            {CONSULTATION_TYPES.map((type) => (
              <label
                key={type}
                className={`flex items-center px-3 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                  filters.consultationType === type
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 hover:bg-gray-200 border border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="consultationType"
                  value={type}
                  checked={filters.consultationType === type}
                  onChange={() => onFilterChange('consultationType', type)}
                  className="sr-only"
                />
                {type}
              </label>
            ))}
            {filters.consultationType && (
              <button
                onClick={() => onFilterChange('consultationType', '')}
                className="text-xs text-gray-500 hover:text-gray-700 ml-2 self-center"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Specialties Filter (Multi Select) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {SPECIALTIES.map((specialty) => (
              <label
                key={specialty}
                className={`flex items-center px-3 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                  filters.specialties.includes(specialty)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 hover:bg-gray-200 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  value={specialty}
                  checked={filters.specialties.includes(specialty)}
                  onChange={(e) => {
                    const newSpecialties = e.target.checked
                      ? [...filters.specialties, specialty]
                      : filters.specialties.filter((s) => s !== specialty);
                    onFilterChange('specialties', newSpecialties);
                  }}
                  className="sr-only"
                />
                {specialty}
              </label>
            ))}
            {filters.specialties.length > 0 && (
              <button
                onClick={() => onFilterChange('specialties', [])}
                className="text-xs text-gray-500 hover:text-gray-700 ml-2 self-center"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        
        {/* Sort Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                checked={filters.sortBy === 'fees_low_to_high'}
                onChange={() => onFilterChange('sortBy', 'fees_low_to_high')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">Fees: Low to High</span>
              <SortAsc size={16} className="text-gray-500" />
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                checked={filters.sortBy === 'fees_high_to_low'}
                onChange={() => onFilterChange('sortBy', 'fees_high_to_low')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">Fees: High to Low</span>
              <SortDesc size={16} className="text-gray-500" />
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                checked={filters.sortBy === 'experience_high_to_low'}
                onChange={() => onFilterChange('sortBy', 'experience_high_to_low')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">Experience: High to Low</span>
              <SortDesc size={16} className="text-gray-500" />
            </label>
            {filters.sortBy && (
              <button
                onClick={() => onFilterChange('sortBy', '')}
                className="text-xs text-gray-500 hover:text-gray-700 self-start"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;