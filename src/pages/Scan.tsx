import React, { useRef, useState, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import BookConvertModal from "../components/scan/BookConvertModal.tsx";

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
    <div className="w-full flex justify-between bg-[#181A20] flex-col">
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

      {/* 하단 컨트롤 버튼들 */}
      <div className="relative w-full h-[199px] flex items-center justify-center">
        {/* 촬영 버튼 */}
        <div className="absolute take-button z-10">
          <button
            onClick={handleTakePhoto}
            className={`w-20 h-20 rounded-full border-4 border-white transition-opacity ${
              hasCameraPermission ? "bg-white/20" : "bg-white/5 opacity-50"
            }`}
          />
        </div>

        {/* 갤러리 버튼 */}
        <div className="absolute gallery-button right-[4.5rem] z-10">
          <button
            onClick={handleGalleryClick}
            className="p-4 rounded-full bg-gray-800/50"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full" />
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
