// lib/validation.ts
import { GalleryQueryParams } from '@/types/gallery.types';

export function validateQueryParams(params: GalleryQueryParams): string | null {
  if (params.page && (params.page < 1 || !Number.isInteger(params.page))) {
    return 'Page must be a positive integer';
  }
  
  if (params.limit && (params.limit < 1 || params.limit > 50)) {
    return 'Limit must be between 1 and 50';
  }
  
  if (params.sortBy && !['likes', 'createdAt', 'title', 'views', 'downloads'].includes(params.sortBy)) {
    return 'Invalid sort field';
  }
  
  if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
    return 'Sort order must be asc or desc';
  }
  
  if (params.minLikes && params.minLikes < 0) {
    return 'Minimum likes must be non-negative';
  }
  
  if (params.dateFrom && params.dateTo && params.dateFrom > params.dateTo) {
    return 'Date from cannot be after date to';
  }
  
  return null;
}

export function validateImageData(data: any): string | null {
  if (!data.title || typeof data.title !== 'string' || data.title.length > 100) {
    return 'Title is required and must be less than 100 characters';
  }
  
  if (!data.src || typeof data.src !== 'string' || !data.src.startsWith('http')) {
    return 'Valid image URL is required';
  }
  
  if (!data.category || typeof data.category !== 'string') {
    return 'Category is required';
  }
  
  if (data.tags && !Array.isArray(data.tags)) {
    return 'Tags must be an array';
  }
  
  return null;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500);
}