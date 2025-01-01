import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import BookConvertModal from "../components/scan/BookConvertModal.tsx";
import shutter from "../icons/camera/camera_shutter.svg";
import check from "../icons/camera/check.svg";
import { useCamera } from "../hooks/useCamera";
import { uploadImages } from "../api/image";

const Scan = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  const cameraRef = useRef<Camera>(null); // Camera 컴포넌트 ref 타입 지정

  const {
    hasCameraPermission,
    takePhoto,
    capturedPhotos,
    clearPhotos,
    removePhoto,
  } = useCamera(cameraRef); // useCamera 훅에 cameraRef 전달

  const handleTakePhoto = async () => {
    if (!hasCameraPermission || isLoading) return;

    try {
      const photo = await takePhoto(); // takePhoto가 Promise를 반환하므로 await 사용
      if (photo && photo.data) {
        console.log("사진 촬영 성공:", photo.id);
      }
    } catch (error) {
      console.error("사진 촬영 실패:", error);
      alert("사진 촬영에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleUpload = async () => {
    if (isLoading || capturedPhotos.length === 0) return;

    setIsLoading(true);
    setUploadStatus(null);

    try {
      const filePromises = capturedPhotos.map(async (photo) => {
        const base64Response = await fetch(photo.data);
        const blob = await base64Response.blob();
        return new File([blob], `photo-${photo.id}.jpg`, { type: "image/jpeg" });
      });

      const files = await Promise.all(filePromises);

      const response = await uploadImages({
        title: "촬영된 이미지들",
        files,
      });

      setUploadStatus({
        success: true,
        message: response.message,
      });

      setIsModalOpen(true);
      clearPhotos();
    } catch (error: any) {
      console.error("업로드 에러:", error);

      let errorMessage;
      if (error.message.includes("토큰")) {
        errorMessage = error.message;
        navigate("/signin");
      } else {
        errorMessage =
          error.response?.data?.detail?.[0]?.msg ||
          error.response?.data?.message ||
          "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
      }

      setUploadStatus({
        success: false,
        message: errorMessage,
      });

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-between flex-col z-10">
      <NavBar title="스캔하기" />

      {/* Camera View */}
      <div className="w-full flex-1 flex items-center justify-center relative">
        <div
          className="bg-black"
          style={{
            width: "440px",
            aspectRatio: "440/653",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <Camera
              ref={cameraRef} // 변경된 ref 사용
              aspectRatio="cover"
              imageType="jpeg" // 이미지 형식 강제
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
        {/* Preview Section */}
        {capturedPhotos.length > 0 && isPreviewVisible && (
          <div className="absolute bottom-0 left-0 w-full py-3 bg-black/70">
            <div className="mx-4">
              <div className="flex overflow-x-auto gap-3 scrollbar-hide">
                {capturedPhotos.map((photo) => (
                  <div key={photo.id} className="flex-none relative">
                    <img
                      src={photo.data}
                      alt="촬영된 사진"
                      className="w-24 h-24 object-cover rounded-lg"
                      style={{ aspectRatio: "1/1" }}
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="text-[15px] absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white shadow-lg"
                      style={{ borderRadius: "50%" }}
                    >
                      <span style={{ lineHeight: "100%" }}>✕</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative w-full h-[199px] flex items-center justify-center bg-[#181A20]">
        {/* 촬영 버튼 */}
        <div className="absolute take-button z-10">
          <button
            onClick={handleTakePhoto}
            disabled={isLoading}
            className={`flex items-center justify-center w-20 h-20 transition-opacity ${
              hasCameraPermission && !isLoading ? "opacity-100" : "opacity-50"
            }`}
          >
            <img src={shutter} alt="촬영하기" className="w-full h-full" />
          </button>
        </div>

        {/* 갤러리 버튼 */}
        <div className="absolute gallery-button right-[4.5rem] z-10">
          <button
            onClick={handleUpload}
            disabled={isLoading || capturedPhotos.length === 0}
            className={`p-4 rounded-full ${
              capturedPhotos.length === 0 ? "opacity-50" : ""
            }`}
          >
            <div className="relative">
              <img src={check} alt="변환하기" className="w-full h-full" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full" />
            </div>
          </button>
        </div>
      </div>
      <BookConvertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uploadStatus={uploadStatus}
      />
    </div>
  );
};

export default Scan;