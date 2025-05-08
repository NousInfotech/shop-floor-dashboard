// redux/features/sites/sitesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Site } from '@/types/site';
import { sitesData } from '@/data/sites';

interface SitesState {
  sites: Site[];
  activeSite: string;
}

const initialState: SitesState = {
  sites: sitesData,
  activeSite: 'Main Factory',
};

export const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setActiveSite: (state, action: PayloadAction<string>) => {
      state.activeSite = action.payload;
    },
    addSite: (state, action: PayloadAction<Site>) => {
      state.sites.push(action.payload);
    },
    updateSite: (state, action: PayloadAction<Site>) => {
      const index = state.sites.findIndex(site => site.id === action.payload.id);
      if (index !== -1) {
        state.sites[index] = action.payload;
      }
    },
    removeSite: (state, action: PayloadAction<string>) => {
      state.sites = state.sites.filter(site => site.id !== action.payload);
    },
  },
});

export const { setActiveSite, addSite, updateSite, removeSite } = sitesSlice.actions;

export const selectSites = (state: RootState) => state.sites.sites;
export const selectActiveSite = (state: RootState) => state.sites.activeSite;

export default sitesSlice.reducer;
