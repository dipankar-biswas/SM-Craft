// app/api/gallery/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GalleryQueryParams, ApiResponse, GalleryImage } from '@/types/gallery.types';
import { validateQueryParams } from '@/lib/validation';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// In-memory database (replace with real database)
let galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    alt: 'Premium Embroidery Panjabi',
    title: 'Premium Embroidery Panjabi',
    category: 'Embroidery',
    likes: 124,
    tags: ['premium', 'embroidery', 'wedding'],
    createdAt: new Date('2024-01-15'),
    views: 1250,
    downloads: 45,
    shares: 23
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Classic White Panjabi',
    title: 'Classic White Panjabi',
    category: 'Classic',
    likes: 89,
    tags: ['classic', 'white', 'cotton'],
    createdAt: new Date('2024-01-20'),
    views: 890,
    downloads: 32,
    shares: 12
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1610192245053-6dab4af2a8c4?w=600&h=600&fit=crop',
    alt: 'Royal Blue Koti',
    title: 'Royal Blue Koti',
    category: 'Koti',
    likes: 156,
    tags: ['royal', 'blue', 'koti'],
    createdAt: new Date('2024-01-25'),
    views: 2100,
    downloads: 78,
    shares: 45
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1621600411688-4be93cd6856c?w=600&h=600&fit=crop',
    alt: 'Three Piece Set',
    title: 'Three Piece Set',
    category: 'Three Piece',
    likes: 203,
    tags: ['three-piece', 'formal', 'set'],
    createdAt: new Date('2024-02-01'),
    views: 3200,
    downloads: 120,
    shares: 67
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Silk Panjabi',
    title: 'Silk Panjabi',
    category: 'Premium',
    likes: 67,
    tags: ['silk', 'premium', 'luxury'],
    createdAt: new Date('2024-02-05'),
    views: 560,
    downloads: 23,
    shares: 8
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    alt: 'Wedding Collection',
    title: 'Wedding Collection Panjabi',
    category: 'Wedding',
    likes: 312,
    tags: ['wedding', 'bridal', 'luxury'],
    createdAt: new Date('2024-02-10'),
    views: 4500,
    downloads: 230,
    shares: 120
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1610192245053-6dab4af2a8c4?w=600&h=600&fit=crop',
    alt: 'Cotton Panjabi',
    title: 'Cotton Panjabi',
    category: 'Casual',
    likes: 45,
    tags: ['cotton', 'casual', 'summer'],
    createdAt: new Date('2024-02-15'),
    views: 340,
    downloads: 15,
    shares: 5
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1621600411688-4be93cd6856c?w=600&h=600&fit=crop',
    alt: 'Designer Koti',
    title: 'Designer Koti Set',
    category: 'Koti',
    likes: 98,
    tags: ['designer', 'koti', 'festival'],
    createdAt: new Date('2024-02-20'),
    views: 980,
    downloads: 42,
    shares: 18
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Eid Special',
    title: 'Eid Special Collection',
    category: 'Eid',
    likes: 267,
    tags: ['eid', 'festival', 'special'],
    createdAt: new Date('2024-02-25'),
    views: 3800,
    downloads: 190,
    shares: 95
  }
];

// GET /api/gallery/images
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const queryParams: GalleryQueryParams = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') as any || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '12'), 50),
      tags: searchParams.get('tags')?.split(',') || undefined,
      minLikes: searchParams.get('minLikes') ? parseInt(searchParams.get('minLikes')!) : undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined
    };

    const validationError = validateQueryParams(queryParams);
    if (validationError) {
      const response: ApiResponse<null> = {
        success: false,
        error: validationError,
        metadata: {
          timestamp: new Date(),
          requestId,
          processingTime: Date.now() - startTime
        }
      };
      return NextResponse.json(response, { status: 400 });
    }

    let filteredImages = [...galleryImages];

    // Apply filters
    if (queryParams.category && queryParams.category !== 'All') {
      filteredImages = filteredImages.filter(img => 
        img.category.toLowerCase() === queryParams.category?.toLowerCase()
      );
    }

    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.title.toLowerCase().includes(searchTerm) ||
        img.alt.toLowerCase().includes(searchTerm) ||
        img.category.toLowerCase().includes(searchTerm) ||
        img.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (queryParams.tags && queryParams.tags.length > 0) {
      filteredImages = filteredImages.filter(img =>
        queryParams.tags!.some(tag => img.tags?.includes(tag))
      );
    }

    if (queryParams.minLikes) {
      filteredImages = filteredImages.filter(img => img.likes >= queryParams.minLikes!);
    }

    if (queryParams.dateFrom) {
      filteredImages = filteredImages.filter(img => 
        img.createdAt && img.createdAt >= queryParams.dateFrom!
      );
    }

    if (queryParams.dateTo) {
      filteredImages = filteredImages.filter(img => 
        img.createdAt && img.createdAt <= queryParams.dateTo!
      );
    }

    // Apply sorting
    if (queryParams.sortBy) {
      filteredImages.sort((a, b) => {
        let aValue: any = a[queryParams.sortBy!];
        let bValue: any = b[queryParams.sortBy!];
        
        if (queryParams.sortBy === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        if (queryParams.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Apply pagination
    const total = filteredImages.length;
    const totalPages = Math.ceil(total / queryParams.limit!);
    const start = (queryParams.page! - 1) * queryParams.limit!;
    const end = start + queryParams.limit!;
    const paginatedImages = filteredImages.slice(start, end);

    const response: ApiResponse<GalleryImage[]> = {
      success: true,
      data: paginatedImages,
      pagination: {
        page: queryParams.page!,
        limit: queryParams.limit!,
        total,
        totalPages,
        hasNext: queryParams.page! < totalPages,
        hasPrev: queryParams.page! > 1
      },
      metadata: {
        timestamp: new Date(),
        requestId,
        processingTime: Date.now() - startTime
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Gallery API Error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      metadata: {
        timestamp: new Date(),
        requestId,
        processingTime: Date.now() - startTime
      }
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/gallery/images - আপডেটেড (ফাইল আপলোড সহ)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    // ফর্ম ডাটা হিসেবে接收 করুন (কারণ ফাইল আপলোড হবে)
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const alt = formData.get('alt') as string;
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'true';
    const file = formData.get('image') as File;
    
    // Validate required fields
    if (!title || !category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: title, category',
        metadata: {
          timestamp: new Date(),
          requestId,
          processingTime: Date.now() - startTime
        }
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!file) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Image file is required',
        metadata: {
          timestamp: new Date(),
          requestId,
          processingTime: Date.now() - startTime
        }
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    // ফাইল সেভ করার জন্য ডিরেক্টরি তৈরি করুন
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // ডিরেক্টরি already exists
    }
    
    // ফাইল সেভ করুন
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);
    
    // URL তৈরি করুন
    const imageUrl = `/uploads/${uniqueFilename}`;
    
    // নতুন ইমেজ অবজেক্ট তৈরি করুন
    const newImage: GalleryImage = {
      id: galleryImages.length + 1,
      src: imageUrl,
      alt: alt || title,
      title: title,
      category: category,
      likes: 0,
      tags: tags,
      description: description,
      isActive: isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      uploadedBy: 'admin',
      views: 0,
      downloads: 0,
      shares: 0
    };
    
    galleryImages.push(newImage);
    
    const response: ApiResponse<GalleryImage> = {
      success: true,
      data: newImage,
      message: 'Image added successfully',
      metadata: {
        timestamp: new Date(),
        requestId,
        processingTime: Date.now() - startTime
      }
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error adding image:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to add image: ' + (error as Error).message,
      metadata: {
        timestamp: new Date(),
        requestId,
        processingTime: Date.now() - startTime
      }
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/gallery/images (Bulk operations)
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    const body = await request.json();
    const { operation, imageIds, data } = body;
    
    if (!operation || !imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid bulk operation request'
      }, { status: 400 });
    }
    
    const updatedImages: GalleryImage[] = [];
    
    for (const imageId of imageIds) {
      const imageIndex = galleryImages.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        switch (operation) {
          case 'delete':
            galleryImages.splice(imageIndex, 1);
            break;
          case 'updateCategory':
            if (data.category) {
              galleryImages[imageIndex].category = data.category;
              updatedImages.push(galleryImages[imageIndex]);
            }
            break;
          case 'addTags':
            if (data.tags) {
              galleryImages[imageIndex].tags = [...(galleryImages[imageIndex].tags || []), ...data.tags];
              updatedImages.push(galleryImages[imageIndex]);
            }
            break;
          case 'removeTags':
            if (data.tags) {
              galleryImages[imageIndex].tags = galleryImages[imageIndex].tags?.filter(
                tag => !data.tags.includes(tag)
              );
              updatedImages.push(galleryImages[imageIndex]);
            }
            break;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: updatedImages,
      message: `Bulk ${operation} operation completed on ${updatedImages.length} images`,
      metadata: {
        timestamp: new Date(),
        requestId,
        processingTime: Date.now() - startTime
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Bulk operation failed'
    }, { status: 500 });
  }
}