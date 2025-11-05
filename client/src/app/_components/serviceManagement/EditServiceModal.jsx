import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from 'lucide-react';
import Modal from './Modal';
import { useState, useEffect } from 'react';

const EditServiceModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  preview, 
  onFileChange,
  selectedService 
}) => {
  // Local state for subService input
  const [subServiceInput, setSubServiceInput] = useState("");

  // Sync local input if modal opens with new service
  useEffect(() => { setSubServiceInput(""); }, [isOpen, selectedService]);

  // Add sub-service to list
  const handleAddSubService = (e) => {
    e.preventDefault();
    const val = subServiceInput.trim();
    if (!val) return;
    if ((formData.subServices || []).includes(val)) return;
    setFormData({
      ...formData,
      subServices: [...(formData.subServices || []), val]
    });
    setSubServiceInput("");
  };

  // Remove sub-service from list
  const handleRemoveSubService = (idx) => {
    setFormData({
      ...formData,
      subServices: (formData.subServices || []).filter((_, i) => i !== idx)
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Edit Service"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Name *
          </label>
          <Input
            type="text"
            value={formData.serviceName}
            onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
            placeholder="Enter service name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Icon
          </label>
          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-xs font-medium text-gray-600 mb-2">Current icon:</p>
              <div className="flex items-center space-x-2">
                <div className="w-14 h-14 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <img 
                    src={(() => {
                      if (selectedService.icon && selectedService.icon.data) {
                        // Check if data is already a data URL
                        if (typeof selectedService.icon.data === 'string' && selectedService.icon.data.startsWith('data:')) {
                          return selectedService.icon.data;
                        } 
                        // Handle Buffer data from API
                        else if (selectedService.icon.data.type === 'Buffer' && selectedService.icon.data.data) {
                          const bytes = new Uint8Array(selectedService.icon.data.data);
                          const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                          const base64 = btoa(binary);
                          return `data:${selectedService.icon.contentType || 'image/png'};base64,${base64}`;
                        }
                        // Handle direct base64 string
                        else if (typeof selectedService.icon.data === 'string') {
                          return `data:${selectedService.icon.contentType || 'image/png'};base64,${selectedService.icon.data}`;
                        }
                      }
                      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+';
                    })()} 
                    alt="Current icon" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{selectedService.serviceName}</p>
                  <p className="text-xs text-gray-500">Current service icon</p>
                </div>
              </div>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition-all duration-200 hover:bg-gray-50">
            <input
              type="file"
              accept="image/*,.svg"
              onChange={onFileChange}
              className="hidden"
              id="edit-file-upload"
            />
            <label htmlFor="edit-file-upload" className="cursor-pointer block">
              {preview ? (
                <div className="space-y-2">
                  <div className="w-20 h-20 mx-auto bg-gray-50 rounded-lg flex items-center justify-center border">
                    <img src={preview} alt="Preview" className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">New icon selected</p>
                  <p className="text-xs text-gray-400">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Upload new icon</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max 5MB) - Optional</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Status
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="editStatus"
                checked={formData.isActive === true}
                onChange={() => setFormData({...formData, isActive: true})}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="editStatus"
                checked={formData.isActive === false}
                onChange={() => setFormData({...formData, isActive: false})}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        {/* Sub-services list input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Sub-Services
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={subServiceInput}
              onChange={e => setSubServiceInput(e.target.value)}
              placeholder="Add a sub-service (e.g. Fan Repair)"
              onKeyDown={e => { if (e.key === 'Enter') handleAddSubService(e); }}
            />
            <Button type="button" onClick={handleAddSubService} className="px-3" disabled={!subServiceInput.trim()}>
              Add
            </Button>
          </div>
          {/* List of sub-services */}
          {(formData.subServices && formData.subServices.length > 0) && (
            <ul className="mt-2 space-y-1">
              {formData.subServices.map((sub, idx) => (
                <li key={idx} className="flex items-center justify-between bg-gray-100 rounded px-3 py-1 text-sm">
                  <span>{sub}</span>
                  <button type="button" onClick={() => handleRemoveSubService(idx)} className="ml-2 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500">Optional. Add multiple sub-services for this service.</p>
        </div>

        <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200">
          <Button 
            type="submit" 
            size="lg"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            disabled={formData.loading}
          >
            {formData.loading ? 'Updating...' : 'Update Service'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={onClose}
            className="flex-1 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditServiceModal;
