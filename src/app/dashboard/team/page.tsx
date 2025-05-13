'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import TeamHeader from '@/components/teams/TeamHeader';
import TeamTable from '@/components/teams/TeamTable';
// import TeamEditModal from '@/components/teams/TeamEditModal';
import TeamMemberModal from '@/components/teams/TeamMemberModal';

export default function TeamsPage() {
   const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Provider store={store}>
      <div className="container mx-auto px-4 py-8">
        <TeamHeader />
        <TeamTable />
        {/* <TeamEditModal /> */}
        <TeamMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
      />

      </div>
    </Provider>
  );
}