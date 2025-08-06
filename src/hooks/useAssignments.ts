import { useState, useEffect } from 'react';
import { WorkAssignment } from '@/types/work';


interface AssignmentData {
  cycleDate: string;
  nextCycleDate: string;
  assignments: WorkAssignment[];
}



export function useAssignments() {
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      console.log('Fetching assignments');
      try {
        setLoading(true);
        const response = await fetch('/api/assignments/current');
        console.log('Assignment API response', response.status, response.ok);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        
        const data: AssignmentData = await response.json();
        console.log('Assignment data received', data);
        setAssignmentData(data);
      } catch (err) {
        console.error('Error fetching assignments', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return { assignmentData, loading, error };
}

export function useUserAssignments(userId: number) {
  const { assignmentData, loading, error } = useAssignments();
  
  if (loading || error || !assignmentData) {
    return { userAssignments: [], loading, error };
  }
  
  const userAssignments = assignmentData.assignments.filter(
    assignment => assignment.userId === userId
  );
  
  return { userAssignments, loading, error };
}