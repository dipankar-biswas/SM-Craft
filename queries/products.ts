import { Product, IProduct } from "@/model/product-model";
import { Category } from "@/model/category-model";
import { Brand } from "@/model/brand-model";
import { Size } from "@/model/size-model";
import { Color } from "@/model/color-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import mongoose from "mongoose";
import { getCategories } from "./categories";

// Types
export interface ProductData {
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  sizeIds: string[];
  colorIds: string[];
  description: string;
  descriptionBn: string;
  image?: string;
  multiImages?: string[];
  video?: string;
  slug: string;
  active?: boolean;
}

export interface ProductResponse {
  _id: string;
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;  // Populated field
  categoryNameBn: string; // Populated field
  brandId: string;
  brandName: string;     // Populated field
  brandNameBn: string;   // Populated field
  sizeIds: string[];
  sizeNames: string[];   // Populated field
  colorIds: string[];
  colorNames: string[];  // Populated field
  colorNamesBn: string[];  // Populated field
  colorHexes: string[];  // Populated field
  description: string;
  descriptionBn: string;
  image: string;
  multiImages: string[];
  video: string;
  slug: string;
  active: boolean;
  sales: number;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryWithProducts {
  _id: string;
  name: string;
  nameBn: string;
  slug: string;
  description?: string;
  descriptionBn?: string;
  image?: string;
  active?: boolean;
  products: ProductResponse[];
}

// Helper function to populate product data
async function populateProduct(product: any): Promise<any> {
  if (!product) return null;
  
  const productObj = product.toObject ? product.toObject() : product;
  
  // Get category details
  let categoryName = '', categoryNameBn = '';
  if (productObj.categoryId) {
    const category = await Category.findById(productObj.categoryId).lean();
    if (category) {
      categoryName = category.name;
      categoryNameBn = category.nameBn || category.name;
    }
  }
  
  // Get brand details
  let brandName = '', brandNameBn = '';
  if (productObj.brandId) {
    const brand = await Brand.findById(productObj.brandId).lean();
    if (brand) {
      brandName = brand.name;
      brandNameBn = brand.nameBn || brand.name;
    }
  }
  
  // Get size details
  const sizeNames: string[] = [];
  if (productObj.sizeIds && productObj.sizeIds.length > 0) {
    const sizes = await Size.find({ _id: { $in: productObj.sizeIds } }).lean();
    sizeNames.push(...sizes.map(s => s.name));
  }
  
  // Get color details
  const colorNames: string[] = [];
  const colorNamesBn: string[] = [];
  const colorHexes: string[] = [];
  if (productObj.colorIds && productObj.colorIds.length > 0) {
    const colors = await Color.find({ _id: { $in: productObj.colorIds } }).lean();
    colors.forEach(c => {
      colorNames.push(c.name);
      colorNamesBn.push(c.nameBn);
      colorHexes.push(c.hex);
    });
  }
  
  return {
    ...productObj,
    _id: productObj._id.toString(),
    categoryId: productObj.categoryId?.toString(),
    categoryName,
    categoryNameBn,
    brandId: productObj.brandId?.toString(),
    brandName,
    brandNameBn,
    sizeIds: productObj.sizeIds?.map((id: any) => id.toString()) || [],
    sizeNames,
    colorIds: productObj.colorIds?.map((id: any) => id.toString()) || [],
    colorNames,
    colorNamesBn,
    colorHexes,
  };
}

// Get all products
export async function getAllProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find(filter).sort({ created_at: -1 }).lean();
  const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
  return populatedProducts;
}

// Get active products only
export async function getProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find({ active: true, ...filter }).sort({ created_at: -1 }).lean();
  const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
  return populatedProducts;
}

// Get product details by ID
export async function getProductDetails(productId: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findById(productId).lean();
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product details");
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product by slug");
  }
}

// Create new product
export async function createProductQuery(productData: ProductData): Promise<ProductResponse> {
  try {
    const product = await Product.create({
      ...productData,
      categoryId: new mongoose.Types.ObjectId(productData.categoryId),
      brandId: new mongoose.Types.ObjectId(productData.brandId),
      sizeIds: productData.sizeIds.map(id => new mongoose.Types.ObjectId(id)),
      colorIds: productData.colorIds.map(id => new mongoose.Types.ObjectId(id)),
    });
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create product");
  }
}

// Update product
export async function updateProductQuery(productId: string, productData: Partial<ProductData>): Promise<ProductResponse | null> {
  try {
    const updateData: any = { ...productData, updated_at: new Date() };
    
    if (productData.categoryId) {
      updateData.categoryId = new mongoose.Types.ObjectId(productData.categoryId);
    }
    if (productData.brandId) {
      updateData.brandId = new mongoose.Types.ObjectId(productData.brandId);
    }
    if (productData.sizeIds) {
      updateData.sizeIds = productData.sizeIds.map(id => new mongoose.Types.ObjectId(id));
    }
    if (productData.colorIds) {
      updateData.colorIds = productData.colorIds.map(id => new mongoose.Types.ObjectId(id));
    }
    
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).lean();
    
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update product");
  }
}

// Delete product
export async function deleteProductQuery(productId: string): Promise<boolean> {
  try {
    const result = await Product.findByIdAndDelete(productId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete product");
  }
}

// Toggle product status
export async function toggleProductStatusQuery(productId: string, active: boolean): Promise<ProductResponse | null> {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle product status");
  }
}


// Get products by category
export async function getProductsByCategory(category: string): Promise<ProductResponse[]> {
  try {
    const categoryDoc = await Category.findOne({
      slug: category,
      active: true,
    }).lean();

    // ❗ handle not found case
    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    const products = await Product.find({
      categoryId: new mongoose.Types.ObjectId(categoryDoc._id),
      active: true,
    }).lean();
    console.log(products);
    
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by category");
  }
}

// Get products by brand
export async function getProductsByBrand(brand: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ brand, active: true }).lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by brand");
  }
}

// Search products
export async function searchProducts(query: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { nameBn: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      active: true
    }).limit(50).lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to search products");
  }
}

// Get featured products
export async function getFeaturedProducts(limit: number = 10): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ active: true })
      .sort({ sales: -1 })
      .limit(limit)
      .lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get featured products");
  }
}

// More efficient version using MongoDB aggregation
export async function getCategoriesWiseProducts(): Promise<CategoryWithProducts[]> {
  try {
    const categories = await getCategories();

    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          categoryId: category.id, // ✅ no toString()
          active: true,
        }).lean();

        return {
          ...category,
          products: replaceMongoIdInArray(products) as ProductResponse[],
        };
      })
    );

    return categoriesWithProducts;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get categories wise products"
    );
  }
}


// Get category related products
export async function getCategoryRelatedProducts(category: string): Promise<ProductResponse[]> {
  try {
    const categoryDoc = await Category.findOne({
      _id: new mongoose.Types.ObjectId(category),
      active: true,
    }).lean();

    // ❗ handle not found case
    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    const products = await Product.find({
      categoryId: new mongoose.Types.ObjectId(categoryDoc._id),
      active: true,
    }).lean();
    
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by category");
  }
}