// app/api/brand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Brand } from "@/model/brand-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getSlug } from "@/lib/convertData";
import { 
  createBrandQuery, 
  updateBrandQuery, 
  deleteBrandQuery, 
  toggleBrandStatusQuery,
  getBrandDetails,
  getBrands
} from "@/queries/brands";

// Types
interface BrandData {
  name: string;
  nameBn: string;
  country: string;
  slug: string;
  active?: boolean;
}

// ==================== GET: Fetch brand(s) ====================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get single brand by ID using query
      const brand = await getBrandDetails(id);
      if (!brand) {
        return NextResponse.json(
          { error: "Brand not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: brand,
      });
    } else {
      // Get all brands using query
      const brands = await getBrands();
      return NextResponse.json({
        success: true,
        data: brands,
      });
    }
  } catch (error) {
    console.error("❌ Error in GET /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

// ==================== POST: Create a new brand ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameBn, country } = body;

    // Validation
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Brand name (English) is required" },
        { status: 400 }
      );
    }

    if (!nameBn || nameBn.trim() === "") {
      return NextResponse.json(
        { error: "Brand name (Bangla) is required" },
        { status: 400 }
      );
    }

    if (!country || country.trim() === "") {
      return NextResponse.json(
        { error: "Country of origin is required" },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } },
        { nameBn: { $regex: new RegExp(`^${nameBn.trim()}$`, 'i') } }
      ]
    }).lean();

    if (existingBrand) {
      return NextResponse.json(
        { error: "Brand with this name already exists" },
        { status: 409 }
      );
    }

    // Prepare brand data
    const slug = getSlug(name.trim());
    
    // Check if slug already exists
    const existingSlug = await Brand.findOne({ slug }).lean();
    if (existingSlug) {
      return NextResponse.json(
        { error: "Brand with similar name already exists" },
        { status: 409 }
      );
    }

    const brandData: BrandData = {
      name: name.trim(),
      nameBn: nameBn.trim(),
      country: country.trim(),
      slug: slug,
      active: true,
    };

    // Create new brand using query
    const newBrand = await createBrandQuery(brandData);
    console.log("✅ Brand Created:", newBrand);

    return NextResponse.json({
      success: true,
      message: "Brand created successfully!",
      data: newBrand,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/brand:", error);
    // Check for duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Brand with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create brand" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update an existing brand ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, nameBn, country } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    // Check if brand exists
    const existingBrand = await getBrandDetails(id);
    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
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
    
    if (country && country.trim()) {
      updateData.country = country.trim();
    }
    
    updateData.updated_at = new Date();

    // Update brand using query
    const updatedBrand = await updateBrandQuery(id, updateData);

    if (!updatedBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Brand Updated:", updatedBrand);

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully!",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/brand:", error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: "Brand with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update brand" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a brand by ID ====================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    // Delete brand using query
    const deleted = await deleteBrandQuery(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    console.log("✅ Brand deleted:", id);

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete brand" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update brand status ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    // Toggle brand status using query
    const updatedBrand = await toggleBrandStatusQuery(id, active !== undefined ? active : false);

    if (!updatedBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    console.log("♻️ Brand status updated for:", id, "New status:", updatedBrand.active);

    return NextResponse.json({
      success: true,
      message: "Brand status updated successfully",
      active: updatedBrand.active,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update brand status" },
      { status: 500 }
    );
  }
}