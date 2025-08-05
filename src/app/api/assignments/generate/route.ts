import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AssignmentService } from '@/services/assignmentService';
import { Logger } from '@/services/logger';
import { DiscordService } from '@/services/discordService';

// POST /api/assignments/generate - Generate assignments for current cycle (admin only)
export async function POST(request: NextRequest) {
  try {
    Logger.info('Generating assignments via API');
    
    // Check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      Logger.warn('Unauthorized access attempt to generate assignments', {
        userId: token?.id
      });
      
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get current cycle date
    const cycleDate = AssignmentService.getCurrentCycleDate();
    Logger.info('Generating assignments for cycle', { cycleDate });
    
    // Generate and save assignments
    const assignments = await AssignmentService.generateAndSaveAssignments(cycleDate);
    
    Logger.info('Assignments generated successfully', {
      assignmentCount: assignments.length
    });
    
    return new Response(
      JSON.stringify({
        message: 'Assignments generated successfully',
        cycleDate,
        assignments,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    Logger.error('Error generating assignments via API', error as Error);
    DiscordService.sendErrorNotification((error as Error).message);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate assignments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}