import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slideId = formData.get('slideId');
    const mediaType = formData.get('mediaType');
    const moduleId = formData.get('moduleId');

    if (!file || !slideId || !mediaType || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create uploads directory structure
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'modules', moduleId, 'slides', slideId);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${mediaType}-${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Return the public path
    const publicPath = `/uploads/modules/${moduleId}/slides/${slideId}/${fileName}`;

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      message: `${mediaType} uploaded successfully`
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}



