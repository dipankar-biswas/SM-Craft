// app/api/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/model/category-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getSlug } from "@/lib/convertData";
import { 
  createCategoryQuery, 
  updateCategoryQuery, 
  deleteCategoryQuery, 
  toggleCategoryStatusQuery,
  getCategoryDetails,
  getCategories
} from "@/queries/categories";
import fs from "fs";
import path from "path";

// Types
interface CategoryData {
  name: string;
  nameBn: string;
  icon?: string;
  image?: string;
  slug: string;
  active?: boolean;
}

// Helper function to save image
async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const filename = `category-${timestamp}-${randomString}.jpg`;
  
  const uploadDir = path.join(process.cwd(), "public/assets/uploads/categories/");
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/assets/uploads/categories/${filename}`;
}

// ==================== GET: Fetch category(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    
    if (id) {
      // Get single category by ID using query
      const category = await getCategoryDetails(id);
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: category,
      });
    } else {
      // Get all categories with optional active filter
      let query = {};
      if (active === 'true') {
        query = { active: true };
      }
      const categories = await getCategories();
      return NextResponse.json({
        success: true,
        data: categories,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new category ====================
export async function POST(request: NextRequest) {
  try {
    let name, nameBn, icon, image;
    
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle image upload
      const formData = await request.formData();
      name = formData.get("name") as string;
      nameBn = formData.get("nameBn") as string;
      const imageFile = formData.get("image") as File;
      
      // Validation
      if (!name || name.trim() === "") {
        return NextResponse.json(
          { error: "Category name (English) is required" },
          { status: 400 }
        );
      }

      if (!nameBn || nameBn.trim() === "") {
        return NextResponse.json(
          { error: "Category name (Bangla) is required" },
          { status: 400 }
        );
      }

      if (!imageFile) {
        return NextResponse.json(
          { error: "Category image is required" },
          { status: 400 }
        );
      }

      // Save image
      const imageUrl = await saveImage(imageFile);
      icon = imageUrl;
      image = imageUrl;
      
    } else {
      // Handle icon upload
      const body = await request.json();
      name = body.name;
      nameBn = body.nameBn;
      icon = body.icon;
      image = body.icon;

      // Validation
      if (!name || name.trim() === "") {
        return NextResponse.json(
          { error: "Category name (English) is required" },
          { status: 400 }
        );
      }

      if (!nameBn || nameBn.trim() === "") {
        return NextResponse.json(
          { error: "Category name (Bangla) is required" },
          { status: 400 }
        );
      }

      if (!icon || icon.trim() === "") {
        return NextResponse.json(
          { error: "Category icon is required" },
          { status: 400 }
        );
      }
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
        { nameBn: { $regex: new RegExp(`^${nameBn.trim()}$`, 'i') } }
      ]
    }).lean();

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }

    // Prepare category data
    const slug = getSlug(name.trim());
    
    // Check if slug already exists
    const existingSlug = await Category.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json(
        { error: "Category with similar name already exists" },
        { status: 409 }
      );
    }

    const categoryData: CategoryData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      icon: icon,
      image: image,
      slug: slug,
      active: true,
    };

    // Create new category using query
    const newCategory = await createCategoryQuery(categoryData);
    console.log("✅ Category Created:", newCategory);

    return NextResponse.json({
      success: true,
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/category:", error);
    // Check for duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing category ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, nameBn, icon, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await getCategoryDetails(id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (name && name.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    
    if (nameBn && nameBn.trim()) {
      updateData.nameBn = nameBn.trim();
    }
    
    if (icon && icon.trim()) {
      updateData.icon = icon.trim();
      updateData.image = icon.trim();
    }
    
    if (image && image.trim()) {
      updateData.image = image.trim();
      updateData.icon = image.trim();
    }
    
    updateData.updated_at = new Date();

    // Update category using query
    const updatedCategory = await updateCategoryQuery(id, updateData);

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Category Updated:", updatedCategory);

    return NextResponse.json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/category:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a category by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Get category details to delete associated image
    const category = await getCategoryDetails(id);
    
    // Delete associated image if exists and is not an icon
    if (category?.image && !category.image.startsWith('http') && !category.image.startsWith('ShoppingBag')) {
      const imagePath = path.join(process.cwd(), "public", category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Deleted category image:", category.image);
      }
    }

    // Delete category using query
    const deleted = await deleteCategoryQuery(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("✅ Category deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update category status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Toggle category status using query
    const updatedCategory = await toggleCategoryStatusQuery(id, active !== undefined ? active : false);

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Category status updated for:", id, "New status:", updatedCategory.active);

    return NextResponse.json({
      success: true,
      message: "Category status updated successfully",
      active: updatedCategory.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/category:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category status" },
      { status: 500 }
    );
  }
}