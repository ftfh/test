import React from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentMatch: number;
  totalMatches: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  currentMatch,
  totalMatches,
  onNextMatch,
  onPrevMatch,
  onClear
}) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border-b">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-8 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {totalMatches > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <span className="bg-yellow-100 px-2 py-1 rounded text-xs">
            {currentMatch + 1} of {totalMatches}
          </span>
          <button
            onClick={onPrevMatch}
            className="p-1 hover:bg-gray-200 rounded"
            disabled={totalMatches === 0}
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={onNextMatch}
            className="p-1 hover:bg-gray-200 rounded"
            disabled={totalMatches === 0}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
};