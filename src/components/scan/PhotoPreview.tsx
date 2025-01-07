export interface PhotoFile {
    id: string;
    data: string;
}

interface PhotoPreviewProps {
    photos: PhotoFile[];
    onRemove: (id: string) => void;
    isVisible: boolean;
}

export const PhotoPreview = ({ photos, onRemove, isVisible }: PhotoPreviewProps) => {
    if (!isVisible || photos.length === 0) return null;

    return (
        <div className="absolute bottom-0 left-0 w-full py-3 bg-black/70 z-10">
            <div className="mx-4">
                <div className="flex overflow-x-auto gap-3 scrollbar-hide">
                    {photos.map((photo) => (
                        <div key={photo.id} className="flex-none relative">
                            <img
                                src={photo.data}
                                alt="촬영된 사진"
                                className="w-24 h-24 object-cover rounded-lg"
                                style={{ aspectRatio: "1/1" }}
                            />
                            <button
                                onClick={() => onRemove(photo.id)}
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
    );
};