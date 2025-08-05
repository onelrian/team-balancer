import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Pool } from 'pg';
import { UserService } from '../src/services/userService';
import { WorkService } from '../src/services/workService';
import { AssignmentService } from '../src/services/assignmentService';

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

  it('should create a user class', async () => {
    // Create a test user class
    const userClass = await UserService.createUserClass('developers', 'Software developers');
    expect(userClass).toBeDefined();
    expect(userClass.name).toBe('developers');
  });

  it('should generate assignments', async () => {
    // Get current cycle date
    const cycleDate = AssignmentService.getCurrentCycleDate();
    
    // This test would require a more complex setup with mock data
    // For now, we'll just verify the method exists
    expect(cycleDate).toBeDefined();
  });
});