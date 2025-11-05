import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import Modal from './Modal';

const DeleteServiceModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  serviceName,
  loading = false
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Delete Service"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-600">
            You are about to delete <strong className="text-gray-900">"{serviceName}"</strong>. 
            This action cannot be undone and will permanently remove this service.
          </p>
        </div>
        
        <div className="flex gap-3 pt-4 sm:pt-6 border-t border-gray-200">
          <Button 
            onClick={onConfirm}
            variant="destructive"
            size="lg"
            className="flex-1 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Service'}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onClose}
            className="flex-1 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteServiceModal;
