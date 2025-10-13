import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types
    const allowedTypes = {
      'application/pdf': ['.pdf'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'text/csv': ['.csv']
    };

    const fileType = file.mimetype;
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes[fileType] && allowedTypes[fileType].includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const type = formData.get('type');
    const moduleId = formData.get('moduleId');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Create module directory if it doesn't exist
    const moduleDir = path.join(process.cwd(), 'assets', `module${moduleId}`, type);
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(moduleDir, fileName);

      // Write file to disk
      fs.writeFileSync(filePath, Buffer.from(buffer));

      uploadedFiles.push({
        originalName: file.name,
        fileName: fileName,
        path: filePath,
        size: file.size,
        type: file.type,
        url: `/assets/module${moduleId}/${type}/${fileName}`
      });
    }

    // Update module data if moduleId is not 'new'
    if (moduleId !== 'new') {
      await updateModuleFiles(moduleId, type, uploadedFiles);
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

async function updateModuleFiles(moduleId, type, files) {
  try {
    const moduleDataPath = path.join(process.cwd(), 'data', 'ecg-modules.json');
    
    if (!fs.existsSync(moduleDataPath)) {
      return;
    }

    const moduleData = JSON.parse(fs.readFileSync(moduleDataPath, 'utf8'));
    const moduleIndex = moduleData.findIndex(m => m.id === moduleId);
    
    if (moduleIndex === -1) {
      return;
    }

    // Update module with new files
    if (!moduleData[moduleIndex][type]) {
      moduleData[moduleIndex][type] = [];
    }

    // Add new files to existing ones
    const newFiles = files.map(file => ({
      name: file.originalName,
      url: file.url,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    moduleData[moduleIndex][type] = [...moduleData[moduleIndex][type], ...newFiles];
    
    fs.writeFileSync(moduleDataPath, JSON.stringify(moduleData, null, 2));
  } catch (error) {
    console.error('Error updating module files:', error);
  }
}





