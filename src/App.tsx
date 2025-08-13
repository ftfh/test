import React, { useState } from 'react';
import { JsonEditor } from './components/JsonEditor';
import { TreeView } from './components/TreeView';
import { useJsonParser } from './hooks/useJsonParser';
import { FileText } from 'lucide-react';

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "hobbies": ["reading", "swimming", "coding"],
  "scores": [85, 92, 78, 96],
  "metadata": null,
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false,
      "sms": true
    }
  }
}`;

function App() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const { parsedData, error, isValid } = useJsonParser(jsonInput);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center space-x-3">
          <FileText size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">JSON Viewer</h1>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Parse, format, and explore your JSON data with an interactive tree view
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - JSON Input */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <JsonEditor
            value={jsonInput}
            onChange={setJsonInput}
            error={error || undefined}
          />
        </div>

        {/* Right Panel - Tree View */}
        <div className="w-1/2 bg-white">
          <TreeView data={parsedData} title="Tree View" />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-6 py-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className={`flex items-center space-x-1 ${isValid ? 'text-green-600' : error ? 'text-red-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-gray-400'}`}></div>
              <span>{isValid ? 'Valid JSON' : error ? 'Invalid JSON' : 'No input'}</span>
            </span>
            {parsedData && (
              <span>
                {Array.isArray(parsedData) 
                  ? `Array with ${parsedData.length} items` 
                  : `Object with ${Object.keys(parsedData).length} properties`}
              </span>
            )}
          </div>
          <div>
            Characters: {jsonInput.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;