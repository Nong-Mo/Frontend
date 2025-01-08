import create from 'zustand';

interface PhotoFile {
    id: string;
    data: string;
    vertices?: {
        x: number;
        y: number;
    }[];
}

interface ScanStore {
    photos: PhotoFile[];
    addPhoto: (photo: PhotoFile) => void;
    updatePhotoVertices: (photoId: string, vertices: { x: number; y: number; }[]) => void;
    removePhoto: (id: string) => void;
    clearPhotos: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
    photos: [],
    addPhoto: (photo) => 
        set((state) => ({
            photos: [...state.photos, photo]
        })),
    updatePhotoVertices: (photoId, vertices) =>
        set((state) => ({
            photos: state.photos.map(photo =>
                photo.id === photoId 
                    ? { ...photo, vertices } 
                    : photo
            )
        })),
    removePhoto: (id) =>
        set((state) => ({
            photos: state.photos.filter(photo => photo.id !== id)
        })),
    clearPhotos: () => set({ photos: [] })
}));