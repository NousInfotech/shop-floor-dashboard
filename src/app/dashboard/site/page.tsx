'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import SitesPage from '@/components/sites/SitesPage';

export default function Page() {
  return (
    <Provider store={store}>
      <SitesPage />
    </Provider>
  );
}