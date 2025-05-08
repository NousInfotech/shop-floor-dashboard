// components/shop-floor/site-selector.tsx
'use client';

import { useSelector } from 'react-redux';
import { selectSites } from '@/redux/features/sites/sitesSlice';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';

interface SiteSelectorProps {
  activeSite: string;
  onSiteChange: (siteName: string) => void;
}

export default function SiteSelector({ activeSite, onSiteChange }: SiteSelectorProps) {
  const sites = useSelector(selectSites);
  
  return (
    <div className="flex space-x-2 overflow-x-auto">
      {sites.map((site) => (
        <button
          key={site.id}
          className={cn(
            "px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap flex flex-col items-center",
            activeSite === site.name
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white bg-opacity-80 hover:bg-opacity-100"
          )}
          onClick={() => onSiteChange(site.name)}
        >
          <span className="font-medium text-sm sm:text-base">{site.name}</span>
          
          {/* Use StatusBadge here */}
          <StatusBadge status={site.status} className="mt-1" />
        </button>
      ))}
    </div>
  );
}
