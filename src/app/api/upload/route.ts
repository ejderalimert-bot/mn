import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const urls: string[] = [];
    
    // Create the uploads directory in the public folder so it's accessible via exactly like /uploads/...
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {}

    for (const file of files) {
      if (file && file.size > 0) {
        // Clean file name
        const ext = file.name.split('.').pop()?.toLowerCase();
        const uniqueName = `file-${Date.now()}-${Math.round(Math.random() * 1e5)}.${ext}`;
        
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(path.join(uploadsDir, uniqueName), buffer);
        
        urls.push(`/uploads/${uniqueName}`);
      }
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
