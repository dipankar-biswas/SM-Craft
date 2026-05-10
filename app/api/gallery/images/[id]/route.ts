// app/api/gallery/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, GalleryImage } from '@/types/gallery.types';

let galleryImages: GalleryImage[] = []; // This should be imported from the main route

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change type to Promise
) {
  try {
    const { id: idParam } = await params; // Await the params
    const id = parseInt(idParam);
    const image = galleryImages.find(img => img.id === id);
    
    if (!image) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Image not found'
      };
      return NextResponse.json(response, { status: 404 });
    }
    
    // Increment view count
    image.views = (image.views || 0) + 1;
    
    const response: ApiResponse<GalleryImage> = {
      success: true,
      data: image
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch image'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change type to Promise
) {
  try {
    const { id: idParam } = await params; // Await the params
    const id = parseInt(idParam);
    const body = await request.json();
    const imageIndex = galleryImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    // Update image
    galleryImages[imageIndex] = {
      ...galleryImages[imageIndex],
      ...body,
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: galleryImages[imageIndex],
      message: 'Image updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update image'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Change type to Promise
) {
  try {
    const { id: idParam } = await params; // Await the params
    const id = parseInt(idParam);
    const imageIndex = galleryImages.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Image not found'
      }, { status: 404 });
    }
    
    galleryImages.splice(imageIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete image'
    }, { status: 500 });
  }
}