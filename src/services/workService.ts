import { query } from '@/lib/db';
import { WorkPortion, WorkAssignment, WorkloadPreference, AssignmentHistory } from '@/types/work';
import { User } from '@/types/user';
import { DiscordService } from './discordService';
import { Logger } from './logger';

export class WorkService {
  // Create a new work portion
  static async createWorkPortion(
    name: string,
    description: string | undefined,
    weight: number,
    createdBy: number
  ): Promise<WorkPortion> {
    Logger.info('Creating new work portion', { name, weight, createdBy });
    
    const result = await query(
      `INSERT INTO work_portions (name, description, weight, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, weight, created_by, created_at, updated_at`,
      [name, description, weight, createdBy]
    );
    
    const row = result.rows[0];
    
    Logger.info('Work portion created successfully', {
      id: row.id,
      name: row.name,
      weight: row.weight
    });
    
    // Send Discord notification
    const creator = await this.getUserById(createdBy);
    if (creator) {
      await DiscordService.sendNewWorkPortionNotification(name, creator.username);
    }
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      weight: row.weight,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Get all work portions
  static async getAllWorkPortions(): Promise<WorkPortion[]> {
    const result = await query(
      `SELECT id, name, description, weight, created_by, created_at, updated_at 
       FROM work_portions 
       ORDER BY created_at DESC`
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      weight: row.weight,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // Get work portion by ID
  static async getWorkPortionById(id: number): Promise<WorkPortion | null> {
    const result = await query(
      `SELECT id, name, description, weight, created_by, created_at, updated_at 
       FROM work_portions 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      weight: row.weight,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Update work portion
  static async updateWorkPortion(
    id: number,
    name: string,
    description: string | undefined,
    weight: number
  ): Promise<WorkPortion | null> {
    const result = await query(
      `UPDATE work_portions 
       SET name = $1, description = $2, weight = $3, updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, name, description, weight, created_by, created_at, updated_at`,
      [name, description, weight, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      weight: row.weight,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Delete work portion
  static async deleteWorkPortion(id: number): Promise<boolean> {
    const result = await query('DELETE FROM work_portions WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  // Set workload preference for a user
  static async setWorkloadPreference(
    userId: number,
    workPortionId: number,
    preferenceLevel: number
  ): Promise<WorkloadPreference> {
    const result = await query(
      `INSERT INTO workload_preferences (user_id, work_portion_id, preference_level) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, work_portion_id) 
       DO UPDATE SET preference_level = $3, updated_at = NOW() 
       RETURNING id, user_id, work_portion_id, preference_level, created_at, updated_at`,
      [userId, workPortionId, preferenceLevel]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      workPortionId: row.work_portion_id,
      preferenceLevel: row.preference_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Get workload preferences for a user
  static async getWorkloadPreferencesForUser(userId: number): Promise<WorkloadPreference[]> {
    const result = await query(
      `SELECT id, user_id, work_portion_id, preference_level, created_at, updated_at 
       FROM workload_preferences 
       WHERE user_id = $1 
       ORDER BY preference_level DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      workPortionId: row.work_portion_id,
      preferenceLevel: row.preference_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // Get current assignments for a cycle
  static async getCurrentAssignments(cycleDate: Date): Promise<WorkAssignment[]> {
    const result = await query(
      `SELECT id, work_portion_id, user_id, assigned_at, assignment_cycle 
       FROM work_assignments 
       WHERE assignment_cycle = $1 
       ORDER BY work_portion_id`,
      [cycleDate]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      workPortionId: row.work_portion_id,
      userId: row.user_id,
      assignedAt: row.assigned_at,
      assignmentCycle: row.assignment_cycle,
    }));
  }

  // Get assignment history for a user
  static async getAssignmentHistoryForUser(userId: number): Promise<AssignmentHistory[]> {
    const result = await query(
      `SELECT id, user_id, work_portion_id, assigned_date, completed_date, created_at 
       FROM assignment_history 
       WHERE user_id = $1 
       ORDER BY assigned_date DESC`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      workPortionId: row.work_portion_id,
      assignedDate: row.assigned_date,
      completedDate: row.completed_date,
      createdAt: row.created_at,
    }));
  }

  // Get assignment history for a work portion
  static async getAssignmentHistoryForWorkPortion(workPortionId: number): Promise<AssignmentHistory[]> {
    const result = await query(
      `SELECT id, user_id, work_portion_id, assigned_date, completed_date, created_at 
       FROM assignment_history 
       WHERE work_portion_id = $1 
       ORDER BY assigned_date DESC`,
      [workPortionId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      workPortionId: row.work_portion_id,
      assignedDate: row.assigned_date,
      completedDate: row.completed_date,
      createdAt: row.created_at,
    }));
  }

  // Set access restrictions for a work portion
  static async setWorkPortionAccess(
    workPortionId: number,
    userClassId: number
  ): Promise<void> {
    await query(
      `INSERT INTO work_portion_access (work_portion_id, user_class_id) 
       VALUES ($1, $2) 
       ON CONFLICT (work_portion_id, user_class_id) 
       DO NOTHING`,
      [workPortionId, userClassId]
    );
  }

  // Remove access restrictions for a work portion
  static async removeWorkPortionAccess(
    workPortionId: number,
    userClassId: number
  ): Promise<void> {
    await query(
      `DELETE FROM work_portion_access 
       WHERE work_portion_id = $1 AND user_class_id = $2`,
      [workPortionId, userClassId]
    );
  }

  // Get user by ID
  static async getUserById(id: number): Promise<User | null> {
    const result = await query(
      `SELECT id, discord_id, username, avatar, role, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      discordId: row.discord_id,
      username: row.username,
      avatar: row.avatar,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Check if a user has access to a work portion
  static async userHasAccessToWorkPortion(
    userId: number,
    workPortionId: number
  ): Promise<boolean> {
    // Admins have access to all work portions
    const userResult = await query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length > 0 && userResult.rows[0].role === 'admin') {
      return true;
    }
    
    // Check if the work portion has access restrictions
    const accessResult = await query(
      `SELECT COUNT(*) as count
       FROM work_portion_access wpa
       JOIN user_class_assignments uca ON wpa.user_class_id = uca.user_class_id
       WHERE wpa.work_portion_id = $1 AND uca.user_id = $2`,
      [workPortionId, userId]
    );
    
    return parseInt(accessResult.rows[0].count) > 0;
  }
}