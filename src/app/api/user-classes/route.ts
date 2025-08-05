import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserService } from '@/services/userService';

// GET /api/user-classes - Get all user classes
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userClasses = await UserService.getAllUserClasses();
    
    return new Response(
      JSON.stringify(userClasses),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching user classes:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user classes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/user-classes - Create a new user class (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, description } = await request.json();
    
    // Validate input
    if (!name || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userClass = await UserService.createUserClass(name, description);
    
    return new Response(
      JSON.stringify(userClass),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating user class:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create user class' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
