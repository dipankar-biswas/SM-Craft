// services/galleryService.ts
import {
  GalleryImage,
  GalleryQueryParams,
  ApiResponse,
  GalleryStats,
  GalleryCategory,
  UploadImageRequest,
  BulkOperationRequest,
} from "@/types/gallery.types";

class GalleryService {
  private baseUrl = "/api/gallery";
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  private clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  async getImages(
    params: GalleryQueryParams = {},
  ): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.category) queryParams.append("category", params.category);
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.tags && params.tags.length)
        queryParams.append("tags", params.tags.join(","));
      if (params.minLikes)
        queryParams.append("minLikes", params.minLikes.toString());
      if (params.dateFrom)
        queryParams.append("dateFrom", params.dateFrom.toISOString());
      if (params.dateTo)
        queryParams.append("dateTo", params.dateTo.toISOString());

      const cacheKey = `images-${queryParams.toString()}`;

      return await this.fetchWithCache(cacheKey, async () => {
        const response = await fetch(`${this.baseUrl}/images?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch images");
        return await response.json();
      });
    } catch (error) {
      console.error("Get images error:", error);
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  }

  async getImageById(id: number): Promise<ApiResponse<GalleryImage>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${id}`);
      if (!response.ok) throw new Error("Failed to fetch image");
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch image",
      };
    }
  }

  async likeImage(id: number): Promise<ApiResponse<{ likes: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to like image");

      // Invalidate cache
      this.clearCache("images");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to like image",
      };
    }
  }

  async unlikeImage(id: number): Promise<ApiResponse<{ likes: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${id}/like`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unlike image");

      this.clearCache("images");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to unlike image",
      };
    }
  }

  async addImage(
    imageData: Omit<GalleryImage, "id" | "likes" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<GalleryImage>> {
    try {
      const response = await fetch(`${this.baseUrl}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) throw new Error("Failed to add image");

      this.clearCache();

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to add image",
      };
    }
  }

  async updateImage(
    id: number,
    updates: Partial<GalleryImage>,
  ): Promise<ApiResponse<GalleryImage>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update image");

      this.clearCache();

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to update image",
      };
    }
  }

  async deleteImage(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/images/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      this.clearCache();

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete image",
      };
    }
  }

  async bulkOperation(
    operation: BulkOperationRequest,
  ): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operation),
      });

      if (!response.ok) throw new Error("Bulk operation failed");

      this.clearCache();

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Bulk operation failed",
      };
    }
  }

  async getCategories(): Promise<ApiResponse<GalleryCategory[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch categories",
      };
    }
  }

  async createCategory(
    categoryData: Partial<GalleryCategory>,
  ): Promise<ApiResponse<GalleryCategory>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) throw new Error("Failed to create category");

      this.clearCache("categories");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to create category",
      };
    }
  }

  async getStats(): Promise<ApiResponse<GalleryStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch statistics",
      };
    }
  }

  async uploadImage(
    file: File,
    metadata: { title: string; category: string; tags: string[] },
  ): Promise<ApiResponse<{ url: string; filename: string }>> {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", metadata.title);
      formData.append("category", metadata.category);
      formData.append("tags", metadata.tags.join(","));

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      this.clearCache();

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to upload image",
      };
    }
  }

  async shareImage(image: GalleryImage): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this beautiful ${image.category} design!`,
          url: `${window.location.origin}/gallery/${image.id}`,
        });

        // Track share
        await fetch(`${this.baseUrl}/images/${image.id}/share`, {
          method: "POST",
        });

        return true;
      } catch (error) {
        console.error("Error sharing:", error);
        return false;
      }
    } else {
      // Fallback: Copy to clipboard
      const url = `${window.location.origin}/gallery/${image.id}`;
      await navigator.clipboard.writeText(url);

      // Track share
      await fetch(`${this.baseUrl}/images/${image.id}/share`, {
        method: "POST",
      });

      return true;
    }
  }

  async downloadImage(
    imageSrc: string,
    imageTitle: string,
    imageId: number,
  ): Promise<void> {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageTitle.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track download
      await fetch(`${this.baseUrl}/images/${imageId}/download`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }

  async searchImages(searchTerm: string): Promise<ApiResponse<GalleryImage[]>> {
    return this.getImages({ search: searchTerm, limit: 20 });
  }

  async getRelatedImages(
    imageId: number,
    limit: number = 4,
  ): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const image = await this.getImageById(imageId);
      if (!image.success || !image.data) {
        return { success: false, error: "Image not found" };
      }

      // Find images with same category or tags
      return this.getImages({
        category: image.data.category,
        limit,
        page: 1,
      });
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch related images",
      };
    }
  }

  // Add these methods to your existing GalleryService class

  async getAdminStats(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/admin/gallery?action=stats`,
      );
      return await response.json();
    } catch (error) {
      return { success: false, error: "Failed to fetch admin stats" };
    }
  }

  async getAllImages(): Promise<GalleryImage[]> {
    try {
      const response = await this.getImages({ limit: 1000 });
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async bulkUpload(images: Partial<GalleryImage>[]): Promise<GalleryImage[]> {
    const uploadedImages: GalleryImage[] = [];

    for (const image of images) {
      const response = await this.addImage(image as any);
      if (response.success && response.data) {
        uploadedImages.push(response.data);
      }
    }

    return uploadedImages;
  }

  async reorderImages(
    orderData: { id: number; order: number }[],
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", data: orderData }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      return false;
    }
  }

  async duplicateImage(id: number): Promise<ApiResponse<GalleryImage>> {
    try {
      const original = await this.getImageById(id);
      if (!original.success || !original.data) {
        return { success: false, error: "Original image not found" };
      }

      const duplicatedImage = {
        ...original.data,
        id: Date.now(),
        title: `${original.data.title} (Copy)`,
        likes: 0,
        views: 0,
        downloads: 0,
        shares: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.addImage(duplicatedImage);
    } catch (error) {
      return { success: false, error: "Failed to duplicate image" };
    }
  }

  // Add these methods to your GalleryService class

  async updateCategory(
    id: string,
    data: Partial<GalleryCategory>,
  ): Promise<ApiResponse<GalleryCategory>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update category");

      this.clearCache("categories");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to update category",
      };
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      this.clearCache("categories");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete category",
      };
    }
  }

  async bulkDeleteCategories(
    ids: string[],
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          categoryIds: ids,
        }),
      });

      if (!response.ok) throw new Error("Bulk delete failed");

      this.clearCache("categories");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Bulk delete failed",
      };
    }
  }

  async bulkUpdateCategoryStatus(
    ids: string[],
    isActive: boolean,
  ): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateStatus",
          categoryIds: ids,
          data: { isActive },
        }),
      });

      if (!response.ok) throw new Error("Bulk update failed");

      this.clearCache("categories");

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: "Bulk update failed",
      };
    }
  }
}

export const galleryService = new GalleryService();
