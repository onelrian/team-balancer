import { NextRequest } from 'next/server';
import { isAdmin } from '@/lib/middleware';
import { UserService } from '@/services/userService';

// PUT /api/users/[id]/role - Update user role (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { role } = await request.json();
    
    // Validate role
    if (role !== 'admin' && role !== 'user') {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be "admin" or "user"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid user ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedUser = await UserService.updateUserRole(userId, role);
    
    if (!updatedUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedUser),
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