import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from 'lucide-react';
import Image from "next/image";

const ServiceCard = ({ service, onEdit, onDelete }) => {
  // Handle both API data format and sample data format
  let imageUrl;
  
  if (service.icon && service.icon.data) {
    // Check if data is already a data URL (sample data format)
    if (typeof service.icon.data === 'string' && service.icon.data.startsWith('data:')) {
      imageUrl = service.icon.data;
    } 
    // Handle Buffer data from API (convert to base64)
    else if (service.icon.data.type === 'Buffer' && service.icon.data.data) {
      // Convert Buffer array to base64
      const bytes = new Uint8Array(service.icon.data.data);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      const base64 = btoa(binary);
      imageUrl = `data:${service.icon.contentType || 'image/png'};base64,${base64}`;
    }
    // Handle direct base64 string from API
    else if (typeof service.icon.data === 'string') {
      imageUrl = `data:${service.icon.contentType || 'image/png'};base64,${service.icon.data}`;
    }
    // Fallback for any other format
    else {
      console.warn('Unknown icon data format:', service.icon.data);
      imageUrl = `data:${service.icon.contentType || 'image/png'};base64,${service.icon.data}`;
    }
  } else {
    // Fallback placeholder
    imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+';
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="group bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
      {/* Icon Section with black transparent background */}
      <div className="relative h-40 sm:h-48 bg-white border-b border-gray-200 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={service.serviceName}
            width={60}
            height={60}
            className="absolute inset-0 w-full h-full object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content Section - Matching Home Page Typography */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-md font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-300">
            {service.serviceName}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Created {formatDate(service.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  service.isActive === true || service.isActive === "true"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  service.isActive === true || service.isActive === "true"
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {service.isActive === true || service.isActive === "true" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Using proper Button component sizes */}
        <div className="flex gap-2 sm:gap-3 pt-2">
          <Button
            size="lg"
            onClick={() => onEdit(service)}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-300 font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            size="lg"
            variant="destructive"
            onClick={() => onDelete(service)}
            className="flex-1 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;