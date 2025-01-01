import React, { useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/common/NavBar";
import BookConvertModal from "../components/scan/BookConvertModal";
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
 
 const { 
   camera, 
   hasCameraPermission, 
   takePhoto, 
   capturedPhotos,
   clearPhotos,
   removePhoto 
 } = useCamera();

 const handleTakePhoto = async () => {
   if (!hasCameraPermission || isLoading) return;
   
   try {
     const photo = takePhoto();
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
    const filePromises = capturedPhotos.map(async photo => {
      const base64Response = await fetch(photo.data);
      const blob = await base64Response.blob();
      return new File([blob], `photo-${photo.id}.jpg`, { type: 'image/jpeg' });
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
    console.error('업로드 에러:', error);
    
    let errorMessage;
    if (error.message.includes('토큰')) {
      errorMessage = error.message;
      // 토큰 관련 에러면 로그인 페이지로 리다이렉트
      navigate('/signin');
    } else {
      errorMessage = error.response?.data?.detail?.[0]?.msg || 
                    error.response?.data?.message || 
                    '이미지 업로드에 실패했습니다. 다시 시도해주세요.';
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
   <div className="page-container w-full h-screen flex flex-col z-10">
     <NavBar title="스캔하기" />
     
     {/* Main Content Area */}
     <div className="flex-1 flex flex-col">
       {/* Camera View */}
       <div className="w-full flex-1 flex items-center justify-center bg-black">
         <div className="relative w-full h-full">
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
               width: "100%",
               height: "100%",
               objectFit: "cover",
             }}
           />
         </div>
       </div>

       {/* Preview Section */}
       {capturedPhotos.length > 0 && (
         <div className="w-full bg-black/50 py-3">
           <div className="mx-4">
             <div className="flex overflow-x-auto gap-3 scrollbar-hide">
               {capturedPhotos.map(photo => (
                 <div key={photo.id} className="flex-none relative">
                   <img 
                     src={photo.data} 
                     alt="촬영된 사진" 
                     className="w-24 h-24 object-cover rounded-lg"
                     style={{ aspectRatio: '1/1' }}
                   />
                   <button
                     onClick={() => removePhoto(photo.id)}
                     className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white shadow-lg"
                   >
                     ✕
                   </button>
                 </div>
               ))}
             </div>
           </div>
         </div>
       )}

       {/* Controls */}
       <div className="w-full h-[199px] flex items-center justify-center relative bg-[#181A20]">
         <button
           onClick={handleTakePhoto}
           disabled={isLoading}
           className={`flex items-center justify-center w-20 h-20 transition-opacity ${
             hasCameraPermission && !isLoading ? "opacity-100" : "opacity-50"
           }`}
         >
           <img src={shutter} alt="촬영하기" className="w-full h-full" />
         </button>

         <button 
           onClick={handleUpload}
           disabled={isLoading || capturedPhotos.length === 0}
           className={`absolute right-[4.5rem] p-4 rounded-full ${capturedPhotos.length === 0 ? 'opacity-50' : ''}`}
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