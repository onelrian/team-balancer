
import { AssignmentService } from '@/services/assignmentService';

// GET /api/assignments/current - Get current assignments
export async function GET() {
  try {
    // Get current cycle date
    const cycleDate = AssignmentService.getCurrentCycleDate();
    
    // Get assignments for current cycle
    const assignments = await AssignmentService.getAssignmentsForCycle(cycleDate);
    
    return new Response(
      JSON.stringify({
        cycleDate,
        nextCycleDate: AssignmentService.getNextCycleDate(),
        assignments,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching current assignments:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch current assignments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}