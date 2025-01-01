import React, { useRef, useState, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import BookConvertModal from "../components/scan/BookConvertModal.tsx";
import shutter from "../icons/camera/camera_shutter.svg";
import check from "../icons/camera/check.svg";

interface GalleryItem {
  id: string;
  photo: string;
  timestamp: number;
}

const Scan = () => {
  const camera = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(
    () => {
      const savedPermission = localStorage.getItem("cameraPermission");
      return savedPermission === "granted";
    }
  );

  // 갤러리 아이템 저장 함수 수정
  const saveToGallery = (photoData: string) => {
    try {
      // 새 아이템 생성
      const newItem: GalleryItem = {
        id: `photo-${Date.now()}`,
        photo: photoData,
        timestamp: Date.now(),
      };

      // 현재 저장된 아이템 가져오기
      const currentItems = localStorage.getItem("gallery");
      const parsedItems: GalleryItem[] = currentItems
        ? JSON.parse(currentItems)
        : [];

      // 새 아이템 추가
      const updatedItems = [...parsedItems, newItem];

      // 상태 업데이트
      setGalleryItems(updatedItems);

      // 로컬 스토리지에 저장
      localStorage.setItem("gallery", JSON.stringify(updatedItems));

      console.log("갤러리 저장 성공:", {
        newItem,
        totalItems: updatedItems.length,
      });

      // 저장 완료 알림
      alert("사진이 갤러리에 저장되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("갤러리 저장 실패:", error);
      alert("사진 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 사진 촬영 함수 수정
  const handleTakePhoto = () => {
    if (camera.current && hasCameraPermission) {
      try {
        const photo = camera.current.takePhoto();
        console.log(
          "촬영된 사진 데이터:",
          photo ? "데이터 있음" : "데이터 없음"
        );

        if (!photo) {
          throw new Error("사진 촬영 실패");
        }

        saveToGallery(photo);
      } catch (error) {
        console.error("사진 촬영 실패:", error);
        alert("사진 촬영에 실패했습니다. 다시 시도해주세요.");
      }
    } else if (!hasCameraPermission) {
      setShowPermissionRequest(true);
    }
  };
  const handleGalleryClick = () => {
    navigate("/gallery");
  };

  return (
    <div className="w-full flex justify-between bg-[#181A20] flex-col z-10">
      <NavBar title="스캔하기" />

      {/* Camera View - 상단 네비게이션 바 높이만큼 여백 추가 */}
      <div className="w-[440px] h-[653px] flex items-center justify-center">
        <div
          className="relative bg-black"
          style={{
            width: "440px",
            height: "653px",
            overflow: "hidden",
          }}
        >
          {/* Camera Component */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <Camera
              ref={camera}
              aspectRatio="cover"
              errorMessages={{
                noCameraAccessible: "카메라에 접근할 수 없습니다.",
                permissionDenied: "카메라 권한이 거부되었습니다.",
                switchCamera: "카메라를 전환할 수 없습니다.",
                canvas: "캔버스를 사용할 수 없습니다.",
              }}
              style={{
                minWidth: "100%",
                minHeight: "100%",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative w-full h-[199px] flex items-center justify-center">
        {/* 촬영 버튼 */}
        <div className="absolute take-button z-10">
          <button
            onClick={handleTakePhoto}
            className={`flex items-center justify-center w-20 h-20 transition-opacity ${
              hasCameraPermission ? "opacity-100" : "opacity-50"
            }`}
          >
            <img 
              src={shutter} 
              alt="촬영하기"
              className="w-full h-full"
            />
          </button>
        </div>

        {/* 갤러리 버튼 */}
        <div className="absolute gallery-button right-[4.5rem] z-10">
          <button
            onClick={handleGalleryClick}
            className="p-4 rounded-full"
          >
            <div className="relative">
              <img
                src={check}
                alt="변환하기"
                className="w-full h-full"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full" />
            </div>
          </button>
        </div>
      </div>
      <BookConvertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Scan;
