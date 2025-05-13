import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SitesList from './SitesList';
import LocationsList from './LocationsList';
import LocationFormModal from './AddLocationModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Location as SiteLocation, Site } from '@/types/site';
import { Building2, MapPin, Plus } from 'lucide-react';
import SiteFormModal from './SiteFormModel';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { removeLocation, removeSite } from '@/redux/features/sites/sitesSlice';

const SitesPage: React.FC = () => {
  const dispatch = useDispatch();

  // Modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Selected items for editing/deleting
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SiteLocation | null>(null);
  const [itemToDelete, setItemToDelete] = useState< { id: string; type: 'site' } | { id: string; type: 'location'; siteId: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'sites' | 'locations'>('sites');

  const handleEditSite = (site: Site) => {
    setSelectedSite(site);
    setIsSiteModalOpen(true);
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsLocationModalOpen(true);
  };

  const handleEditLocation = (location: SiteLocation) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(true);
  };

  // const handleDeleteSite = (siteId: string) => {
  //   setItemToDelete({ id: siteId, type: 'site' });
  //   setIsDeleteConfirmOpen(true);
  // };

  const handleDeleteLocation = (locationId: string, siteId: string) => {
    setItemToDelete({ id: locationId, siteId, type: 'location' });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'site') {
        dispatch(removeSite(itemToDelete.id));
        toast.success("Site has been removed successfully");
      } else if (itemToDelete.type === 'location') {
        dispatch(removeLocation({ siteId: itemToDelete.siteId, locationId: itemToDelete.id }));
        toast.success("Location has been removed successfully");
      }
    }
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-3 text-gray-800">
            <Building2 size={24} />
            Sites & Locations
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your manufacturing sites and locations efficiently</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300 ease-in-out px-6 py-3 rounded-md shadow-md mb-4"
            onClick={() => {
              setSelectedLocation(null);
              setIsLocationModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Add Location
          </Button>
          <Button
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300 ease-in-out px-6 py-3 rounded-md shadow-md mb-4"
            onClick={() => {
              setSelectedSite(null);
              setIsSiteModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Add Site
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="sites"
        className="mb-6 "
        onValueChange={(value) => setActiveTab(value as 'sites' | 'locations')}
      >
        <TabsList className="grid w-full max-w-full grid-cols-2 mb-4  bg-gray-200 ">
          <TabsTrigger value="sites" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-300 ">
            <Building2 size={16} />
            Sites
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-300 ">
            <MapPin size={16} />
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sites">
          <SitesList
            onEditSite={handleEditSite}
            onAddLocation={handleAddLocation}
            activeTab={activeTab}
          />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsList
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
            onAddLocation={handleAddLocation}
          />
        </TabsContent>
      </Tabs>

      <SiteFormModal
        isOpen={isSiteModalOpen}
        onClose={() => {
          setIsSiteModalOpen(false);
          setSelectedSite(null);
        }}
        site={selectedSite}
      />

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

export default SitesPage;
