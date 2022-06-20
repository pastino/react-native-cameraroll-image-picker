/// <reference types="react" />
import { GroupType, AssetType } from "@react-native-community/cameraroll";
import { PhotoState, AlbumState } from "./types";
interface Props {
    ref?: any;
    initialNumToRender?: number;
    groupTypes?: GroupType;
    assetType?: AssetType;
    maximum?: number;
    imagesPerRow?: number;
    imageMargin?: number;
    containerWidth?: number;
    backgroundColor?: string;
    emptyText?: string;
    emptyTextStyle?: string;
    loader?: JSX.Element;
    album?: string;
    albums?: AlbumState[];
    isMultiSelect?: boolean;
    onChangePhotosEvent?: (e: {
        selected: PhotoState[];
        item: PhotoState;
        index: number;
        isChecked: boolean;
    }) => void;
    onMaxSelectedEvent?: () => void;
    getAlbumsData?: (albums: AlbumState[]) => void;
    onChangeAlbumEvent?: (album: string) => void;
}
export declare const getAlbums: () => Promise<any[]>;
export declare const ImagePicker: ({ ref, initialNumToRender, groupTypes, assetType, maximum, imagesPerRow, imageMargin, containerWidth, backgroundColor, onChangePhotosEvent, onMaxSelectedEvent, getAlbumsData, onChangeAlbumEvent, album, albums, isMultiSelect, emptyText, emptyTextStyle, loader, }: Props) => JSX.Element;
export {};
