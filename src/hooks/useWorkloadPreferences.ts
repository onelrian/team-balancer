import { useState, useEffect } from 'react';
import { WorkloadPreference } from '@/types/work';

export function useWorkloadPreferences() {
  const [preferences, setPreferences] = useState<WorkloadPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/workload-preferences');
        
        if (!response.ok) {
          throw new Error('Failed to fetch workload preferences');
        }
        
        const data: WorkloadPreference[] = await response.json();
        setPreferences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const setPreference = async (workPortionId: number, preferenceLevel: number) => {
    try {
      const response = await fetch('/api/workload-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workPortionId, preferenceLevel }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set workload preference');
      }
      
      const newPreference: WorkloadPreference = await response.json();
      
      // Update the preferences list
      setPreferences(prev => {
        const existingIndex = prev.findIndex(p => p.workPortionId === workPortionId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newPreference;
          return updated;
        }
        return [...prev, newPreference];
      });
      
      return newPreference;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  return { preferences, loading, error, setPreference };
}