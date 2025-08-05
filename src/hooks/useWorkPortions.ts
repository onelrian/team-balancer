import { useState, useEffect } from 'react';
import { WorkPortion } from '@/types/work';

export function useWorkPortions() {
  const [workPortions, setWorkPortions] = useState<WorkPortion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkPortions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/work-portions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch work portions');
        }
        
        const data: WorkPortion[] = await response.json();
        setWorkPortions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPortions();
  }, []);

  return { workPortions, loading, error };
}