import { Button } from "@/components/ui/button";

const ServiceFilters = ({ statusFilter, setStatusFilter, statusCounts }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button
        onClick={() => setStatusFilter('all')}
        size="lg"
        variant={statusFilter === 'all' ? 'default' : 'outline'}
        className={`flex-1 font-medium transition-all duration-300 ${
          statusFilter === 'all'
            ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-md'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
        }`}
      >
        All Services ({statusCounts.all})
      </Button>
      <Button
        onClick={() => setStatusFilter('active')}
        size="lg"
        variant={statusFilter === 'active' ? 'default' : 'outline'}
        className={`flex-1 font-medium transition-all duration-300 ${
          statusFilter === 'active'
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
            : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
        }`}
      >
        Active ({statusCounts.active})
      </Button>
      <Button
        onClick={() => setStatusFilter('inactive')}
        size="lg"
        variant={statusFilter === 'inactive' ? 'default' : 'outline'}
        className={`flex-1 font-medium transition-all duration-300 ${
          statusFilter === 'inactive'
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
        }`}
      >
        Inactive ({statusCounts.inactive})
      </Button>
    </div>
  );
};

export default ServiceFilters;
