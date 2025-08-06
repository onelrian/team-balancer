
import { WorkService } from './workService';
import { GroqService } from './groqService';

import { WorkAssignment } from '@/types/work';
import { DiscordService } from './discordService';
import { Logger } from './logger';

export class AssignmentService {
  // Generate and save assignments for a cycle
  static async generateAndSaveAssignments(cycleDate: Date): Promise<WorkAssignment[]> {
    try {
      Logger.info('Generating workload distribution', { cycleDate });
      
      // Generate distribution using Groq AI
      const distribution = await GroqService.generateDistributionForCurrentCycle();
      
      Logger.info('Distribution generated', {
        cycleDate,
        assignmentCount: distribution.size
      });
      
      // Clear existing assignments for this cycle and save new ones
      const client = await import('@/lib/db').then(db => db.getClient());
      
      try {
        Logger.debug('Starting database transaction for assignments', { cycleDate });
        
        // Clear existing assignments for this cycle
        await client.query(
          'DELETE FROM work_assignments WHERE assignment_cycle = $1',
          [cycleDate]
        );
        
        Logger.debug('Cleared existing assignments', { cycleDate });
        
        // Save new assignments
        const assignments: WorkAssignment[] = [];
        
        for (const [workPortionId, userId] of distribution.entries()) {
          const result = await client.query(
            `INSERT INTO work_assignments (work_portion_id, user_id, assignment_cycle)
             VALUES ($1, $2, $3)
             RETURNING id, work_portion_id, user_id, assigned_at, assignment_cycle`,
            [workPortionId, userId, cycleDate]
          );
          
          const row = result.rows[0];
          assignments.push({
            id: row.id,
            workPortionId: row.work_portion_id,
            userId: row.user_id,
            assignedAt: row.assigned_at,
            assignmentCycle: row.assignment_cycle,
          });
        }
        
        Logger.debug('Saved new assignments', {
          cycleDate,
          assignmentCount: assignments.length
        });
        
        // Copy assignments to history table
        await client.query(
          `INSERT INTO assignment_history (user_id, work_portion_id, assigned_date)
           SELECT user_id, work_portion_id, assignment_cycle
           FROM work_assignments
           WHERE assignment_cycle = $1`,
          [cycleDate]
        );
        
        Logger.debug('Copied assignments to history table', { cycleDate });
        
        // Commit transaction
        await client.query('COMMIT');
        client.release();
        
        Logger.info('Transaction committed successfully', {
          cycleDate,
          assignmentCount: assignments.length
        });
        
        // Send Discord notification
        await DiscordService.sendNewAssignmentsNotification(assignments.length, cycleDate);
        
        return assignments;
      } catch (error) {
        Logger.error('Error in database transaction', error as Error, { cycleDate });
        
        // Rollback transaction
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    } catch (error) {
      Logger.error('Error generating and saving assignments', error as Error);
      DiscordService.sendErrorNotification((error as Error).message);
      throw new Error('Failed to generate and save assignments');
    }
  }

  // Get assignments for a specific cycle
  static async getAssignmentsForCycle(cycleDate: Date): Promise<WorkAssignment[]> {
    return await WorkService.getCurrentAssignments(cycleDate);
  }

  // Get current cycle date (every 14 days starting from epoch)
  static getCurrentCycleDate(): Date {
    const now = new Date();
    const epoch = new Date('2025-01-01'); // Starting point
    const daysSinceEpoch = Math.floor((now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    const cycleNumber = Math.floor(daysSinceEpoch / 14);
    const cycleDate = new Date(epoch);
    cycleDate.setDate(epoch.getDate() + cycleNumber * 14);
    return cycleDate;
  }

  // Get next cycle date
  static getNextCycleDate(): Date {
    const currentCycle = this.getCurrentCycleDate();
    const nextCycle = new Date(currentCycle);
    nextCycle.setDate(currentCycle.getDate() + 14);
    return nextCycle;
  }
}