// app/api/gallery/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No image file provided'
      }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WEBP are allowed'
      }, { status: 400 });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB'
      }, { status: 400 });
    }
    
    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'gallery');
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // Return image URL
    const imageUrl = `/uploads/gallery/${filename}`;
    
    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        filename,
        size: file.size,
        type: file.type
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image'
    }, { status: 500 });
  }
}