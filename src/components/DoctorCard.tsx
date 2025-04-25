import React from 'react';
import { Star, MapPin, Calendar, Clock } from 'lucide-react';
import { Doctor } from '../types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  if (!doctor) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Doctor Image */}
        <div className="md:w-1/4 p-4 flex items-center justify-center">
          <div className="h-32 w-32 md:h-36 md:w-36 rounded-full overflow-hidden border-4 border-blue-100">
            <img 
              src={doctor.imageUrl} 
              alt={doctor.name} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        {/* Doctor Information */}
        <div className="md:w-3/4 p-4">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-sm text-gray-600">{doctor.specialty} • {doctor.qualification}</p>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-medium mr-2">
              {doctor.experience} years exp
            </div>
            <div className="flex items-center text-amber-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
              <span className="ml-1 text-xs text-gray-500">({doctor.reviewCount} reviews)</span>
            </div>
          </div>
          
          {/* Location if available */}
          {doctor.location && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{doctor.location}</span>
            </div>
          )}
          
          {/* Consultation Types */}
          {doctor.consultationTypes && doctor.consultationTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {doctor.consultationTypes.map((type) => (
                <span 
                  key={type} 
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
          
          {/* Availability */}
          {doctor.availability && doctor.availability.length > 0 && (
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">Available: {doctor.availability.join(', ')}</span>
            </div>
          )}
          
          {/* Fees and Book Button */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xl font-bold text-blue-600">₹{doctor.fees}</span>
              <span className="text-gray-500 text-sm ml-1">consultation fee</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;