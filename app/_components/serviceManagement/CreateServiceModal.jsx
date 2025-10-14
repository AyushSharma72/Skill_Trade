import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from 'lucide-react';
import Modal from './Modal';
import { useState } from 'react';

const CreateServiceModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  preview, 
  onFileChange 
}) => {
  // Local state for subService input
  const [subServiceInput, setSubServiceInput] = useState("");

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
      title="Create New Service"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Name *
          </label>
          <Input
            type="text"
            value={formData.serviceName}
            onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
            placeholder="Enter service name (e.g., Electrical Repairs)"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Icon *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-all duration-200 hover:bg-gray-50">
            <input
              type="file"
              accept="image/*,.svg"
              onChange={onFileChange}
              className="hidden"
              id="create-file-upload"
              required
            />
            <label htmlFor="create-file-upload" className="cursor-pointer block">
              {preview ? (
                <div className="space-y-3">
                  <div className="w-24 h-24 mx-auto bg-gray-50 rounded-lg flex items-center justify-center border">
                    <img src={preview} alt="Preview" className="w-20 h-20 object-contain" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Click to change image</p>
                  <p className="text-xs text-gray-400">SVG, PNG, JPG (max 5MB)</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Upload service icon</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max 5MB)</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Status
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="createStatus"
                checked={formData.isActive === true}
                onChange={() => setFormData({...formData, isActive: true})}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="createStatus"
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

        <div className="flex gap-3 pt-4 sm:pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            size="lg"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            disabled={formData.loading}
          >
            {formData.loading ? 'Creating...' : 'Create Service'}
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

export default CreateServiceModal;
