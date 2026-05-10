// hooks/useGallery.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { galleryService } from '@/services/galleryService';
import { GalleryImage, GalleryQueryParams, GalleryStats, GalleryCategory } from '@/types/gallery.types';

// Hook for fetching gallery images with pagination and filters
export function useGallery(initialParams: GalleryQueryParams = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [params, setParams] = useState<GalleryQueryParams>(initialParams);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await galleryService.getImages(params);
    
    if (response.success && response.data) {
      setImages(response.data);
      setPagination(response.pagination);
    } else {
      setError(response.error || 'Failed to fetch images');
    }
    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateParams = useCallback((newParams: Partial<GalleryQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const likeImage = useCallback(async (id: number) => {
    const response = await galleryService.likeImage(id);
    if (response.success && response.data) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, likes: response.data!.likes } : img
      ));
    }
    return response;
  }, []);

  const unlikeImage = useCallback(async (id: number) => {
    const response = await galleryService.unlikeImage(id);
    if (response.success && response.data) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, likes: response.data!.likes } : img
      ));
    }
    return response;
  }, []);

  const shareImage = useCallback(async (image: GalleryImage) => {
    return await galleryService.shareImage(image);
  }, []);

  const downloadImage = useCallback(async (image: GalleryImage) => {
    await galleryService.downloadImage(image.src, image.title, image.id);
  }, []);

  const deleteImage = useCallback(async (id: number) => {
    const response = await galleryService.deleteImage(id);
    if (response.success) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
    return response;
  }, []);

  const refetch = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    likeImage,
    unlikeImage,
    shareImage,
    downloadImage,
    deleteImage,
    refetch
  };
}

// Hook for gallery statistics
export function useGalleryStats() {
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const response = await galleryService.getStats();
    if (response.success && response.data) {
      setStats(response.data);
    } else {
      setError(response.error || 'Failed to fetch stats');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const response = await galleryService.getCategories();
    if (response.success && response.data) {
      setCategories(response.data);
    } else {
      setError(response.error || 'Failed to fetch categories');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (categoryData: Partial<GalleryCategory>) => {
    const response = await galleryService.createCategory(categoryData);
    if (response.success && response.data) {
      setCategories(prev => [...prev, response.data!]);
    }
    return response;
  }, []);

  return { categories, loading, error, createCategory, refetch: fetchCategories };
}

// Hook for single image
export function useGalleryImage(id: number) {
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    const response = await galleryService.getImageById(id);
    if (response.success && response.data) {
      setImage(response.data);
    } else {
      setError(response.error || 'Failed to fetch image');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchImage();
    }
  }, [id, fetchImage]);

  const likeImage = useCallback(async () => {
    if (!image) return;
    const response = await galleryService.likeImage(image.id);
    if (response.success && response.data) {
      setImage(prev => prev ? { ...prev, likes: response.data!.likes } : null);
    }
    return response;
  }, [image]);

  const shareImage = useCallback(async () => {
    if (!image) return false;
    return await galleryService.shareImage(image);
  }, [image]);

  const downloadImage = useCallback(async () => {
    if (!image) return;
    await galleryService.downloadImage(image.src, image.title, image.id);
  }, [image]);

  return {
    image,
    loading,
    error,
    likeImage,
    shareImage,
    downloadImage,
    refetch: fetchImage
  };
}

// Hook for search functionality
export function useGallerySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedTerm.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      const response = await galleryService.searchImages(debouncedTerm);
      if (response.success && response.data) {
        setResults(response.data);
      }
      setLoading(false);
    };
    
    performSearch();
  }, [debouncedTerm]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    hasResults: results.length > 0
  };
}

// Hook for infinite scroll
export function useInfiniteGallery(initialParams: GalleryQueryParams = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const response = await galleryService.getImages({
      ...initialParams,
      page,
      limit: 12
    });
    
    if (response.success && response.data) {
      setImages(prev => [...prev, ...response.data]);
      setHasMore(response.pagination?.hasNext || false);
      setPage(prev => prev + 1);
    } else {
      setError(response.error || 'Failed to load more images');
    }
    setLoading(false);
  }, [page, loading, hasMore, initialParams]);

  const reset = useCallback(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    images,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
}