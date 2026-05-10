// app/api/gallery/stats/route.ts
import { NextResponse } from 'next/server';
import { ApiResponse, GalleryStats } from '@/types/gallery.types';

let galleryImages: any[] = []; // Import from main route

export async function GET() {
  try {
    const totalImages = galleryImages.length;
    const totalLikes = galleryImages.reduce((sum, img) => sum + img.likes, 0);
    const totalViews = galleryImages.reduce((sum, img) => sum + (img.views || 0), 0);
    const totalDownloads = galleryImages.reduce((sum, img) => sum + (img.downloads || 0), 0);
    const totalShares = galleryImages.reduce((sum, img) => sum + (img.shares || 0), 0);
    
    const mostLikedImage = [...galleryImages].sort((a, b) => b.likes - a.likes)[0] || null;
    const mostViewedImage = [...galleryImages].sort((a, b) => (b.views || 0) - (a.views || 0))[0] || null;
    
    const categoriesCount: Record<string, number> = {};
    const tagsCount: Record<string, number> = {};
    
    galleryImages.forEach(img => {
      // Count categories
      categoriesCount[img.category] = (categoriesCount[img.category] || 0) + 1;
      
      // Count tags
      img.tags?.forEach((tag: string) => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagsCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const avgLikesPerImage = totalImages > 0 ? totalLikes / totalImages : 0;
    const avgViewsPerImage = totalImages > 0 ? totalViews / totalImages : 0;
    const likeToViewRatio = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;
    
    const stats: GalleryStats = {
      totalImages,
      totalLikes,
      totalViews,
      totalDownloads,
      totalShares,
      mostLikedImage,
      mostViewedImage,
      categoriesCount,
      topTags,
      engagement: {
        avgLikesPerImage,
        avgViewsPerImage,
        likeToViewRatio
      }
    };
    
    const response: ApiResponse<GalleryStats> = {
      success: true,
      data: stats,
      metadata: {
        timestamp: new Date(),
        requestId: 'stats-' + Date.now(),
        processingTime: 0
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch statistics'
    };
    return NextResponse.json(response, { status: 500 });
  }
}