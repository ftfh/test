import React from 'react';

interface JsonSyntaxHighlighterProps {
  json: string;
  searchTerm: string;
}

interface JsonToken {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'whitespace';
  value: string;
  start: number;
  end: number;
}

export const JsonSyntaxHighlighter: React.FC<JsonSyntaxHighlighterProps> = ({ 
  json, 
  searchTerm 
}) => {
  const tokenize = (text: string): JsonToken[] => {
    const tokens: JsonToken[] = [];
    let i = 0;

    while (i < text.length) {
      const char = text[i];

      // Whitespace
      if (/\s/.test(char)) {
        const start = i;
        while (i < text.length && /\s/.test(text[i])) {
          i++;
        }
        tokens.push({
          type: 'whitespace',
          value: text.slice(start, i),
          start,
          end: i
        });
        continue;
      }

      // Strings (including keys)
      if (char === '"') {
        const start = i;
        i++; // Skip opening quote
        while (i < text.length && text[i] !== '"') {
          if (text[i] === '\\') {
            i += 2; // Skip escaped character
          } else {
            i++;
          }
        }
        if (i < text.length) i++; // Skip closing quote
        
        const value = text.slice(start, i);
        const isKey = i < text.length && text.slice(i).match(/^\s*:/);
        
        tokens.push({
          type: isKey ? 'key' : 'string',
          value,
          start,
          end: i
        });
        continue;
      }

      // Numbers
      if (/[-\d]/.test(char)) {
        const start = i;
        if (char === '-') i++;
        while (i < text.length && /[\d.]/.test(text[i])) {
          i++;
        }
        // Handle scientific notation
        if (i < text.length && /[eE]/.test(text[i])) {
          i++;
          if (i < text.length && /[+-]/.test(text[i])) i++;
          while (i < text.length && /\d/.test(text[i])) {
            i++;
          }
        }
        
        tokens.push({
          type: 'number',
          value: text.slice(start, i),
          start,
          end: i
        });
        continue;
      }

      // Booleans and null
      const remaining = text.slice(i);
      if (remaining.startsWith('true')) {
        tokens.push({
          type: 'boolean',
          value: 'true',
          start: i,
          end: i + 4
        });
        i += 4;
        continue;
      }
      
      if (remaining.startsWith('false')) {
        tokens.push({
          type: 'boolean',
          value: 'false',
          start: i,
          end: i + 5
        });
        i += 5;
        continue;
      }
      
      if (remaining.startsWith('null')) {
        tokens.push({
          type: 'null',
          value: 'null',
          start: i,
          end: i + 4
        });
        i += 4;
        continue;
      }

      // Punctuation
      if (/[{}[\]:,]/.test(char)) {
        tokens.push({
          type: 'punctuation',
          value: char,
          start: i,
          end: i + 1
        });
        i++;
        continue;
      }

      // Unknown character, treat as punctuation
      tokens.push({
        type: 'punctuation',
        value: char,
        start: i,
        end: i + 1
      });
      i++;
    }

    return tokens;
  };

  const getTokenClassName = (type: JsonToken['type']): string => {
    switch (type) {
      case 'key':
        return 'text-blue-800 font-semibold';
      case 'string':
        return 'text-green-600';
      case 'number':
        return 'text-purple-600';
      case 'boolean':
        return 'text-orange-600 font-semibold';
      case 'null':
        return 'text-gray-500 font-semibold';
      case 'punctuation':
        return 'text-gray-600';
      case 'whitespace':
      default:
        return '';
    }
  };

  const highlightSearch = (text: string, searchTerm: string): React.ReactNode => {
    if (!searchTerm.trim()) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = regex.test(part);
      if (isMatch) {
        return (
          <span
            key={index}
            className="bg-yellow-200 font-semibold"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const tokens = tokenize(json);

  return (
    <div className="font-mono text-sm whitespace-pre-wrap break-words">
      {tokens.map((token, index) => (
        <span
          key={index}
          className={getTokenClassName(token.type)}
        >
          {searchTerm ? highlightSearch(token.value, searchTerm) : token.value}
        </span>
      ))}
    </div>
  );
};