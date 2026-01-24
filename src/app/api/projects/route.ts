import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = [{ id: '1', name: 'Summer Mix 2024', bpm: 128, createdAt: Date.now() }];
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const project = { id: Date.now().toString(), ...body, userId, createdAt: Date.now() };
  return NextResponse.json({ id: project.id });
}
