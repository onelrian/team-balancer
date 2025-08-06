import { useState } from 'react';
import { WorkAssignment } from '@/types/work';

interface GenerationResult {
  cycleDate: string;
  assignments: WorkAssignment[];
}

export function useAssignmentGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAssignments = async (): Promise<GenerationResult | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/assignments/generate', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate assignments');
      }
      
      const data: GenerationResult = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateAssignments, loading, error };
}