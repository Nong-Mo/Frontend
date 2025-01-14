import { Camera, Image, Check } from 'lucide-react';

interface CameraControlsProps {
    onTakePhoto: () => void;
    onUpload: () => void;
    onGalleryPhoto: () => void;
    isLoading: boolean;
    hasCameraPermission: boolean;
    hasPhotos: boolean;
}

export const CameraControls = ({
                                   onTakePhoto,
                                   onUpload,
                                   onGalleryPhoto,
                                   isLoading,
                                   hasCameraPermission,
                                   hasPhotos,
                               }: CameraControlsProps) => {
    return (
        <div className="relative w-full h-[187.5px] flex items-center justify-center bg-[#181A20]">
            <div className="w-full bg-[#181A20] p-4">
                <div className="grid grid-cols-3 gap-4">
                    {/* 촬영하기 버튼 */}
                    <button
                        onClick={onTakePhoto}
                        disabled={isLoading}
                        className={`flex flex-col items-center justify-center bg-[#262A34] rounded-[16.5px] p-4${
                            hasCameraPermission && !isLoading ? "opacity-100" : "opacity-50"
                        }`}
                    >
                        <Camera className="w-12 h-12 mb-2 text-white" />
                        <span className="text-sm text-gray-200">촬영하기</span>
                    </button>

                    {/* 갤러리 버튼 */}
                    <button
                        onClick={onGalleryPhoto}
                        disabled={isLoading}
                        className={`flex flex-col items-center justify-center bg-[#262A34] rounded-[16.5px] p-4 ${
                            hasCameraPermission && !isLoading ? "opacity-100" : "opacity-50"
                        }`}
                    >
                        <Image className="w-12 h-12 mb-2 text-white" />
                        <span className="text-sm text-gray-200">갤러리</span>
                    </button>

                    {/* 변환하기 버튼 */}
                    <button
                        onClick={onUpload}
                        disabled={isLoading || !hasPhotos}
                        className={`flex flex-col items-center justify-center bg-[#262A34] rounded-[16.5px] p-4 ${
                            !hasPhotos ? "opacity-50" : "opacity-100"
                        }`}
                    >
                        <Check className="w-12 h-12 mb-2 text-white" />
                        <span className="text-sm text-gray-200">변환하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};