import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from 'lucide-react';

const ServiceSearchBar = ({ searchTerm, onSearchChange, onAddClick }) => {
  return (
    <div className="flex flex-row sm:flex-row lg:items-center lg:justify-between gap-4 pb-4">
      <div className="relative max-w-full lg:max-w-lg block md:hidden lg:block flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4  sm:h-5 sm:w-5 text-gray-400 " />
        </div>
        <Input
          type="text"
          placeholder="Search services by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 sm:pl-12 h-10 pr-10 sm:pr-4 text-gray-900 placeholder-gray-500"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between lg:justify-end space-x-4">
        <Button 
          size="lg"
          onClick={onAddClick}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-6 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
        >
          <Plus className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Add New Service
        </Button>
      </div>
    </div>
  );
};

export default ServiceSearchBar;
