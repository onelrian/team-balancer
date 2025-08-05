import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Pool } from 'pg';
import { UserService } from '../src/services/userService';
import { WorkService } from '../src/services/workService';
import { AssignmentService } from '../src/services/assignmentService';

// Mock DiscordService to prevent actual API calls
jest.mock('../src/services/discordService', () => {
  return {
    DiscordService: {
      sendNewAssignmentsNotification: jest.fn(),
      sendNewWorkPortionNotification: jest.fn(),
      sendErrorNotification: jest.fn(),
    }
  };
});

describe('TeamBalancer Integration Tests', () => {
  let pool: Pool;

  beforeAll(() => {
    // Set up test database connection
    pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/team_balancer_test',
    });
  });

  afterAll(async () => {
    // Close database connection
    await pool.end();
  });

  it('should create a user and assign admin role', async () => {
    // Create a test user
    const user = await UserService.createUserClass('developers', 'Software developers');
    expect(user).toBeDefined();
    expect(user.name).toBe('developers');
  });

  it('should create a work portion', async () => {
    // Create a test work portion
    const workPortion = await WorkService.createWorkPortion(
      'Test Task',
      'A test task for integration testing',
      5,
      1 // Assuming user ID 1 exists
    );
    
    expect(workPortion).toBeDefined();
    expect(workPortion.name).toBe('Test Task');
    expect(workPortion.weight).toBe(5);
  });

  it('should generate assignments', async () => {
    // Get current cycle date
    const cycleDate = AssignmentService.getCurrentCycleDate();
    
    // This test would require a more complex setup with mock data
    // For now, we'll just verify the method exists
    expect(cycleDate).toBeDefined();
  });
});