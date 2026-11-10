import { NextResponse } from 'next/server';

// Passthrough middleware — no admin routes exist in the server-driven architecture.
// All data collection and status checking is handled by Google Apps Script automation.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
