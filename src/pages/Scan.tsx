import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const camera = useRef<any>(null);
  const navigate = useNavigate();

  // 사진 촬영 및 다운로드
  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();

      downloadImage(photo);
    }
  };

  // 파일로 다운로드
  const downloadImage = (photoData: string) => {
    try {
      const link = document.createElement("a");
      link.href = photoData;
      link.download = `scan-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // 홈으로 이동
  const handleHomeClick = () => {
    navigate("/");
  };

  // 갤러리로 이동
  const handleGalleryClick = () => {
    navigate("/gallery");
  };

  return (
    <div className="relative h-screen w-full">
      <Camera
        ref={camera}
        aspectRatio="cover"
        errorMessages={{
          noCameraAccessible: "카메라에 접근할 수 없습니다.",
          permissionDenied: "카메라 사용 권한이 거부되었습니다.",
          switchCamera: "카메라를 전환할 수 없습니다.",
          canvas: "캔버스를 사용할 수 없습니다.",
        }}
      />

      {/* 하단 컨트롤 버튼들 */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="flex justify-around items-center mx-auto w-full max-w-md">
          {/* 홈 버튼 */}
          <button
            onClick={handleHomeClick}
            className="p-4 rounded-full bg-gray-800/50"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>

          {/* 촬영 버튼 */}
          <button
            onClick={handleTakePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-white/20"
          />

          {/* 갤러리 버튼 */}
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
    </div>
  );
};

export default Scan;
