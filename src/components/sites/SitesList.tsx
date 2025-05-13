import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import SiteCard from './SiteCard';
import { Building2 } from 'lucide-react';
import { Site, Location } from '@/types/site';
import { removeLocation, removeSite } from '@/redux/features/sites/sitesSlice';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import { toast } from 'sonner';
import LocationFormModal from './AddLocationModal';

interface SitesListProps {
  onEditSite: (site: Site) => void;
  onAddLocation: (siteId: string) => void;
  activeTab: 'sites' | 'locations';
}

const SitesList: React.FC<SitesListProps> = ({ onEditSite, onAddLocation, activeTab }) => {
  const dispatch = useDispatch();
  const sites = useSelector((state: RootState) => state.sites.sites);

  // Modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected items for editing/deleting
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: 'site' | 'location';
    siteId?: string;
  } | null>(null);

  const handleEditLocation = (location: Location, siteId: string) => {
    const site = sites.find((site) => site.id === siteId);
    if (site) setSelectedSite(site);
    setSelectedLocation(location);
    setIsLocationModalOpen(true);
  };

  const handleDeleteLocation = (siteId: string, locationId: string) => {
    setItemToDelete({ id: locationId, siteId, type: 'location' });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'site') {
        dispatch(removeSite(itemToDelete.id));
        toast.success('Site has been removed successfully');
      } else if (itemToDelete.type === 'location') {
        dispatch(removeLocation({ siteId: itemToDelete.siteId!, locationId: itemToDelete.id }));
        toast.success('Location has been removed successfully');
      }
    }
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  if (sites.length === 0) {
    return (
      <div className="text-center py-16">
        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600">No Sites Available</h3>
        <p className="text-gray-500 mt-2">Add your first manufacturing site to get started</p>
      </div>
    );
  }

  if (activeTab === 'locations') {
    const allLocations = sites.flatMap((site) =>
      site.locations.map((location) => ({
        ...location,
        siteName: site.name,
      }))
    );

    if (allLocations.length === 0) {
      return (
        <div className="text-center py-16">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No Locations Available</h3>
          <p className="text-gray-500 mt-2">Add locations to your manufacturing sites</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {allLocations.map((location) => (
          <div key={location.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-semibold text-base text-gray-800">{location.name}</h4>
                <p className="text-sm text-gray-600">{location.description}</p>
                <p className="text-xs text-gray-500 italic">Site: {location.siteName}</p>
                {location.addressDetails && (
                  <p className="text-sm text-gray-500">{location.addressDetails}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 h-fit rounded-full text-xs font-medium border ${
                  location.isActive
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                {location.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {sites.map((site) => (
        <SiteCard
          key={site.id}
          site={site}
          onEdit={onEditSite}
          onAddLocation={onAddLocation}
          onEditLocation={(siteId, locationId) => {
            const site = sites.find((s) => s.id === siteId);
            const location = site?.locations.find((loc) => loc.id === locationId);
            if (location) handleEditLocation(location, siteId); // Pass siteId along with location
          }}
          onRemoveLocation={handleDeleteLocation}
        />
      ))}

      <LocationFormModal
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false);
          setSelectedLocation(null);
        }}
        siteId={selectedSite?.id || ''}
        location={selectedLocation ?? undefined}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete?.type === 'site' ? 'Site' : 'Location'}`}
        description={`Are you sure you want to delete this ${itemToDelete?.type === 'site' ? 'site' : 'location'}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SitesList;
