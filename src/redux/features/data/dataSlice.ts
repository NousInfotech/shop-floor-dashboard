import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productSitesData } from '@/data/product-sites';
import { bomData } from '@/data/bom';
import { routingData } from '@/data/routing';
import { stockDetailsData } from '@/data/stock-details';

interface DataState {
  productSites: typeof productSitesData;
  bom: typeof bomData;
  routing: typeof routingData;
  stockDetails: typeof stockDetailsData;
  loading: boolean;
}

const initialState: DataState = {
  productSites: productSitesData,
  bom: bomData,
  routing: routingData,
  stockDetails: stockDetailsData,
  loading: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // We won't add more reducers since these are read-only pages
  },
});

export const { setLoading } = dataSlice.actions;
export default dataSlice.reducer;