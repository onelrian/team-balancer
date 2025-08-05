import { query } from '@/lib/db';
import { User, UserClass, UserClassAssignment } from '@/types/user';
import { Logger } from './logger';

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const result = await query(
      `SELECT id, discord_id, username, avatar, role, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    
    return result.rows.map(row => ({
      id: row.id,
      discordId: row.discord_id,
      username: row.username,
      avatar: row.avatar,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
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

  // Update user role
  static async updateUserRole(userId: number, role: 'admin' | 'user'): Promise<User | null> {
    Logger.info('Updating user role', { userId, newRole: role });
    
    const result = await query(
      `UPDATE users
       SET role = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, discord_id, username, avatar, role, created_at, updated_at`,
      [role, userId]
    );
    
    if (result.rows.length === 0) {
      Logger.warn('User not found when updating role', { userId });
      return null;
    }
    
    const row = result.rows[0];
    Logger.info('User role updated successfully', {
      userId: row.id,
      newRole: row.role
    });
    
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

  // Get all user classes
  static async getAllUserClasses(): Promise<UserClass[]> {
    const result = await query(
      `SELECT id, name, description, created_at 
       FROM user_classes 
       ORDER BY name`
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
    }));
  }

  // Create a new user class
  static async createUserClass(name: string, description?: string): Promise<UserClass> {
    const result = await query(
      `INSERT INTO user_classes (name, description) 
       VALUES ($1, $2) 
       RETURNING id, name, description, created_at`,
      [name, description]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
    };
  }

  // Assign user to class
  static async assignUserToClass(
    userId: number, 
    userClassId: number, 
    assignedBy: number
  ): Promise<UserClassAssignment> {
    const result = await query(
      `INSERT INTO user_class_assignments (user_id, user_class_id, assigned_by) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, user_class_id, assigned_by, created_at`,
      [userId, userClassId, assignedBy]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      userClassId: row.user_class_id,
      assignedBy: row.assigned_by,
      createdAt: row.created_at,
    };
  }

  // Remove user from class
  static async removeUserFromClass(userId: number, userClassId: number): Promise<void> {
    await query(
      `DELETE FROM user_class_assignments 
       WHERE user_id = $1 AND user_class_id = $2`,
      [userId, userClassId]
    );
  }

  // Get user classes for a specific user
  static async getUserClassesForUser(userId: number): Promise<UserClass[]> {
    const result = await query(
      `SELECT uc.id, uc.name, uc.description, uc.created_at
       FROM user_classes uc
       JOIN user_class_assignments uca ON uc.id = uca.user_class_id
       WHERE uca.user_id = $1
       ORDER BY uc.name`,
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
    }));
  }

  // Get users in a specific class
  static async getUsersInClass(userClassId: number): Promise<User[]> {
    const result = await query(
      `SELECT u.id, u.discord_id, u.username, u.avatar, u.role, u.created_at, u.updated_at
       FROM users u
       JOIN user_class_assignments uca ON u.id = uca.user_id
       WHERE uca.user_class_id = $1
       ORDER BY u.username`,
      [userClassId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      discordId: row.discord_id,
      username: row.username,
      avatar: row.avatar,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}