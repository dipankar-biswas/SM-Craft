import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/model/product-model";
import { Category } from "@/model/category-model";
import { Brand } from "@/model/brand-model";
import { Size } from "@/model/size-model";
import { Color } from "@/model/color-model";
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
import mongoose from "mongoose";

// Helper functions for file handling (same as before)
async function saveImage(file: File, folder: string, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const filename = `${prefix}-${timestamp}-${randomString}.jpg`;
  
  const uploadDir = path.join(process.cwd(), `public/assets/uploads/${folder}/`);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  
  return `/assets/uploads/${folder}/${filename}`;
}

async function saveMultipleImages(files: File[], folder: string, prefix: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await saveImage(files[i], folder, `${prefix}-${i}`);
    urls.push(url);
  }
  return urls;
}

async function deleteImage(imageUrl: string): Promise<void> {
  if (imageUrl && !imageUrl.startsWith('http')) {
    const imagePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}

// GET: Fetch product(s)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const active = searchParams.get('active');
    const categoryId = searchParams.get('categoryId');
    const brandId = searchParams.get('brandId');
    
    if (id) {
      const product = await getProductDetails(id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: product });
    } else {
      let filter: any = {};
      if (active === 'true') filter.active = true;
      if (categoryId) filter.categoryId = new mongoose.Types.ObjectId(categoryId);
      if (brandId) filter.brandId = new mongoose.Types.ObjectId(brandId);
      
      const products = await getProducts(filter);
      return NextResponse.json({ success: true, data: products, count: products.length });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create product
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("category") as string;
    const brandId = formData.get("brand") as string;
    const sizeIds = JSON.parse(formData.get("sizes") as string || "[]");
    const colorIds = JSON.parse(formData.get("colors") as string || "[]");
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const imageFile = formData.get("image") as File;
    const multiImageFiles = formData.getAll("multiImages") as File[];
    const videoFile = formData.get("video") as File;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!price || price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (!brandId) {
      return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    }

    // Verify IDs exist
    const categoryExists = await Category.findById(categoryId).lean();
    if (!categoryExists) {
      return NextResponse.json({ error: "Selected category does not exist" }, { status: 400 });
    }

    const brandExists = await Brand.findById(brandId).lean();
    if (!brandExists) {
      return NextResponse.json({ error: "Selected brand does not exist" }, { status: 400 });
    }

    if (sizeIds.length > 0) {
      const sizeCount = await Size.countDocuments({ _id: { $in: sizeIds } });
      if (sizeCount !== sizeIds.length) {
        return NextResponse.json({ error: "One or more selected sizes do not exist" }, { status: 400 });
      }
    }

    if (colorIds.length > 0) {
      const colorCount = await Color.countDocuments({ _id: { $in: colorIds } });
      if (colorCount !== colorIds.length) {
        return NextResponse.json({ error: "One or more selected colors do not exist" }, { status: 400 });
      }
    }

    // Check for duplicate product
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    }).lean();

    if (existingProduct) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }

    const slug = getSlug(name.trim());
    const existingSlug = await Product.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json({ error: "Product with similar name already exists" }, { status: 409 });
    }

    // Save files
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

    const productData = {
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      price,
      stock: stock || 0,
      categoryId,
      brandId,
      sizeIds,
      colorIds,
      description: description || "",
      descriptionBn: descriptionBn || description || "",
      image: imageUrl,
      multiImages: multiImageUrls,
      video: videoUrl,
      slug,
      active: true,
    };

    const newProduct = await createProductQuery(productData);
    console.log("✅ Product Created:", newProduct);

    return NextResponse.json({
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/product:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const nameBn = formData.get("nameBn") as string;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined;
    const stock = formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined;
    const categoryId = formData.get("category") as string;
    const brandId = formData.get("brand") as string;
    const sizeIds = formData.get("sizes") ? JSON.parse(formData.get("sizes") as string) : undefined;
    const colorIds = formData.get("colors") ? JSON.parse(formData.get("colors") as string) : undefined;
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const imageFile = formData.get("image") as File;
    const videoFile = formData.get("video") as File;
    const active = formData.get("active") === "true";

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existingProduct = await getProductDetails(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = {};
    
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = getSlug(name.trim());
    }
    if (nameBn?.trim()) updateData.nameBn = nameBn.trim();
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (categoryId) updateData.categoryId = categoryId;
    if (brandId) updateData.brandId = brandId;
    if (sizeIds) updateData.sizeIds = sizeIds;
    if (colorIds) updateData.colorIds = colorIds;
    if (description !== undefined) updateData.description = description;
    if (descriptionBn !== undefined) updateData.descriptionBn = descriptionBn;
    if (active !== undefined) updateData.active = active;
    
    if (imageFile) {
      if (existingProduct.image) {
        await deleteImage(existingProduct.image);
      }
      updateData.image = await saveImage(imageFile, "products", "product-main");
    }
    
    if (videoFile) {
      if (existingProduct.video) {
        await deleteImage(existingProduct.video);
      }
      updateData.video = await saveImage(videoFile, "products/videos", "product-video");
    }

    const updatedProduct = await updateProductQuery(id, updateData);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await getProductDetails(id);
    
    if (product) {
      if (product.image) await deleteImage(product.image);
      if (product.multiImages) {
        for (const img of product.multiImages) {
          await deleteImage(img);
        }
      }
      if (product.video) await deleteImage(product.video);
    }

    const deleted = await deleteProductQuery(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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

// PATCH: Update product status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await toggleProductStatusQuery(id, active !== undefined ? active : false);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

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