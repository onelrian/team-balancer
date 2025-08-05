import Groq from 'groq-sdk';
import { WorkPortion } from '@/types/work';
import { User } from '@/types/user';
import { WorkService } from './workService';
import { UserService } from './userService';
import { Logger } from './logger';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export class GroqService {
  // Generate workload distribution using Groq AI
  static async generateWorkloadDistribution(
    workPortions: WorkPortion[],
    users: User[],
    preferences: Map<number, Map<number, number>> // userId -> workPortionId -> preference
  ): Promise<Map<number, number>> { // workPortionId -> userId
    try {
      Logger.info('Generating workload distribution with Groq AI', {
        workPortionCount: workPortions.length,
        userCount: users.length
      });
      
      // Prepare data for the AI model
      const inputData = {
        workPortions: workPortions.map(wp => ({
          id: wp.id,
          name: wp.name,
          description: wp.description,
          weight: wp.weight,
        })),
        users: users.map(u => ({
          id: u.id,
          username: u.username,
          role: u.role,
        })),
        preferences: Array.from(preferences.entries()).map(([userId, userPrefs]) => ({
          userId,
          preferences: Array.from(userPrefs.entries()).map(([workPortionId, preference]) => ({
            workPortionId,
            preference,
          })),
        })),
      };

      // Create the prompt for the AI model
      const prompt = `
You are an AI assistant tasked with distributing workload among team members fairly and efficiently.

Input data:
${JSON.stringify(inputData, null, 2)}

Instructions:
1. Distribute all work portions among available users
2. Consider the weight of each work portion (1-10 scale)
3. Consider user preferences (1-5 scale, where 5 is most preferred)
4. Ensure fair distribution based on work portion weights
5. Try to assign work portions to users who prefer them
6. Balance the total weight assigned to each user
7. Admin users can handle any work portion
8. Regular users can only handle work portions they have access to

Output format:
Return a JSON object with work portion IDs as keys and user IDs as values.
Example: {"1": 5, "2": 3, "3": 7}

Only return the JSON object, nothing else.
`;

      Logger.debug('Sending request to Groq API');
      
      // Call the Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.3,
        max_tokens: 1000,
      });

      // Parse the response
      const responseText = chatCompletion.choices[0]?.message?.content || '{}';
      Logger.debug('Received response from Groq API', { responseLength: responseText.length });
      
      const assignment = JSON.parse(responseText);
      
      // Convert to Map
      const assignmentMap = new Map<number, number>();
      for (const [workPortionId, userId] of Object.entries(assignment)) {
        assignmentMap.set(parseInt(workPortionId), parseInt(userId as string));
      }
      
      Logger.info('Workload distribution generated successfully', {
        assignmentCount: assignmentMap.size
      });
      
      return assignmentMap;
    } catch (error) {
      Logger.error('Error generating workload distribution with Groq', error as Error);
      throw new Error('Failed to generate workload distribution');
    }
  }

  // Generate workload distribution for the current cycle
  static async generateDistributionForCurrentCycle(): Promise<Map<number, number>> {
    try {
      // Get all work portions
      const workPortions = await WorkService.getAllWorkPortions();
      
      // Get all users
      const users = await UserService.getAllUsers();
      
      // Get all preferences
      const preferences = new Map<number, Map<number, number>>();
      
      for (const user of users) {
        const userPrefs = await WorkService.getWorkloadPreferencesForUser(user.id);
        const userPrefMap = new Map<number, number>();
        
        for (const pref of userPrefs) {
          userPrefMap.set(pref.workPortionId, pref.preferenceLevel);
        }
        
        preferences.set(user.id, userPrefMap);
      }
      
      // Generate distribution
      const distribution = await this.generateWorkloadDistribution(
        workPortions,
        users,
        preferences
      );
      
      return distribution;
    } catch (error) {
      console.error('Error generating distribution for current cycle:', error);
      throw new Error('Failed to generate distribution for current cycle');
    }
  }
}