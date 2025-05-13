// /src/components/shop-floor/sites/LocationsList.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Building, MapPin, PenLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location } from '@/types/site';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import LocationFormModal from './AddLocationModal';

interface LocationsListProps {
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string, siteId: string) => void;
  onAddLocation: (siteId: string) => void;
}

interface ExtendedLocation extends Location {
  siteName: string;
}

const LocationsList: React.FC<LocationsListProps> = ({
//   onEditLocation,
  onDeleteLocation,
  onAddLocation,
}) => {
  const { sites } = useSelector((state: RootState) => state.sites);

  // Flatten all locations from all sites
  const allLocations: ExtendedLocation[] = sites.flatMap(site =>
    site.locations.map(location => ({ ...location, siteName: site.name }))
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  if (allLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white">
        <MapPin size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Locations Available</h3>
        <p className="text-gray-500 mb-6">Add locations to your manufacturing sites</p>
        {sites.length > 0 && (
          <Button
            variant="outline"
            onClick={() => onAddLocation(sites[0].id)} // Use first site's ID as default
            className="bg-blue-600 text-white"
          >
            Add Location
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4">
        {allLocations.map(location => (
          <Card key={location.id} className="overflow-hidden border border-gray-200">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-gray-500" />
                    <h3 className="font-medium text-lg truncate">{location.name}</h3>
                  </div>
                  <Badge variant={location.isActive ? 'success' : 'secondary'}>
                    {location.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <Building size={14} />
                  <span>Site: {location.siteName}</span>
                </div>

                {location.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{location.description}</p>
                )}

                {location.addressDetails && (
                  <p className="text-xs text-gray-500">{location.addressDetails}</p>
                )}
              </div>

              <div className="border-t border-gray-100 mt-2 flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-none py-2 h-auto text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSelectedLocation(location);
                    setIsModalOpen(true);
                  }}
                >
                  <PenLine size={14} className="mr-1" /> Edit
                </Button>
                <div className="w-px bg-gray-100"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-none py-2 h-auto text-red-600 hover:text-red-800"
                  onClick={() => onDeleteLocation(location.id, location.siteId)}
                >
                  <Trash2 size={14} className="mr-1" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LocationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={selectedLocation}
        siteId={selectedLocation?.siteId || ''}
      />
    </>
  );
};

export default LocationsList;