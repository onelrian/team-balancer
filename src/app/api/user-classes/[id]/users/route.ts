import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// GET /api/user-classes/[id]/users - Get users in a specific class (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userClassId = parseInt(params.id);
    
    if (isNaN(userClassId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid user class ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const users = await UserService.getUsersInClass(userClassId);
    
    return new Response(
      JSON.stringify(users),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching users in class:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users in class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}