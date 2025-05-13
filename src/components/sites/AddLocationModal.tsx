// /src/components/shop-floor/sites/LocationFormModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useDispatch, useSelector } from 'react-redux';
import { addLocation, updateLocation } from '@/redux/features/sites/sitesSlice';
import { RootState } from '@/redux/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Location } from '@/types/site';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
  location?: Location | null; 
}


const LocationFormModal: React.FC<LocationFormModalProps> = ({ 
  isOpen, 
  onClose, 
  siteId = '',
  location = null
}) => {
  const dispatch = useDispatch();
  const sites = useSelector((state: RootState) => state.sites.sites);
  
  const [formData, setFormData] = useState({
    id: '',
    siteId: siteId,
    name: '',
    description: '',
    addressDetails: '',
    isActive: true
  });

  // Set form data when editing an existing location
  useEffect(() => {
    if (location) {
      setFormData({
        id: location.id,
        siteId: location.siteId,
        name: location.name,
        description: location.description || '',
        addressDetails: location.addressDetails || '',
        isActive: location.isActive
      });
    } else {
      // Reset form when adding a new location
      setFormData({
        id: '',
        siteId: siteId,
        name: '',
        description: '',
        addressDetails: '',
        isActive: true
      });
    }
  }, [location, siteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSiteChange = (value: string) => {
    setFormData(prev => ({ ...prev, siteId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.siteId) {
      if (location) {
        // Update existing location
        dispatch(updateLocation(formData));
      } else {
        // Add new location
        dispatch(addLocation(formData));
      }
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      siteId: siteId,
      name: '',
      description: '',
      addressDetails: '',
      isActive: true
    });
  };

  return (
 <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
 <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scroll">
    <DialogHeader>
      <DialogTitle className="text-2xl font-semibold">
        {location ? 'Edit Location' : 'Add New Location'}
      </DialogTitle>
      <p className="text-gray-500 text-sm">
        {location ? 'Modify location details below.' : 'Create a new location within a site.'}
      </p>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* Site Select */}
      <div className="space-y-1.5">
        <Label htmlFor="siteId" className="text-sm font-medium text-gray-700">Parent Site</Label>
        <Select 
          value={formData.siteId} 
          onValueChange={handleSiteChange}
          required
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <SelectValue placeholder="Select a site" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {sites.map(site => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Location Name</Label>
        <Input 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Assembly Line 1"
          required
          className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
        <Textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Main assembly line for product X"
          className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Address Details */}
      <div className="space-y-1.5">
        <Label htmlFor="addressDetails" className="text-sm font-medium text-gray-700">Address Details (Optional)</Label>
        <Input 
          id="addressDetails"
          name="addressDetails"
          value={formData.addressDetails}
          onChange={handleChange}
          placeholder="Building B, Floor 2"
          className="rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center space-x-3 pt-2">
        <Switch 
          id="isActive" 
          checked={formData.isActive}
          onCheckedChange={handleSwitchChange}
          className={formData.isActive ? 'bg-green-500' : 'bg-gray-300'}
        />
        <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          {formData.isActive ? 'Location is Active' : 'Location is Inactive'}
        </Label>
      </div>

      {/* Footer Buttons */}
      <DialogFooter className="pt-4 flex gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          className="border border-gray-300 text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
        >
          {location ? 'Save Changes' : 'Add Location'}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  );
};

export default LocationFormModal;