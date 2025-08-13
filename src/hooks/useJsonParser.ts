import { useState, useMemo } from 'react';

interface JsonParserResult {
  parsedData: any;
  error: string | null;
  isValid: boolean;
}

export const useJsonParser = (jsonString: string): JsonParserResult => {
  return useMemo(() => {
    if (!jsonString.trim()) {
      return {
        parsedData: null,
        error: null,
        isValid: false
      };
    }

    try {
      const parsed = JSON.parse(jsonString);
      return {
        parsedData: parsed,
        error: null,
        isValid: true
      };
    } catch (error) {
      return {
        parsedData: null,
        error: error instanceof Error ? error.message : 'Invalid JSON',
        isValid: false
      };
    }
  }, [jsonString]);
};