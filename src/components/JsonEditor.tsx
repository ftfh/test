import React from 'react';
import { AlignLeft, Copy, Minimize2, FileText } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { HighlightedText } from './HighlightedText';
import { JsonSyntaxHighlighter } from './JsonSyntaxHighlighter';
import { useSearch } from '../hooks/useSearch';
import { useJsonParser } from '../hooks/useJsonParser';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, error }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { parsedData, isValid } = useJsonParser(value);
  const { matches, currentMatchIndex, totalMatches, goToNextMatch, goToPrevMatch } = useSearch(value, searchTerm);

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleFormat = () => {
    if (isValid && parsedData) {
      const formatted = JSON.stringify(parsedData, null, 2);
      onChange(formatted);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  const handleMinify = () => {
    if (isValid && parsedData) {
      const minified = JSON.stringify(parsedData);
      onChange(minified);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    try {
      const parsed = JSON.parse(pastedText);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch {
      // If parsing fails, just paste the raw text
      onChange(pastedText);
    }
  };

  const renderHighlightedContent = () => {
    return (
      <div className="absolute inset-0 p-4 font-mono text-sm pointer-events-none whitespace-pre-wrap break-words z-10 text-gray-800">
        <JsonSyntaxHighlighter 
          json={value} 
          searchTerm={searchTerm}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 border-b px-4 py-2 text-sm font-medium text-gray-700 flex justify-between items-center">
        JSON Input
        <div className="flex space-x-2">
          <button
            onClick={handleFormat}
            disabled={!isValid}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Format JSON"
          >
            <AlignLeft size={12} />
            <span>Format</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            title="Copy Content"
          >
            <Copy size={12} />
            <span>Copy</span>
          </button>
          <button
            onClick={handleMinify}
            disabled={!isValid}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Minify JSON"
          >
            <Minimize2 size={12} />
            <span>Minify</span>
          </button>
        </div>
      </div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentMatch={currentMatchIndex}
        totalMatches={totalMatches}
        onNextMatch={goToNextMatch}
        onPrevMatch={goToPrevMatch}
        onClear={handleClear}
      />
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          className={`w-full h-full p-4 font-mono text-sm resize-none border-none outline-none ${
            error ? 'bg-red-50' : 'bg-white'
          } text-gray-800 selection:bg-blue-200 selection:bg-opacity-50`}
          placeholder="Enter your JSON here..."
          spellCheck={false}
        />
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 p-2">
            <div className="text-red-700 text-xs font-medium">Error:</div>
            <div className="text-red-600 text-xs">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};