import { useState } from 'react';
import {Employee } from '@/types/employee';
import { generateEmployeeCode } from '../utils/helpers';

export const useEmployeeForm = (initialData?: Partial<Employee>) => {
  const defaultData: Omit<Employee, 'id'> = {
    employeeCode: generateEmployeeCode(),
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    site: 'Main Factory',
    siteCode: 'MAIN',
    employmentType: 'Full-time',
    status: 'Active',
    shift: 'Morning',
    role: '',
    department: '',
    position: '',
    payment: {
      currency: 'USD',
      rateType: 'Hourly',
      unitCost: 0,
    }
  };

  const [formData, setFormData] = useState<any>({
    ...defaultData,
    ...initialData,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File size validation (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image must be less than 2MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any error for this field
      if (errors.photo) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.photo;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'address',
      'employeeCode', 'site', 'siteCode', 'role'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Unit cost validation
    if (formData.payment?.unitCost === undefined || formData.payment.unitCost <= 0) {
      newErrors['payment.unitCost'] = 'Unit cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(defaultData);
    setPhotoPreview(null);
    setErrors({});
  };

  return {
    formData,
    photoPreview,
    errors,
    handleChange,
    handleSelectChange,
    handlePhotoChange,
    validateForm,
    resetForm,
    setFormData,
  };
};