import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { WorkService } from '@/services/workService';

// POST /api/workload-preferences - Set workload preference
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { workPortionId, preferenceLevel } = await request.json();
    
    // Validate input
    if (!workPortionId) {
      return new Response(
        JSON.stringify({ error: 'Work portion ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!preferenceLevel || preferenceLevel < 1 || preferenceLevel > 5) {
      return new Response(
        JSON.stringify({ error: 'Preference level must be between 1 and 5' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = token.id as number;
    const preference = await WorkService.setWorkloadPreference(
      userId,
      workPortionId,
      preferenceLevel
    );
    
    return new Response(
      JSON.stringify(preference),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error setting workload preference:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to set workload preference' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET /api/workload-preferences - Get user's workload preferences
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = token.id as number;
    const preferences = await WorkService.getWorkloadPreferencesForUser(userId);
    
    return new Response(
      JSON.stringify(preferences),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching workload preferences:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch workload preferences' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}