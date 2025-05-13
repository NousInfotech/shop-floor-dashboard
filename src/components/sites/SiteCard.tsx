import React from 'react';
import { Site, Location } from '@/types/site';
import { useDispatch } from 'react-redux';
import { removeSite } from '@/redux/features/sites/sitesSlice';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, PlusCircle, Pencil, Trash2 } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  onEdit: (site: Site) => void;
  onAddLocation: (siteId: string) => void;
  onEditLocation: (siteId: string, locationId: string) => void;  // <-- Correct type
  onRemoveLocation: (siteId: string, locationId: string) => void;
}



const SiteCard: React.FC<SiteCardProps> = ({ site, onEdit, onAddLocation ,   onEditLocation,
  onRemoveLocation,}) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this site?')) {
      dispatch(removeSite(site.id));
    }
  };

  return (
    <div className="w-full mb-8 border-b pb-4 bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Building2 size={24} className="text-gray-600" />
          <h3 className="text-xl font-semibold">{site.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs ${site.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {site.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onAddLocation(site.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <PlusCircle size={16} /> Add Location
          </Button>
          <Button
            onClick={() => onEdit(site)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1"
          >
            <Pencil size={16} /> Edit
          </Button>
          <Button
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <Trash2 size={16} /> Remove
          </Button>
        </div>
      </div>

      <p className="text-gray-600 mb-1">{site.description}</p>
      <div className="flex items-center gap-1 text-gray-500">
        <MapPin size={16} />
        <span>{site.address}</span>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-medium mb-2">Locations within this site</h4>
        {site.locations && site.locations.length > 0 ? (
          <div className="space-y-2">
            {site.locations.map((location: Location) => (
              <div key={location.id} className="p-3 border rounded flex justify-between items-start bg-gray-50">
                <div>
                  <h5 className="font-medium">{location.name}</h5>
                  <p className="text-sm text-gray-600">{location.description}</p>
                  {location.addressDetails && (
                    <p className="text-sm text-gray-500">{location.addressDetails}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-1">
                 <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1"
                    onClick={() => onEditLocation(site.id, location.id)}
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    onClick={() => onRemoveLocation(site.id, location.id)}
                  >
                    <Trash2 size={14} /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 border rounded bg-gray-50">
            No locations added to this site yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteCard;
