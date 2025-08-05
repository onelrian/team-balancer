import { useState, useEffect } from 'react';
import { WorkAssignment } from '@/types/work';
import { User } from '@/types/user';
import { WorkPortion } from '@/types/work';

interface AssignmentData {
  cycleDate: string;
  nextCycleDate: string;
  assignments: WorkAssignment[];
}

interface ExtendedAssignment extends WorkAssignment {
  user?: User;
  workPortion?: WorkPortion;
}

export function useAssignments() {
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/assignments/current');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        
        const data: AssignmentData = await response.json();
        setAssignmentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
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