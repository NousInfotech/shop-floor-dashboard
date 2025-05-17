'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Employee } from '@/types/employee';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CURRENCIES, 
  DEPARTMENTS, 
  EMPLOYEE_STATUSES, 
  EMPLOYMENT_TYPES, 
  RATE_TYPES, 
  SHIFT_TYPES 
} from '@/lib/utils/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadIcon, SaveIcon } from 'lucide-react';

interface EditEmployeeFormProps {
  employee: Employee;
  onSubmit: (employee: Employee) => void;
  onCancel: () => void;
}

export default function EditEmployeeForm({ employee, onSubmit }: EditEmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>({
    ...employee,
    payment: employee.payment || {
      currency: 'USD',
      rateType: 'Hourly',
      unitCost: 0,
      locationId: ''
    },
    firstName: employee.firstName || '',
    lastName: employee.lastName || ''
  });
  const [, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(employee.photo || null);
  const [allFieldsValid, setAllFieldsValid] = useState(false);

  useEffect(() => {
    setFormData({
      ...employee,
      payment: employee.payment || {
        currency: 'USD',
        rateType: 'Hourly',
        unitCost: 0,
        locationId: ''
      },
      firstName: employee.firstName || '',
      lastName: employee.lastName || ''
    });
    setPhotoPreview(employee.photo || null);
  }, [employee]);

  // Validate all required fields
  useEffect(() => {
    const requiredFields = [
      formData.employeeCode,
      formData.site,
      formData.firstName,
      formData.lastName,
      formData.siteCode,
      formData.shift,
      formData.email,
      formData.phone,
      formData.address,
      formData.role,
      formData.payment?.currency,
      formData.payment?.rateType,
      formData.payment?.unitCost !== undefined && formData.payment?.unitCost > 0
    ];
    
    setAllFieldsValid(requiredFields.every(Boolean));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => {
      const updatedPayment = {
        ...prev.payment,
        unitCost: isNaN(value) ? 0 : value,
        currency: prev.payment?.currency || 'USD',
        rateType: prev.payment?.rateType || 'Hourly'
      };
      return {
        ...prev,
        payment: updatedPayment
      };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEmployee = {
      ...formData,
      ...(photoPreview !== employee.photo && { photo: photoPreview ?? undefined })
    };
    
    onSubmit(updatedEmployee);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-medium">Edit Employee</h2>
              <p className="text-sm text-gray-500">
                Update employee information
              </p>
            </div>
          </div>

          {/* Always visible submit button at the top */}
          <div className="flex justify-end sticky -top-6 z-10 pt-2 pb-4 bg-white border-b">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" 
              disabled={!allFieldsValid}
            >
              <SaveIcon className="h-4 w-4" />
              Update Employee
            </Button>
          </div>

          {/* Section 1: Employee Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2 text-blue-800">Employee Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeCode" className="font-medium">Employee Code*</Label>
                <Input
                  id="employeeCode"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  placeholder="e.g. EMP0001"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site" className="font-medium">Site*</Label>
                <Select 
                  value={formData.site} 
                  onValueChange={(value) => handleSelectChange('site', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    <SelectItem value="Main Factory">Main Factory</SelectItem>
                    <SelectItem value="Branch Office">Branch Office</SelectItem>
                    <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-medium">First Name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-medium">Last Name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteCode" className="font-medium">Site Code*</Label>
                <Input
                  id="siteCode"
                  name="siteCode"
                  value={formData.siteCode}
                  onChange={handleChange}
                  placeholder="e.g. MAIN01"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentType" className="font-medium">Employment Type</Label>
                <Select 
                  value={formData.employmentType} 
                  onValueChange={(value) => handleSelectChange('employmentType', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="employmentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {EMPLOYMENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="font-medium">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {EMPLOYEE_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift" className="font-medium">Shift*</Label>
                <Select 
                  value={formData.shift} 
                  onValueChange={(value) => handleSelectChange('shift', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {SHIFT_TYPES.map(shift => (
                      <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Section 2: Contact & Role */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2 text-blue-800">Contact & Role</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium">Phone*</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="font-medium">Address*</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="1234 Main St, City, State"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="font-medium">Role*</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Warehouse Supervisor"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="font-medium">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position" className="font-medium">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Supervisor"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <Label className="font-medium">Employee Photo</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Avatar className="h-16 w-16 border border-gray-200">
                  <AvatarImage src={photoPreview || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {formData.firstName?.charAt(0) || ''}
                    {formData.lastName?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center border-gray-300 hover:bg-gray-100"
                    onClick={() => document.getElementById('photo-upload-edit')?.click()}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <Input
                    id="photo-upload-edit"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG or GIF up to 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 3: Payment Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2 text-blue-800">Payment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payment.currency" className="font-medium">Currency*</Label>
                <Select 
                  value={formData.payment?.currency} 
                  onValueChange={(value) => handleSelectChange('payment.currency', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="payment.currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {CURRENCIES.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment.rateType" className="font-medium">Rate Type*</Label>
                <Select 
                  value={formData.payment?.rateType} 
                  onValueChange={(value) => handleSelectChange('payment.rateType', value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" id="payment.rateType">
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg border border-gray-200">
                    {RATE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment.unitCost" className="font-medium">Unit Cost*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    {formData.payment?.currency === 'USD' ? '$' : formData.payment?.currency || ''}
                  </span>
                  <Input
                    id="payment.unitCost"
                    name="payment.unitCost"
                    type="number"
                    value={formData.payment?.unitCost || 0}
                    onChange={handleUnitCostChange}
                    className="pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment.locationId" className="font-medium">Location ID</Label>
                <Input
                  id="payment.locationId"
                  name="payment.locationId"
                  value={formData.payment?.locationId || ''}
                  onChange={(e) => handleSelectChange('payment.locationId', e.target.value)}
                  placeholder="e.g. LOC001"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button at bottom */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={!allFieldsValid}
            >
              <SaveIcon className="h-4 w-4" />
              Update Employee
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}