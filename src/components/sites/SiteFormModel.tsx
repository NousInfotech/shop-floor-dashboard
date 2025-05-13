import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useDispatch } from 'react-redux';
import { addSite, updateSite } from '@/redux/features/sites/sitesSlice';
import { Site } from '@/types/site';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  site?: Site | null;
}

// Define form data interface to avoid using 'any'
interface SiteFormData {
  name: string;
  description: string;
  address: string;
  isActive: boolean;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  [key: string]: string | boolean; // Index signature for dynamic access
}

const SiteFormModal: React.FC<SiteFormModalProps> = ({ isOpen, onClose, site }) => {
  const dispatch = useDispatch();
  const isEditMode = !!site;

  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    description: '',
    address: '',
    isActive: true,
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name ?? '',
        description: site.description ?? '',
        address: site.address ?? '',
        isActive: site.isActive ?? true,
        contactPerson: site.contactPerson ?? '',
        contactEmail: site.contactEmail ?? '',
        contactPhone: site.contactPhone ?? ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        isActive: true,
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      });
    }
  }, [site, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && site) {
      dispatch(updateSite({ id: site.id, ...formData }));
    } else {
      dispatch(addSite(formData));
    }
    onClose();
  };

  // Define interface for input field structure
  interface InputField {
    id: 'name' | 'address' | 'contactPerson' | 'contactEmail' | 'contactPhone';
    label: string;
    placeholder: string;
    type?: string;
  }

  // Define input field configuration
  const inputFields: InputField[] = [
    { id: 'name', label: 'Site Name', placeholder: 'Main Factory', type: 'text' },
    { id: 'address', label: 'Address', placeholder: '123 Factory Rd, Industrial Park', type: 'text' },
    { id: 'contactPerson', label: 'Contact Person', placeholder: 'John Doe', type: 'text' },
    { id: 'contactEmail', label: 'Contact Email', placeholder: 'john.doe@example.com', type: 'email' },
    { id: 'contactPhone', label: 'Contact Phone', placeholder: '+1 234 567 890', type: 'text' }
  ];
  
  // Type for the input field IDs
  // type InputFieldId = InputField['id'];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scroll">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold">
            {isEditMode ? 'Edit Site' : 'Add New Site'}
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-1">
            {isEditMode ? 'Update site details below.' : 'Fill in the form to create a new site.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {inputFields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="font-medium text-sm text-gray-700">{field.label}</Label>
              <Input
                id={field.id}
                name={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={formData[field.id] as string}
                onChange={handleChange}
                className="border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          ))}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="font-medium text-sm text-gray-700">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Primary production facility"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px] border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Toggle Site Active */}
          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div className="space-y-1">
              <Label htmlFor="isActive" className="font-medium text-sm text-gray-700">Site Status</Label>
              <p className="text-xs text-gray-500">Enable or disable this site.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
                className={formData.isActive ? 'bg-blue-600' : 'bg-gray-300'}
              />
              <span className={`text-sm font-medium ${formData.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-end space-x-3 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {isEditMode ? 'Update Site' : 'Create Site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteFormModal;