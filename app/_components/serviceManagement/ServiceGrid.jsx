import { Button } from "@/components/ui/button";
import ServiceCard from "@/app/_components/serviceManagement/ServiceCard";
import { Plus, Search } from 'lucide-react';

const ServiceGrid = ({ 
  loading, 
  filteredServices, 
  searchTerm, 
  onCreateClick, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-300 border-t-gray-900"></div>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Loading Services</h3>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Please wait while we fetch your services...</p>
        </div>
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            {searchTerm ? (
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            ) : (
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {searchTerm ? 'No services found' : 'No services yet'}
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
            {searchTerm 
              ? `No services match "${searchTerm}". Try adjusting your search terms.` 
              : 'Get started by creating your first service category with a custom icon.'
            }
          </p>
          {!searchTerm && (
            <Button 
              size="lg"
              onClick={onCreateClick}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create New Service
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grid with responsive columns matching home page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service._id} 
            service={service} 
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
      
      {/* Grid Footer Stats - Responsive */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span>{filteredServices.length} Services Displayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceGrid;
