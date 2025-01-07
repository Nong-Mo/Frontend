import shutter from "../../icons/camera/camera_shutter.svg";
import check from "../../icons/camera/check.svg";

interface CameraControlsProps {
    onTakePhoto: () => void;
    onUpload: () => void;
    isLoading: boolean;
    hasCameraPermission: boolean;
    hasPhotos: boolean;
}

export const CameraControls = ({
                                   onTakePhoto,
                                   onUpload,
                                   isLoading,
                                   hasCameraPermission,
                                   hasPhotos,
                               }: CameraControlsProps) => {
    return (
        <div className="relative w-full h-[187.5px] flex items-center justify-center bg-[#181A20]">
            <div className="absolute take-button z-10">
                <button
                    onClick={onTakePhoto}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-20 h-20 transition-opacity ${
                        hasCameraPermission && !isLoading ? "opacity-100" : "opacity-50"
                    }`}
                >
                    <img src={shutter} alt="촬영하기" className="w-full h-full" />
                </button>
            </div>

            <div className="absolute gallery-button right-[62.5px] z-10">
                <button
                    onClick={onUpload}
                    disabled={isLoading || !hasPhotos}
                    className={`rounded-full ${!hasPhotos ? "opacity-50" : ""}`}
                >
                    <div className="relative">
                        <img src={check} alt="변환하기" className="w-full h-full" />
                    </div>
                </button>
            </div>
        </div>
    );
};