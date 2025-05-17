'use client'

import { useSelector } from 'react-redux'
import { selectSites } from '@/redux/features/sites/sitesSlice'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'
import { Building2 } from 'lucide-react'

interface SiteSelectorProps {
  activeSite: string
  onSiteChange: (siteName: string) => void
  visibleSiteIndices: number[]
}

export default function SiteSelector({
  activeSite,
  onSiteChange,
  visibleSiteIndices,
}: SiteSelectorProps) {
  const sites = useSelector(selectSites)

  // Filter valid indices and then map
  const visibleSites = visibleSiteIndices
    .filter(index => index >= 0 && index < sites.length)
    .map(index => sites[index])

  return (
    <div className="w-full grid grid-cols-3 gap-3">
      {visibleSites.map((site) => (
        <button
          key={site.id}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-2 shadow-sm hover:scale-105",
            activeSite === site.name
              ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium"
              : "bg-white text-gray-700 border border-blue-200 hover:border-blue-400"
          )}
          onClick={() => onSiteChange(site.name)}
        >
          <Building2
            className={cn(
              "h-4 w-4",
              activeSite === site.name ? "text-white" : "text-blue-500"
            )}
          />
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{site.name}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <StatusBadge
                status={site.status ?? 'inactive'}
                className={cn(
                  "mt-0.5 text-xs",
                  activeSite === site.name ? "opacity-90" : "opacity-80"
                )}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
