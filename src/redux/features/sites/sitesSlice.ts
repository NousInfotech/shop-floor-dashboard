import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  Location, SiteFormData, LocationFormData, SiteWithLocations } from '@/types/site';
import { RootState } from '../../store';
import { sitesData } from '@/data/sites';
import { v4 as uuidv4 } from 'uuid';

interface SitesState {
  sites: SiteWithLocations[]; // Updated type to SiteWithLocations to include locations
  activeSite: string;
  loading: boolean;
  error: string | null;
  
}

const initialState: SitesState = {
  sites: sitesData, // Assuming sitesData is now structured with locations as well
  activeSite: 'Main Factory',
  loading: false,
  error: null
};

export const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    // Global flags
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set active site
    setActiveSite: (state, action: PayloadAction<string>) => {
      state.activeSite = action.payload;
    },

    // Set all sites (from API)
    setSites: (state, action: PayloadAction<SiteWithLocations[]>) => { // Updated to handle SiteWithLocations
      state.sites = action.payload;
    },

    // Add site
    addSite: (state, action: PayloadAction<SiteFormData>) => {
      const newSite: SiteWithLocations = { // Updated to SiteWithLocations type
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        locations: [] // Ensure locations are included on new site
      };
      state.sites.push(newSite);
    },

    // Update site
    updateSite: (state, action: PayloadAction<SiteFormData>) => {
      const { id, ...updates } = action.payload;
      const index = state.sites.findIndex(site => site.id === id);
      if (index !== -1) {
        state.sites[index] = {
          ...state.sites[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    // Remove site
    removeSite: (state, action: PayloadAction<string>) => {
      state.sites = state.sites.filter(site => site.id !== action.payload);
    },

    // Add location to site
    addLocation: (state, action: PayloadAction<LocationFormData>) => {
      const { siteId, ...locationData } = action.payload;
      const site = state.sites.find(site => site.id === siteId);
      if (site) {
        const newLocation: Location = {
          id: uuidv4(),
          siteId,
          ...locationData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        site.locations = site.locations || []; // Ensure locations array exists
        site.locations.push(newLocation);
      }
    },

    // Update location
    updateLocation: (state, action: PayloadAction<LocationFormData>) => {
      const { id, siteId, ...updates } = action.payload;
      const site = state.sites.find(site => site.id === siteId);
      if (site && site.locations) {
        const locationIndex = site.locations.findIndex(loc => loc.id === id);
        if (locationIndex !== -1) {
          site.locations[locationIndex] = {
            ...site.locations[locationIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
      }
    },

    // Remove location
    removeLocation: (state, action: PayloadAction<{ siteId: string; locationId: string }>) => {
      const { siteId, locationId } = action.payload;
      const site = state.sites.find(site => site.id === siteId);
      if (site && site.locations) {
        site.locations = site.locations.filter(loc => loc.id !== locationId);
      }
    }
  }
});

// Action exports
export const {
  setLoading,
  setError,
  setSites,
  setActiveSite,
  addSite,
  updateSite,
  removeSite,
  addLocation,
  updateLocation,
  removeLocation
} = sitesSlice.actions;

// Selectors
export const selectSites = (state: RootState) => state.sites.sites;
export const selectActiveSite = (state: RootState) => state.sites.activeSite;
export const selectLoading = (state: RootState) => state.sites.loading;
export const selectError = (state: RootState) => state.sites.error;

// Reducer export
export default sitesSlice.reducer;
