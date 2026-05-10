// types/gallery.types.ts
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  likes: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  uploadedBy?: string;
  views?: number;
  downloads?: number;
  shares?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  size?: number;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageCount: number;
  isActive?: boolean;
  order?: number;
}

export interface GalleryStats {
  totalImages: number;
  totalLikes: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  mostLikedImage: GalleryImage | null;
  mostViewedImage: GalleryImage | null;
  categoriesCount: Record<string, number>;
  topTags: { tag: string; count: number }[];
  engagement: {
    avgLikesPerImage: number;
    avgViewsPerImage: number;
    likeToViewRatio: number;
  };
}

export interface GalleryQueryParams {
  category?: string;
  search?: string;
  sortBy?: 'likes' | 'createdAt' | 'title' | 'views' | 'downloads';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  tags?: string[];
  minLikes?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    processingTime: number;
  };
}

export interface UploadImageRequest {
  title: string;
  alt: string;
  category: string;
  tags: string[];
  imageBase64?: string;
  imageUrl?: string;
}

export interface GalleryComment {
  id: string;
  imageId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  likes: number;
  createdAt: Date;
  isApproved: boolean;
}

export interface BulkOperationRequest {
  operation: 'delete' | 'updateCategory' | 'addTags' | 'removeTags';
  imageIds: number[];
  data?: any;
}