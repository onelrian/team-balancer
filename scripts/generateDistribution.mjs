#!/usr/bin/env node

// Script to generate workload distribution
import { AssignmentService } from '../src/services/assignmentService.js';

async function generateDistribution() {
  try {
    console.log('Generating workload distribution...');
    
    // Get current cycle date
    const cycleDate = AssignmentService.getCurrentCycleDate();
    console.log(`Current cycle date: ${cycleDate.toISOString()}`);
    
    // Generate and save assignments
    const assignments = await AssignmentService.generateAndSaveAssignments(cycleDate);
    
    console.log(`Generated ${assignments.length} assignments for cycle ${cycleDate.toISOString()}`);
    
    // Log assignment details
    for (const assignment of assignments) {
      console.log(`  Work Portion ${assignment.workPortionId} -> User ${assignment.userId}`);
    }
    
    console.log('Distribution generation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error generating workload distribution:', error);
    process.exit(1);
  }
}

// Run the script
generateDistribution();