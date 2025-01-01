import { useRef, useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';

interface CapturedPhoto {
  id: string;
  data: string;
}

export const useCamera = (cameraRef: React.RefObject<Camera>) => {
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Camera permission error:", error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) {
      console.error("Camera ref is not available");
      return null;
    }

    try {
      const photoData = await cameraRef.current.takePhoto();
      if (!photoData) throw new Error("사진 촬영 실패");

      const newPhoto = {
        id: `photo-${Date.now()}`,
        data: photoData
      };

      setCapturedPhotos(prev => [...prev, newPhoto]);
      return newPhoto;
    } catch (error) {
      console.error("사진 촬영 실패:", error);
      throw error;
    }
  };

  const clearPhotos = () => {
    setCapturedPhotos([]);
  };

  const removePhoto = (id: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  return {
    hasCameraPermission,
    showPermissionRequest,
    setShowPermissionRequest,
    takePhoto,
    capturedPhotos,
    clearPhotos,
    removePhoto
  };
};