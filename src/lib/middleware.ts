import { NextRequest, NextFetchEvent } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function withRoleProtection(
  request: NextRequest,
  event: NextFetchEvent,
  requiredRole: 'admin' | 'user'
) {
  const token = await getToken({ req: request });
  
  // If no token, redirect to sign in
  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return Response.redirect(url);
  }
  
  // Check if user has the required role
  if (requiredRole === 'admin' && token.role !== 'admin') {
    // Redirect to home page or unauthorized page
    const url = new URL('/', request.url);
    return Response.redirect(url);
  }
  
  // User is authorized
  return null;
}

// Helper function to check if user is admin
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = await getToken({ req: request });
  return token?.role === 'admin' || false;
}

// Helper function to check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = await getToken({ req: request });
  return !!token;
}