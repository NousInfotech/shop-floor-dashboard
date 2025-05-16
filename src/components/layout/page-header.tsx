import { Button } from '../ui/button';
import { FileUpIcon, Plus, Search, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { exportAsPDF, exportAsImage, exportAsDoc } from '@/lib/utils/exportUtils';

interface PageHeaderProps {
  title: string;
  description?: string;
  isReadOnly?: boolean;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
  onExport?: (type: 'pdf' | 'image' | 'doc') => void;
  onAdd?: () => void;
}

export default function PageHeader({
  title,
  description,
  isReadOnly = false,
  onSearch,
  searchValue = '',
//   onExport,
  onAdd
}: PageHeaderProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExport = (type: 'pdf' | 'image' | 'doc') => {
    const elementId = 'export-section'; // Add this id to your target content area
    switch (type) {
      case 'pdf':
        exportAsPDF(elementId);
        break;
      case 'image':
        exportAsImage(elementId);
        break;
      case 'doc':
        exportAsDoc(elementId);
        break;
    }
    setShowExportOptions(false);
  };

const fakeEvent = {
  target: { value: '' }
} as React.ChangeEvent<HTMLInputElement>;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 relative">
          {isReadOnly ? (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={onSearch}
                />
                {searchValue && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => onSearch?.(fakeEvent)}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={onAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          )}

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(prev => !prev)}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center"
            >
              <FileUpIcon className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleExport('pdf')}
                  >
                    Export as PDF
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleExport('image')}
                  >
                    Export as Image
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleExport('doc')}
                  >
                    Export as DOC
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="mt-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-600/20">
          Read-only data
        </div>
      )}
    </div>
  );
}
