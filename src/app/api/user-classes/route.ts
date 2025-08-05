import { NextRequest } from 'next/server';
import { isAdmin } from '@/lib/middleware';
import { UserService } from '@/services/userService';

// GET /api/user-classes - Get all user classes
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
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
    // Check if user is admin
    const adminCheck = await isAdmin(request);
    if (!adminCheck) {
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

    const newUserClass = await UserService.createUserClass(name, description);
    
    return new Response(
      JSON.stringify(newUserClass),
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