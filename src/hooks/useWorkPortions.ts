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

  const createWorkPortion = async (name: string, description: string, weight: number) => {
    try {
      const response = await fetch('/api/work-portions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, weight }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create work portion');
      }
      
      const newWorkPortion: WorkPortion = await response.json();
      setWorkPortions(prev => [newWorkPortion, ...prev]);
      return newWorkPortion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const updateWorkPortion = async (id: number, name: string, description: string, weight: number) => {
    try {
      const response = await fetch(`/api/work-portions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, weight }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update work portion');
      }
      
      const updatedWorkPortion: WorkPortion = await response.json();
      
      // Update the work portions list
      setWorkPortions(prev =>
        prev.map(wp => wp.id === id ? updatedWorkPortion : wp)
      );
      
      return updatedWorkPortion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  const deleteWorkPortion = async (id: number) => {
    try {
      const response = await fetch(`/api/work-portions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete work portion');
      }
      
      // Remove from the work portions list
      setWorkPortions(prev => prev.filter(wp => wp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  return { workPortions, loading, error, createWorkPortion, updateWorkPortion, deleteWorkPortion };
}