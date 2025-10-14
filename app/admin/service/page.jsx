'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ServiceFilters from '../../_components/serviceManagement/ServiceFilters';
import ServiceSearchBar from '../../_components/serviceManagement/ServiceSearchBar';
import ServiceGrid from '../../_components/serviceManagement/ServiceGrid';
import CreateServiceModal from '../../_components/serviceManagement/CreateServiceModal';
import EditServiceModal from '../../_components/serviceManagement/EditServiceModal';
import DeleteServiceModal from '../../_components/serviceManagement/DeleteServiceModal';
import isAdmin from '@/app/_components/privateroutes/isAdmin';
import Header from '../../../components/ui/Header';

const Page = ({ role }) => {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    serviceName: '',
    isActive: true,
    subServices: [] // always an array
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  

  // Filtered services
  const filteredServices = services.filter(service => {
    // Defensive: handle missing/null serviceName
    const name = (service.serviceName || '').toString().toLowerCase();
    const search = (searchTerm || '').toString().toLowerCase();
    const matchesSearch = name.includes(search);

    // Defensive: handle missing/null isActive
    const isActive = service.isActive === true || service.isActive === "true";
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = isActive;
    else if (statusFilter === 'inactive') matchesStatus = !isActive;

    return matchesSearch && matchesStatus;
  });

  // Get status counts
  const statusCounts = {
    all: services.length,
    active: services.filter(service => service.isActive === true || service.isActive === "true").length,
    inactive: services.filter(service => service.isActive === false || service.isActive === "false").length
  };

  // Reset form
  const resetForm = () => {
    setFormData({ serviceName: '', isActive: true, subServices: [] });
    setSelectedFile(null);
    setPreview(null);
  };


  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_all_services`);
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        // If API fails, show sample data
        toast('Using sample data - API returned no data');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast('Using sample data - API not available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // File change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create service
  const handleCreateService = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, loading: true }));
    setLoading(true);

    // Validate required fields
    if (!formData.serviceName.trim() || !selectedFile) {
      toast.error('Please fill all required fields');
      setFormData((prev) => ({ ...prev, loading: false }));
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('serviceName', formData.serviceName.trim());
    formDataToSend.append('icon', selectedFile);
    formDataToSend.append('isActive', formData.isActive);
    formDataToSend.append('role', role);
    // Add subServices as JSON string array if provided
    if (Array.isArray(formData.subServices) && formData.subServices.length > 0) {
      formDataToSend.append('subServices', JSON.stringify(formData.subServices));
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/create_service`,
        {
          method: "POST",
          body: formDataToSend
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchServices();
        setShowCreateModal(false);
        resetForm();
        toast.success('Service created successfully!');
      } else {
        toast.error(data.message || 'Failed to create service');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('Failed to create service. Please try again.');
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
      setLoading(false);
    }
  };

  // Edit service
  const handleEditService = (service) => {
    setSelectedService(service);
    setFormData({
      serviceName: service.serviceName,
      isActive: service.isActive,
      subServices: Array.isArray(service.subServices) ? service.subServices : []
    });
    setSelectedFile(null);
    setPreview(
      service.icon?.url ||
      (service.icon?.data && typeof service.icon.data === "string" && service.icon.data.startsWith("data:")
        ? service.icon.data
        : null)
    );
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, loading: true }));

    if (!formData.serviceName.trim()) {
      toast.error('Service name is required');
      setFormData((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Check for duplicate service name (excluding current service)
    const exists = services.some(service =>
      service._id !== selectedService._id &&
      service.serviceName.toLowerCase() === formData.serviceName.toLowerCase()
    );

    if (exists) {
      toast.error('Service with this name already exists');
      setFormData((prev) => ({ ...prev, loading: false }));
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('serviceName', formData.serviceName.trim());
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('role', role);
      if (selectedFile) {
        formDataToSend.append('icon', selectedFile);
      }
      // Add subServices as JSON string array if provided
      if (Array.isArray(formData.subServices) && formData.subServices.length > 0) {
        formDataToSend.append('subServices', JSON.stringify(formData.subServices));
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/update_service/${selectedService._id}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchServices();
        setShowEditModal(false);
        setSelectedService(null);
        resetForm();
        toast.success('Service updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update service');
      }
    } catch (error) {
      toast.error('Failed to update service. Please try again.');
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
      setLoading(false);
    }
  };

  // Delete service
  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    setFormData((prev) => ({ ...prev, loading: true }));
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/delete_service/${selectedService._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: role }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setServices(prev => prev.filter(service => service._id !== selectedService._id));
        setShowDeleteModal(false);
        setSelectedService(null);
        fetchServices();
        toast.success('Service deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete service');
      }
    } catch (error) {
      toast.error('Failed to delete service. Please try again.');
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  // Toggle service status
  const handleToggleStatus = async (serviceId) => {
    setLoading(true);
    
    try {
      setServices(prev => prev.map(service => {
        if (service._id === serviceId) {
          // Handle both boolean and string values for isActive
          const currentStatus = service.isActive === true || service.isActive === "true";
          return { 
            ...service, 
            isActive: !currentStatus, 
            updatedAt: new Date().toISOString() 
          };
        }
        return service;
      }));
      
      const service = services.find(s => s._id === serviceId);
      const currentStatus = service.isActive === true || service.isActive === "true";
        // Add subServices as JSON string array if provided
        if (Array.isArray(formData.subServices) && formData.subServices.length > 0) {
            formDataToSend.append('subServices', JSON.stringify(formData.subServices));
        }
      setLoading(false);
    }
    catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Failed to toggle service status. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="bottom-center" reverseOrder={false} time={5000} />
      {/* Enhanced Header - Static Position */}
      <Header title="Service Management" description="Manage your service categories and icons with ease" />

      {/* Search and Content - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Search Bar with Status Filter - Responsive */}
        <div className=" flex flex-col md:flex-row justify-start md:justify-between items-center mb-8 sm:mb-10 space-y-4">
          {/* Status Filter Tabs */}
          <ServiceFilters 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusCounts={statusCounts}
          />
          
          {/* Search and Add Button */}
          <ServiceSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setShowCreateModal(true)}
          />
        </div>

        {/* Services Grid */}
        <ServiceGrid 
          filteredServices={filteredServices}
          loading={loading}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onToggleStatus={handleToggleStatus}
          onCreateClick={() => setShowCreateModal(true)}
        />
      </div>

      {/* Create Service Modal */}
      <CreateServiceModal 
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreateService}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onFileChange={handleFileChange}
      />

      {/* Edit Service Modal */}
      <EditServiceModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedService(null);
          resetForm();
        }}
        onSubmit={handleUpdateService}
        formData={formData}
        setFormData={setFormData}
        preview={preview}
        onFileChange={handleFileChange}
        selectedService={selectedService}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal 
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedService(null);
        }}
        onConfirm={confirmDeleteService}
        serviceName={selectedService?.serviceName}
      />
    </div>
  );
};

export default isAdmin(Page);
