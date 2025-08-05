import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// POST /api/user-classes/[id]/assign - Assign user to class (admin only)
export async function POST(
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

    const { userId } = await request.json();
    
    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userClassId = parseInt(params.id);
    const userIdNum = parseInt(userId);
    
    if (isNaN(userClassId) || isNaN(userIdNum)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ID format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Assign user to class
    const assignment = await UserService.assignUserToClass(
      userIdNum, 
      userClassId, 
      token.id as number
    );
    
    return new Response(
      JSON.stringify(assignment),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error assigning user to class:', error);
    
    // Check for unique constraint violation
    if (error.code === '23505') {
      return new Response(
        JSON.stringify({ error: 'User is already assigned to this class' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Failed to assign user to class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/user-classes/[id]/assign - Remove user from class (admin only)
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

    const { userId } = await request.json();
    
    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userClassId = parseInt(params.id);
    const userIdNum = parseInt(userId);
    
    if (isNaN(userClassId) || isNaN(userIdNum)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ID format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Remove user from class
    await UserService.removeUserFromClass(userIdNum, userClassId);
    
    return new Response(
      JSON.stringify({ message: 'User removed from class successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error removing user from class:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to remove user from class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}