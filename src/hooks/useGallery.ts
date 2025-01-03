import { useState, useEffect } from 'react';

export interface GalleryItem {
  id: string;
  photo: string;
  timestamp: number;
}

interface UseGalleryProps {
  onSaveSuccess?: () => void;
}

const STORAGE_KEY = 'gallery';  // 상수로 분리

export const useGallery = ({ onSaveSuccess }: UseGalleryProps = {}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // 초기 로드를 위한 useEffect 추가
  useEffect(() => {
    const loadGallery = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          setGalleryItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("갤러리 로드 실패:", error);
      }
    };

    loadGallery();
  }, []);

  const saveToGallery = async (photoData: string) => {
    try {
      const newItem: GalleryItem = {
        id: `photo-${Date.now()}`,
        photo: photoData,
        timestamp: Date.now(),
      };

      // localStorage 조회와 상태 업데이트를 함께 처리
      setGalleryItems(prevItems => {
        const updatedItems = [...prevItems, newItem];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
        return updatedItems;
      });

      onSaveSuccess?.();
      return newItem;
    } catch (error) {
      console.error("갤러리 저장 실패:", error);
      throw error;
    }
  };

  // 삭제 기능 추가
  const removeFromGallery = (id: string) => {
    setGalleryItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  return {
    galleryItems,
    saveToGallery,
    removeFromGallery
  };
};