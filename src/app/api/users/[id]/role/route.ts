import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// PUT /api/users/[id]/role - Update user role (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { role } = await request.json();
    
    // Validate input
    if (!role || (role !== 'admin' && role !== 'user')) {
      return new Response(
        JSON.stringify({ error: 'role must be either "admin" or "user"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await UserService.updateUserRole(parseInt(params.id), role);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(user),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update user role' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}