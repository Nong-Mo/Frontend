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
  // useNavigate : 페이지 이동을 위한 hook
  const navigate = useNavigate();

  // useState Variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // useRef : 컴포넌트가 리렌더링되어도 값을 유지한다.
  const cameraRef = useRef<Camera>(null);

  // Camera Hook에서 필요한 데이터를 반환한다.
  const {
    hasCameraPermission,
    takePhoto,
    capturedPhotos,
    clearPhotos,
    removePhoto,
  } = useCamera(cameraRef);
  
  
// 카메라 초기화를 위한 함수
const resetCamera = () => {
  // 카메라 초기화 프로세스
  // 촬영 데이터 초기화 -> 미리보기 제거 -> 로딩 종료 -> 카메라 에러 초기화 -> 상태 재설정

  clearPhotos(); // 기존 촬영 데이터 초기화
  setIsPreviewVisible(false); // 미리보기 완전히 숨기기
  setIsLoading(false);
  setCameraError(null);
    
  // 컴포넌트 리렌더링을 위한 state 재설정
  setTimeout(() => {
  setIsPreviewVisible(true);
  }, 200);
};

// 카메라 에러를 분기하는 함수
const handleCameraError = (error: Error) => {
    setCameraError(error.message);

    // 심각한 카메라 에러인 경우 (권한 거부, 하드웨어 접근 불가 등)
    if (error.message.includes("권한") || error.message.includes("접근")) {
      alert("카메라 접근에 실패했습니다. 메인 페이지로 이동합니다.");
      resetCamera();

      navigate("/");
      return;
    }

    // 일시적인 에러인 경우
    alert("카메라 촬영에 실패했습니다. 다시 시도해주세요.");
    resetCamera();
  };

// 카메라 촬영
const handleTakePhoto = async () => {
  // 카메라 권한이 없거나 로딩이 켜져있다면
  if (!hasCameraPermission || isLoading) return;

  try {
    setIsLoading(true);
    setCameraError(null);

    const photo = await takePhoto();

    if (photo && photo.data)
      console.log("사진 촬영 성공:", photo.id);
    else
      throw new Error("사진 데이터를 가져올 수 없습니다.");
  }
  catch (error) {
    handleCameraError(error as Error);
  }
  finally {
    setIsLoading(false);
  }
};

const handleUpload = async () => {
  // 업로드 중이거나 촬영된 사진이 없는 경우
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

    // 모든 파일이 유효한지 확인 (100bytes 이상)
    const validFiles = files.filter(file => file.size >= 100);
    if (validFiles.length === 0) {
      throw new Error('유효한 이미지 파일이 없습니다.');
    }

    // 업로드 전에 파일 크기 합계 확인 (API 명세의 제한사항)
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) { // 10MB 제한
      throw new Error('전체 파일 크기가 너무 큽니다.');
    }

    const response = await uploadImages({
      title: "촬영된 이미지들",
      files: validFiles,
    });

    if (response) {
      setUploadStatus({
        success: true,
        message: response.message,
      });
      setIsModalOpen(true);
      clearPhotos();
    }
  }
  catch (error: any) {
    let errorMessage;

    switch(error?.response?.status) {
      case 401:
        resetCamera();

        break;
      default:
          errorMessage = "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
    }

    if (error?.response?.status === 401) {
      // 401 에러는 이제 axios interceptor에서 처리되므로,
      // auth:unauthorized 이벤트를 통해 처리됨
    } else {
      // API 명세에 맞는 에러 메시지 처리
      // ?.로 접근하고 error.message 없으면 문자열 반환
      errorMessage = error?.response?.data?.detail?.[0]?.msg
        ?? error.message
        ?? "이미지 업로드에 실패했습니다. 다시 시도해주세요.";

      setUploadStatus({
        success: false,
        message: errorMessage,
      });

    }
    resetCamera();
  }
  finally {
    setIsLoading(false);
  }
};

// 카메라 에러 상태에 따른 UI 처리
if (cameraError) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-xl mb-4">카메라 오류</h2>
      <p className="text-center mb-6">{cameraError}</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}

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
              ref={cameraRef}
              aspectRatio="cover"
              imageType="jpeg"
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