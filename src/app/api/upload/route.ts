import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // Mock upload - replace with S3/R2
  const url = `https://cdn.algorhythm.app/${userId}/${Date.now()}-${file.name}`;
  
  return NextResponse.json({ url });
}
