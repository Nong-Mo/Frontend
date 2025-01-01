import { useState, useRef, useEffect } from 'react';

interface CapturedPhoto {
  id: string;
  data: string;
}

export const useCamera = () => {
  const camera = useRef<any>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  useEffect(() => {
    // 카메라 권한 확인
    const checkCameraPermission = async () => {
      try {
        const result = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        localStorage.setItem("cameraPermission", "granted");
        // 스트림 정리
        result.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Camera permission error:", error);
        setHasCameraPermission(false);
        localStorage.setItem("cameraPermission", "denied");
      }
    };

    checkCameraPermission();
  }, []);

  const takePhoto = () => {
    if (!camera.current || !hasCameraPermission) {
      if (!hasCameraPermission) {
        setShowPermissionRequest(true);
      }
      return null;
    }

    try {
      const photoData = camera.current.takePhoto();
      if (!photoData) {
        console.error("No photo data received from camera");
        throw new Error("사진 촬영 실패");
      }
      
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
    camera,
    hasCameraPermission,
    showPermissionRequest,
    setShowPermissionRequest,
    takePhoto,
    capturedPhotos,
    clearPhotos,
    removePhoto
  };
};