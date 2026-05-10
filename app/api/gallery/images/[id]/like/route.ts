// app/api/gallery/images/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/gallery.types';

let galleryImages: any[] = []; // Import from main route

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const imageIndex = galleryImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    galleryImages[imageIndex].likes += 1;
    galleryImages[imageIndex].updatedAt = new Date();
    
    return NextResponse.json({
      success: true,
      data: { likes: galleryImages[imageIndex].likes },
      message: 'Liked successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update likes'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const imageIndex = galleryImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    if (galleryImages[imageIndex].likes > 0) {
      galleryImages[imageIndex].likes -= 1;
    }
    
    return NextResponse.json({
      success: true,
      data: { likes: galleryImages[imageIndex].likes },
      message: 'Unliked successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update likes'
    }, { status: 500 });
  }
}