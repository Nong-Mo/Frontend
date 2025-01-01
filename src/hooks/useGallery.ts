import { useState } from 'react';

export interface GalleryItem {
  id: string;
  photo: string;
  timestamp: number;
}

interface UseGalleryProps {
  onSaveSuccess?: () => void;
}

export const useGallery = ({ onSaveSuccess }: UseGalleryProps = {}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const saveToGallery = async (photoData: string) => {
    try {
      const newItem: GalleryItem = {
        id: `photo-${Date.now()}`,
        photo: photoData,
        timestamp: Date.now(),
      };

      const currentItems = localStorage.getItem("gallery");
      const parsedItems: GalleryItem[] = currentItems
        ? JSON.parse(currentItems)
        : [];

      const updatedItems = [...parsedItems, newItem];
      setGalleryItems(updatedItems);
      localStorage.setItem("gallery", JSON.stringify(updatedItems));

      onSaveSuccess?.();
      return newItem;
    } catch (error) {
      console.error("갤러리 저장 실패:", error);
      throw error;
    }
  };

  return {
    galleryItems,
    saveToGallery
  };
};