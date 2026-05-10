// app/api/admin/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { galleryService } from '@/services/galleryService';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    if (action === 'stats') {
      // Get admin statistics
      const stats = await galleryService.getAdminStats();
      return NextResponse.json({ success: true, data: stats });
    }
    
    if (action === 'export') {
      // Export all images data
      const images = await galleryService.getAllImages();
      return NextResponse.json({ success: true, data: images });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { action, data } = body;
    
    if (action === 'bulk-upload') {
      // Handle bulk upload
      const result = await galleryService.bulkUpload(data);
      return NextResponse.json({ success: true, data: result });
    }
    
    if (action === 'reorder') {
      // Reorder images
      const result = await galleryService.reorderImages(data);
      return NextResponse.json({ success: true, data: result });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}