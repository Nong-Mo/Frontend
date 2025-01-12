export interface PhotoFile {
    id: string;
    data: string;
    vertices?: {
        x: number;
        y: number;
    }[];
}