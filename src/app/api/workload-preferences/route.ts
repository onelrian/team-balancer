import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { WorkService } from '@/services/workService';

// GET /api/workload-preferences - Get user's workload preferences
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const preferences = await WorkService.getWorkloadPreferencesForUser(token.id as number);
    
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

// POST /api/workload-preferences - Set a workload preference
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { workPortionId, preferenceLevel } = await request.json();
    
    // Validate input
    if (!workPortionId || !preferenceLevel) {
      return new Response(
        JSON.stringify({ error: 'workPortionId and preferenceLevel are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (preferenceLevel < 1 || preferenceLevel > 5) {
      return new Response(
        JSON.stringify({ error: 'preferenceLevel must be between 1 and 5' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const preference = await WorkService.setWorkloadPreference(
      token.id as number,
      workPortionId,
      preferenceLevel
    );
    
    return new Response(
      JSON.stringify(preference),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error setting workload preference:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to set workload preference' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}