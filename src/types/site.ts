
export interface Site {
  id: string;
  name: string;
  address: string; 
  status?: 'Active' | 'Inactive' | 'Maintenance';
  description?: string;
  isActive: boolean;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  locations?: Location[];
}

// Location type definition
export interface Location {
  id: string;
  siteId: string;
  name: string;
 description?: string; 
  addressDetails?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Type for the combined view of sites and their locations
export interface SiteWithLocations extends Site {
  locations: Location[];
}

// Form data types
export interface LocationFormData {
  id?: string;
  siteId: string;
  name: string;
  description: string;
  addressDetails: string;
  isActive: boolean;
}

export interface SiteFormData {
  id?: string;
  name: string;
  address: string;
  description: string;
  isActive: boolean;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}