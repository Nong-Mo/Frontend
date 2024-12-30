import { useRef, useState, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";

// Navigation Bar 컴포넌트
const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 right-0 h-14 bg-black/70 backdrop-blur-md z-50">
      <div className="h-full px-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// 권한 요청 UI 컴포넌트
const PermissionRequest = ({
  onRequestPermission,
}: {
  onRequestPermission: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
        <div className="mb-6 text-center">
          {/* 카메라 아이콘 */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold mb-2">
            카메라 권한이 필요합니다
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            이 기능을 사용하기 위해서는 카메라 접근 권한이 필요합니다. 카메라는
            사진 촬영에만 사용되며, 다른 용도로는 사용되지 않습니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRequestPermission}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            권한 허용하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 갤러리 아이템의 타입 정의
interface GalleryItem {
  id: string;
  photo: string;
  timestamp: number;
}

const Scan = () => {
  const camera = useRef<any>(null);
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(
    () => {
      const savedPermission = localStorage.getItem("cameraPermission");
      return savedPermission === "granted";
    }
  );

  // 로컬 스토리지에서 갤러리 아이템 로드
  useEffect(() => {
    const savedItems = localStorage.getItem("gallery");
    if (savedItems) {
      setGalleryItems(JSON.parse(savedItems));
    }
  }, []);

  // 컴포넌트 마운트 시 권한 확인
  useEffect(() => {
    if (!hasCameraPermission) {
      setShowPermissionRequest(true);
    }
  }, [hasCameraPermission]);

  // 카메라 권한 요청 및 상태 저장
  const requestCameraPermission = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setShowPermissionRequest(false);
      localStorage.setItem("cameraPermission", "granted");
      // 스트림 정리
      result.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera permission denied:", error);
      setHasCameraPermission(false);
      localStorage.setItem("cameraPermission", "denied");
      alert(
        "카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요."
      );
    }
  };

  // 갤러리 아이템 저장
  const saveToGallery = (photoData: string) => {
    const newItem: GalleryItem = {
      id: `photo-${Date.now()}`,
      photo: photoData,
      timestamp: Date.now(),
    };

    const updatedItems = [...galleryItems, newItem];
    setGalleryItems(updatedItems);

    // 로컬 스토리지에 저장
    localStorage.setItem("gallery", JSON.stringify(updatedItems));

    // 저장 완료 알림
    alert("사진이 갤러리에 저장되었습니다.");
  };

  // 사진 촬영 및 저장
  const handleTakePhoto = () => {
    if (camera.current && hasCameraPermission) {
      const photo = camera.current.takePhoto();
      saveToGallery(photo);
    } else if (!hasCameraPermission) {
      setShowPermissionRequest(true);
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
    <div className="relative h-screen w-full flex justify-center bg-black">
      <div className="relative w-full max-w-screen-sm">
        {/* Navigation Bar - Camera 너비에 맞춤 */}
        <NavigationBar />

        {showPermissionRequest && (
          <PermissionRequest onRequestPermission={requestCameraPermission} />
        )}

        {/* Camera View - 상단 네비게이션 바 높이만큼 여백 추가 */}
        <div className="h-full pt-14">
          {hasCameraPermission ? (
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
          ) : (
            <div className="h-full bg-gray-900" />
          )}
        </div>

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
              className={`w-16 h-16 rounded-full border-4 border-white transition-opacity ${
                hasCameraPermission ? "bg-white/20" : "bg-white/5 opacity-50"
              }`}
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
    </div>
  );
};

export default Scan;
