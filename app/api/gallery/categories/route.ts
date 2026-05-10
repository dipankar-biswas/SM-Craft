// app/api/gallery/categories/route.ts
import { NextResponse } from 'next/server';
import { ApiResponse, GalleryCategory } from '@/types/gallery.types';

let galleryImages: any[] = []; // Import from main route

const categories: GalleryCategory[] = [
  {
    id: '1',
    name: 'All',
    slug: 'all',
    description: 'All gallery images',
    icon: 'grid',
    imageCount: 0,
    order: 0,
    isActive: true
  },
  {
    id: '2',
    name: 'Embroidery',
    slug: 'embroidery',
    description: 'Beautiful embroidery work',
    icon: 'needle',
    imageCount: 0,
    order: 1,
    isActive: true
  },
  {
    id: '3',
    name: 'Koti',
    slug: 'koti',
    description: 'Traditional Koti collection',
    icon: 'shirt',
    imageCount: 0,
    order: 2,
    isActive: true
  },
  {
    id: '4',
    name: 'Three Piece',
    slug: 'three-piece',
    description: 'Elegant three piece sets',
    icon: 'package',
    imageCount: 0,
    order: 3,
    isActive: true
  },
  {
    id: '5',
    name: 'Premium',
    slug: 'premium',
    description: 'Premium quality collection',
    icon: 'diamond',
    imageCount: 0,
    order: 4,
    isActive: true
  },
  {
    id: '6',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Wedding special collection',
    icon: 'heart',
    imageCount: 0,
    order: 5,
    isActive: true
  },
  {
    id: '7',
    name: 'Classic',
    slug: 'classic',
    description: 'Classic traditional wear',
    icon: 'clock',
    imageCount: 0,
    order: 6,
    isActive: true
  },
  {
    id: '8',
    name: 'Casual',
    slug: 'casual',
    description: 'Casual everyday wear',
    icon: 'sun',
    imageCount: 0,
    order: 7,
    isActive: true
  },
  {
    id: '9',
    name: 'Eid',
    slug: 'eid',
    description: 'Eid special collection',
    icon: 'moon',
    imageCount: 0,
    order: 8,
    isActive: true
  }
];

export async function GET() {
  try {
    // Update image counts for each category
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      imageCount: cat.name === 'All' 
        ? galleryImages.length 
        : galleryImages.filter(img => img.category === cat.name).length
    }));
    
    const response: ApiResponse<GalleryCategory[]> = {
      success: true,
      data: categoriesWithCount,
      metadata: {
        timestamp: new Date(),
        requestId: 'categories-' + Date.now(),
        processingTime: 0
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newCategory: GalleryCategory = {
      id: (categories.length + 1).toString(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      icon: body.icon,
      imageCount: 0,
      order: categories.length,
      isActive: true
    };
    
    categories.push(newCategory);
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const categoryIndex = categories.findIndex(cat => cat.id === params.id);
    
    if (categoryIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    // Update category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...body,
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: categories[categoryIndex],
      message: 'Category updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update category'
    }, { status: 500 });
  }
}

// DELETE /api/gallery/categories/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryIndex = categories.findIndex(cat => cat.id === params.id);
    
    if (categoryIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    // Check if category has images
    const category = categories[categoryIndex];
    if (category.imageCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete category with ${category.imageCount} images. Reassign images first.`
      }, { status: 400 });
    }
    
    categories.splice(categoryIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category'
    }, { status: 500 });
  }
}

// POST /api/gallery/categories/bulk
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { action, categoryIds, data } = body;
    
//     if (action === 'delete') {
//       const deletedCount = categoryIds.filter((id: string) => {
//         const index = categories.findIndex(cat => cat.id === id);
//         if (index !== -1 && categories[index].imageCount === 0) {
//           categories.splice(index, 1);
//           return true;
//         }
//         return false;
//       }).length;
      
//       return NextResponse.json({
//         success: true,
//         data: { deletedCount },
//         message: `${deletedCount} categories deleted`
//       });
//     }
    
//     if (action === 'updateStatus') {
//       categoryIds.forEach((id: string) => {
//         const index = categories.findIndex(cat => cat.id === id);
//         if (index !== -1) {
//           categories[index].isActive = data.isActive;
//           categories[index].updatedAt = new Date();
//         }
//       });
      
//       return NextResponse.json({
//         success: true,
//         message: `${categoryIds.length} categories updated`
//       });
//     }
    
//     return NextResponse.json({
//       success: false,
//       error: 'Invalid action'
//     }, { status: 400 });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: 'Bulk operation failed'
//     }, { status: 500 });
//   }
// }