import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const users = await UserService.getAllUsers();
    
    return new Response(
      JSON.stringify(users),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}