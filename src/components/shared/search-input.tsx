 'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({ placeholder = 'Search...', value, onChange, className }: SearchInputProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 rounded-full bg-gray-50 focus:ring-blue-500"
        placeholder={placeholder}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
}
