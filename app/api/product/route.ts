// app/api/product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/model/product-model";
import { Category } from "@/model/category-model";
import { Brand } from "@/model/brand-model";
import { Size } from "@/model/size-model";
import { Color } from "@/model/color-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getSlug } from "@/lib/convertData";
import { 
  createProductQuery, 
  updateProductQuery, 
  deleteProductQuery, 
  toggleProductStatusQuery,
  getProductDetails,
  getProducts
} from "@/queries/products";
import fs from "fs";
import path from "path";

// Types
interface ProductData {
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  descriptionBn: string;
  image?: string;
  multiImages?: string[];
  video?: string;
  slug: string;
  active?: boolean;
}

// Helper function to save image
async function saveImage(file: File, folder: string, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const filename = `${prefix}-${timestamp}-${randomString}.jpg`;
  
  const uploadDir = path.join(process.cwd(), `public/assets/uploads/${folder}/`);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/assets/uploads/${folder}/${filename}`;
}

// Helper function to save multiple images
async function saveMultipleImages(files: File[], folder: string, prefix: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await saveImage(files[i], folder, `${prefix}-${i}`);
    urls.push(url);
  }
  return urls;
}

// Helper function to delete image
async function deleteImage(imageUrl: string): Promise<void> {
  if (imageUrl && !imageUrl.startsWith('http')) {
    const imagePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("🗑️ Deleted image:", imageUrl);
    }
  }
}

// ==================== GET: Fetch product(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    if (id) {
      // Get single product by ID using query
      const product = await getProductDetails(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: product,
      });
    } else {
      // Get all products with optional filters
      let filter: any = {};
      if (active === 'true') filter.active = true;
      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      
      const products = await getProducts(filter);
      return NextResponse.json({
        success: true,
        data: products,
        count: products.length,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new product ====================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const sizes = JSON.parse(formData.get("sizes") as string || "[]");
    const colors = JSON.parse(formData.get("colors") as string || "[]");
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const imageFile = formData.get("image") as File;
    const multiImageFiles = formData.getAll("multiImages") as File[];
    const videoFile = formData.get("video") as File;

    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Product name (English) is required" },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!brand) {
      return NextResponse.json(
        { error: "Brand is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await Category.findOne({ name: category }).lean();
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Selected category does not exist" },
        { status: 400 }
      );
    }

    // Check if brand exists
    const brandExists = await Brand.findOne({ name: brand }).lean();
    if (!brandExists) {
      return NextResponse.json(
        { error: "Selected brand does not exist" },
        { status: 400 }
      );
    }

    // Check if sizes exist
    if (sizes.length > 0) {
      const sizeExists = await Size.find({ name: { $in: sizes } }).lean();
      if (sizeExists.length !== sizes.length) {
        return NextResponse.json(
          { error: "One or more selected sizes do not exist" },
          { status: 400 }
        );
      }
    }

    // Check if colors exist
    if (colors.length > 0) {
      const colorExists = await Color.find({ hex: { $in: colors } }).lean();
      if (colorExists.length !== colors.length) {
        return NextResponse.json(
          { error: "One or more selected colors do not exist" },
          { status: 400 }
        );
      }
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    }).lean();

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 409 }
      );
    }

    // Prepare slug
    const slug = getSlug(name.trim());
    
    // Check if slug already exists
    const existingSlug = await Product.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json(
        { error: "Product with similar name already exists" },
        { status: 409 }
      );
    }

    // Save images
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await saveImage(imageFile, "products", "product-main");
    }

    let multiImageUrls: string[] = [];
    if (multiImageFiles.length > 0) {
      multiImageUrls = await saveMultipleImages(multiImageFiles, "products", "product-gallery");
    }

    let videoUrl = "";
    if (videoFile) {
      videoUrl = await saveImage(videoFile, "products/videos", "product-video");
    }

    const productData: ProductData = {
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      price: price,
      stock: stock || 0,
      category: category,
      brand: brand,
      sizes: sizes,
      colors: colors,
      description: description || "",
      descriptionBn: descriptionBn || description || "",
      image: imageUrl,
      multiImages: multiImageUrls,
      video: videoUrl,
      slug: slug,
      active: true,
    };

    // Create new product using query
    const newProduct = await createProductQuery(productData);
    console.log("✅ Product Created:", newProduct);

    return NextResponse.json({
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/product:", error);
    // Check for duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing product ====================
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const stock = formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const sizes = formData.get("sizes") ? JSON.parse(formData.get("sizes") as string) : undefined;
    const colors = formData.get("colors") ? JSON.parse(formData.get("colors") as string) : undefined;
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const imageFile = formData.get("image") as File;
    const videoFile = formData.get("video") as File;
    const removeImages = formData.get("removeImages") ? JSON.parse(formData.get("removeImages") as string) : [];

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await getProductDetails(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (name && name.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    
    if (nameBn && nameBn.trim()) updateData.nameBn = nameBn.trim();
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (category) updateData.category = category;
    if (brand) updateData.brand = brand;
    if (sizes) updateData.sizes = sizes;
    if (colors) updateData.colors = colors;
    if (description !== undefined) updateData.description = description;
    if (descriptionBn !== undefined) updateData.descriptionBn = descriptionBn;
    
    // Handle image update
    if (imageFile) {
      // Delete old image
      if (existingProduct.image) {
        await deleteImage(existingProduct.image);
      }
      updateData.image = await saveImage(imageFile, "products", "product-main");
    }
    
    // Handle video update
    if (videoFile) {
      if (existingProduct.video) {
        await deleteImage(existingProduct.video);
      }
      updateData.video = await saveImage(videoFile, "products/videos", "product-video");
    }
    
    // Handle removal of gallery images
    if (removeImages.length > 0) {
      const currentImages = existingProduct.multiImages || [];
      const remainingImages = currentImages.filter(img => !removeImages.includes(img));
      
      // Delete removed images
      for (const img of removeImages) {
        await deleteImage(img);
      }
      
      updateData.multiImages = remainingImages;
    }
    
    updateData.updated_at = new Date();

    // Update product using query
    const updatedProduct = await updateProductQuery(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Product Updated:", updatedProduct);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/product:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a product by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get product details to delete associated images
    const product = await getProductDetails(id);
    
    if (product) {
      // Delete main image
      if (product.image) {
        await deleteImage(product.image);
      }
      
      // Delete gallery images
      if (product.multiImages && product.multiImages.length > 0) {
        for (const img of product.multiImages) {
          await deleteImage(img);
        }
      }
      
      // Delete video
      if (product.video) {
        await deleteImage(product.video);
      }
    }

    // Delete product using query
    const deleted = await deleteProductQuery(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update product status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Toggle product status using query
    const updatedProduct = await toggleProductStatusQuery(id, active !== undefined ? active : false);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Product status updated for:", id, "New status:", updatedProduct.active);

    return NextResponse.json({
      success: true,
      message: "Product status updated successfully",
      active: updatedProduct.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product status" },
      { status: 500 }
    );
  }
}