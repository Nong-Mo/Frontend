import axiosInstance from '../api/axios.ts';
import {AudioData} from '../types/audio';

export interface StorageResponse {
    fileID: string;
    fileName: string;
    uploadDate: string;
    fileUrl: string;
    fileType: string;
    contents: string;
    relatedFile?: {
        fileUrl: string;
        fileType: string;
    };
}

export const audioService = {
    fetchAudioData: async (id: string): Promise<AudioData> => {
        const {data} = await axiosInstance.get<StorageResponse>(`storage/files/${id}`);

        return {
            id: data.fileID,
            title: data.fileName,
            bookName: data.fileName,
            createdAt: new Date(data.uploadDate).toISOString().split('T')[0],
            audioUrl: data.fileUrl,
            bookCover: '/covers/audio_cover.png'
        };
    }
};