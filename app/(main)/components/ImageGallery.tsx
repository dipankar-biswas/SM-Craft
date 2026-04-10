'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Grid, LayoutGrid, Image as ImageIcon, Heart, Share2, Download, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: number
  src: string
  alt: string
  title: string
  category: string
  likes?: number
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    alt: 'Premium Embroidery Panjabi',
    title: 'Premium Embroidery Panjabi',
    category: 'Embroidery',
    likes: 124
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Classic White Panjabi',
    title: 'Classic White Panjabi',
    category: 'Classic',
    likes: 89
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1610192245053-6dab4af2a8c4?w=600&h=600&fit=crop',
    alt: 'Royal Blue Koti',
    title: 'Royal Blue Koti',
    category: 'Koti',
    likes: 156
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1621600411688-4be93cd6856c?w=600&h=600&fit=crop',
    alt: 'Three Piece Set',
    title: 'Three Piece Set',
    category: 'Three Piece',
    likes: 203
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Silk Panjabi',
    title: 'Silk Panjabi',
    category: 'Premium',
    likes: 67
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    alt: 'Wedding Collection',
    title: 'Wedding Collection Panjabi',
    category: 'Wedding',
    likes: 312
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1610192245053-6dab4af2a8c4?w=600&h=600&fit=crop',
    alt: 'Cotton Panjabi',
    title: 'Cotton Panjabi',
    category: 'Casual',
    likes: 45
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1621600411688-4be93cd6856c?w=600&h=600&fit=crop',
    alt: 'Designer Koti',
    title: 'Designer Koti Set',
    category: 'Koti',
    likes: 98
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1583391733956-6c1820f887d9?w=600&h=600&fit=crop',
    alt: 'Eid Special',
    title: 'Eid Special Collection',
    category: 'Eid',
    likes: 267
  }
]

const categories = ['All', 'Embroidery', 'Koti', 'Three Piece', 'Premium', 'Wedding', 'Classic', 'Casual', 'Eid']

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    let newIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }
    setSelectedImage(filteredImages[newIndex])
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') navigateImage('prev')
    if (e.key === 'ArrowRight') navigateImage('next')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f0ebe3] py-8 md:py-12">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a2f2a] to-[#1e4a46] text-white px-6 py-2 rounded-full mb-4">
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">Our Collection</span>
          </div> */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2c3e2f] font-serif mb-3">
            Image Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our premium collection of Panjabis, Kotis, and traditional wear
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#0f5c54] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-[#d4a373] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6 gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-[#0f5c54] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('masonry')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'masonry' 
                ? 'bg-[#0f5c54] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openLightbox(image)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      hoveredId === image.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  {/* Overlay Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredId === image.id ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  {/* Content Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 ${
                    hoveredId === image.id ? 'translate-y-0' : 'translate-y-full'
                  }`}>
                    <h3 className="font-semibold text-sm md:text-base">{image.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        {image.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        View
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
                    hoveredId === image.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-[#d4a373] hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-[#d4a373] hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#0f5c54]/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Masonry Layout
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-5 group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={Math.random() * 200 + 400}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white text-sm font-semibold">{image.title}</h3>
                    <p className="text-white/80 text-xs">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('prev')
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('next')
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-5xl max-h-[90vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{selectedImage.category}</p>
                <div className="flex gap-4 mt-3">
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{selectedImage.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}