import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '../../../lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const maxMb = Number(process.env.MAX_UPLOAD_SIZE_MB || '10');
  if (file.size > maxMb * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'faculty-appraisals' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });

  return NextResponse.json(upload);
}
