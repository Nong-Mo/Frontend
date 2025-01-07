import {Camera} from "react-camera-pro";
import {PhotoPreview, PhotoFile} from "./PhotoPreview.tsx";

interface ScanViewerProps {
    cameraRef: React.RefObject<Camera>;
    errorMessages: {
        noCameraAccessible: string;
        permissionDenied: string;
        switchCamera: string;
        canvas: string;
    };

    // PhotoPreview에 필요한 props 추가
    photos: PhotoFile[];
    onRemove: (id: string) => void;
    isPreviewVisible: boolean;
}

export const ScanViewer = ({
                               cameraRef,
                               errorMessages,
                               photos,
                               onRemove,
                               isPreviewVisible
                           }: ScanViewerProps) => {
    return (
        <div className="relative w-[414px] h-[615px]">
            <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}>
                <Camera
                    ref={cameraRef}
                    aspectRatio="cover"
                    imageType="jpeg"
                    errorMessages={errorMessages}
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

            {/* PhotoPreview를 여기에 포함 */}
            <PhotoPreview
                photos={photos}
                onRemove={onRemove}
                isVisible={isPreviewVisible}
            />
        </div>
    );
};