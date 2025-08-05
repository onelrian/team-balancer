import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// POST /api/user-classes/[id]/assign - Assign user to class (admin only)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const assignment = await UserService.assignUserToClass(
      userId,
      parseInt(params.id),
      token.id as number
    );
    
    return new Response(
      JSON.stringify(assignment),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error assigning user to class:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to assign user to class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/user-classes/[id]/assign - Remove user from class (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await UserService.removeUserFromClass(userId, parseInt(params.id));
    
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