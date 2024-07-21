export interface PhotoState {
    name: string;
    type: string;
    uri: string;
    timestamp: number;
    location: {
        latitude?: number;
        longitude?: number;
        altitude?: number;
        heading?: number;
        speed?: number;
    } | null;
}
export interface AlbumState {
    label: string;
    value: string;
    count: number;
}
