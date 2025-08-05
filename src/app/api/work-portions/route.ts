import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { WorkService } from '@/services/workService';

// GET /api/work-portions - Get all work portions
export async function GET(request: NextRequest) {
  try {
    const workPortions = await WorkService.getAllWorkPortions();
    
    return new Response(
      JSON.stringify(workPortions),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching work portions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch work portions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/work-portions - Create a new work portion (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, description, weight } = await request.json();
    
    // Validate input
    if (!name || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!weight || weight < 1 || weight > 10) {
      return new Response(
        JSON.stringify({ error: 'Weight must be between 1 and 10' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newWorkPortion = await WorkService.createWorkPortion(
      name, 
      description, 
      weight, 
      token.id as number
    );
    
    return new Response(
      JSON.stringify(newWorkPortion),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating work portion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create work portion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}