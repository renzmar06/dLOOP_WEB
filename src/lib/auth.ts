import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookieToken = request.cookies.get('token')?.value;
  return cookieToken || null;
}