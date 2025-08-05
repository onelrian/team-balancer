import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { WorkService } from '@/services/workService';

// GET /api/work-portions/[id] - Get a specific work portion
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workPortionId = parseInt(params.id);
    
    if (isNaN(workPortionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid work portion ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const workPortion = await WorkService.getWorkPortionById(workPortionId);
    
    if (!workPortion) {
      return new Response(
        JSON.stringify({ error: 'Work portion not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(workPortion),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching work portion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch work portion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/work-portions/[id] - Update a work portion (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const workPortionId = parseInt(params.id);
    
    if (isNaN(workPortionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid work portion ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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

    const updatedWorkPortion = await WorkService.updateWorkPortion(
      workPortionId,
      name,
      description,
      weight
    );
    
    if (!updatedWorkPortion) {
      return new Response(
        JSON.stringify({ error: 'Work portion not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedWorkPortion),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating work portion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update work portion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/work-portions/[id] - Delete a work portion (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const workPortionId = parseInt(params.id);
    
    if (isNaN(workPortionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid work portion ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deleted = await WorkService.deleteWorkPortion(workPortionId);
    
    if (!deleted) {
      return new Response(
        JSON.stringify({ error: 'Work portion not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Work portion deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting work portion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete work portion' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}