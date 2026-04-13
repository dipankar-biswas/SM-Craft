import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  updateBrandStatus,
} from "@/app/actions/brand";
import { getBrandDetails } from "@/queries/brands";

// ==================== POST: Create or Update Brand (with image upload) ====================
export async function POST(request) {
  try {
    const formData = await request.formData();

    const brandId = formData.get("brandId"); // used for update
    const title = formData.get("title");
    const title_bn = formData.get("title_bn");
    const slug = formData.get("slug");
    const video_link = formData.get("video_link");
    const thumbnail = formData.get("thumbnail");
    const imgName = formData.get("imgName"); // old image name (for update)
    const destination = './public/assets/uploads/brands/';

    if (!thumbnail) {
      return NextResponse.json(
        { error: "Thumbnail is required!" },
        { status: 400 }
      );
    }

    // Default image name
    let imageUrl = imgName || null;

    // If a new file is uploaded
    if (thumbnail && typeof thumbnail === "object" && thumbnail.name) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());

      // Ensure destination folder exists
      const uploadDir = path.join(process.cwd(), destination);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Delete old image if exists
      if (imgName && imgName !== "null" && imgName !== "") {
        const oldImagePath = path.join(uploadDir, imgName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("🗑️ Old image deleted:", oldImagePath);
        }
      }

      // Generate minutes+seconds timestamp (e.g., "1230" for 12:30)
      const now = new Date();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const timestamp = minutes + seconds; // e.g., "1230"

      // Create new filename: timestamp + "_" + original name
      const newFileName = `${timestamp}_${thumbnail.name}`;
      const filePath = path.join(uploadDir, newFileName);

      // Save new image
      fs.writeFileSync(filePath, buffer);
      imageUrl = newFileName; // Store the new filename
    }

    // Prepare brand data
    const brandData = {
      title,
      title_bn,
      slug,
      video_link,
      thumbnail: imageUrl,
    };

    // If no brandId → Create new brand
    if (!brandId || brandId === "null" || brandId === "undefined") {
      await createBrand(brandData);
      console.log("✅ Brand Created");
    } else {
      await updateBrand(brandId, brandData);
      console.log("♻️ Brand Updated");
    }

    return NextResponse.json({
      success: true,
      message: brandId
        ? "Brand updated successfully!"
        : "Brand created successfully!",
      brand: brandData,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/brands:", error);
    return NextResponse.json(
      { error: "Failed to process brand request" },
      { status: 500 }
    );
  }
}

// ==================== DELETE: Delete a brand by ID ====================
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id === undefined) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      );
    }

    const brand = await getBrandDetails(id);
    
    if (brand?.thumbnail && brand?.thumbnail !== "null" && brand?.thumbnail !== "") {
      const oldImagePath = path.join(
        process.cwd(),
        "public/assets/uploads/brands/",
        brand.thumbnail
      );
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await deleteBrand(id);

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in DELETE /api/brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}

// ==================== PATCH: Update brand status (e.g., active/inactive) ====================
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id === undefined) {
      return NextResponse.json(
        { error: "Brand ID and status are required in JSON body" },
        { status: 400 }
      );
    }

    await updateBrandStatus(id);

    return NextResponse.json({
      success: true,
      message: "Brand status updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand status" },
      { status: 500 }
    );
  }
}